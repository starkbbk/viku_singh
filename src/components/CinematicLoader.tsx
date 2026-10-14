'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Aperture, ArrowUpRight } from 'lucide-react';
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { createIntroSequence, INTRO_TIMING } from '@/lib/intro-sequence';
import { MOBILE_PHOTO_MEDIA } from '@/lib/responsive-photo';
import styles from './CinematicLoader.module.css';

interface IntroPhoto { id: string; src: string; thumbnail: string; category: string; featured: number; recent?: boolean }
interface CinematicLoaderProps { photos: IntroPhoto[]; onComplete: () => void }

export default function CinematicLoader({ photos, onComplete }: CinematicLoaderProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sequenceRef = useRef<ReturnType<typeof createIntroSequence> | null>(null);
  const reducedMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const [revealing, setRevealing] = useState(false);
  const [readyFrames, setReadyFrames] = useState<string[]>([]);
  const frames = useMemo(() => [
    ...photos.filter(photo => photo.recent),
    ...photos.filter(photo => !photo.recent && photo.featured >= 0),
    ...photos.filter(photo => !photo.recent && photo.featured < 0),
  ].slice(0, 8), [photos]);
  const openingPhotos = useMemo(() => photos.filter(photo => photo.featured >= 0 && photo.featured < 4), [photos]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    let disposed = false;
    const oldOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // This is the intro's visual timeline, not a network-download percentage.
    progress.set(0);
    let progressAnimation = animate(progress, 0.9, {
      duration: reduced ? 0 : INTRO_TIMING.minimumMs / 1000,
      ease: [0.2, 0.6, 0.3, 1],
    });
    const sequence = createIntroSequence({
      reducedMotion: reduced,
      onExit: () => {
        progressAnimation.stop();
        progressAnimation = animate(progress, 1, { duration: reduced ? 0 : 0.2 });
        setRevealing(true);
      },
      onFinish: onComplete,
    });
    sequenceRef.current = sequence;
    const compact = window.matchMedia(MOBILE_PHOTO_MEDIA).matches;
    const pendingImages: HTMLImageElement[] = [];
    const checks = new Map<string, Promise<boolean>>();
    const loadImage = (src: string) => {
      const cached = checks.get(src);
      if (cached) return cached;
      const check = new Promise<boolean>(resolve => {
        const img = new window.Image();
        pendingImages.push(img);
        let checked = false;
        const done = (loaded: boolean) => {
          if (checked) return;
          checked = true;
          img.onload = null;
          img.onerror = null;
          resolve(loaded);
        };
        img.onload = () => { img.decode().then(() => done(true), () => done(false)); };
        img.onerror = () => done(false);
        img.src = src;
      });
      checks.set(src, check);
      return check;
    };
    const openingReady = Promise.all(openingPhotos.map(photo => loadImage(compact ? photo.thumbnail : photo.src)));
    const filmReady = reduced ? Promise.resolve() : Promise.all(frames.map(async photo => ({ id: photo.id, loaded: await loadImage(photo.thumbnail) })))
      .then(results => { if (!disposed) setReadyFrames(results.filter(result => result.loaded).map(result => result.id)); });
    Promise.all([openingReady, filmReady]).then(() => { if (!disposed) sequence.assetsReady(); });
    return () => {
      disposed = true;
      sequence.dispose();
      progressAnimation.stop();
      sequenceRef.current = null;
      pendingImages.forEach(img => { img.onload = null; img.onerror = null; });
      document.documentElement.style.overflow = oldOverflow;
      dialog.close();
    };
  }, [frames, openingPhotos, onComplete, progress]);

  const skipIntro = () => sequenceRef.current?.skip();
  return <motion.dialog
    ref={dialogRef}
    className={styles.loader}
    aria-label="Viku Singh photography introduction"
    initial={false}
    animate={revealing ? 'exit' : 'visible'}
    variants={{ visible: { opacity: 1 }, exit: { opacity: 0 } }}
    transition={{ duration: reducedMotion ? 0 : INTRO_TIMING.fadeMs / 1000, ease: 'easeInOut' }}
    onAnimationComplete={definition => { if (definition === 'exit') sequenceRef.current?.animationFinished(); }}
    onCancel={event => { event.preventDefault(); skipIntro(); }}
  >
    <div className={styles.viewfinder} aria-hidden="true"><i/><i/><i/><i/></div>
    <div className={styles.top}>
      <span className={styles.brand}><Aperture size={23} strokeWidth={1.2}/> VIKU SINGH</span>
      <button autoFocus onClick={skipIntro}>Skip intro <ArrowUpRight size={16}/></button>
    </div>
    <div className={styles.filmspace} data-ready={readyFrames.length > 0} aria-hidden="true">
      {[0, 1].map(row => <div className={`${styles.film} ${row === 0 ? styles.filmTop : styles.filmBottom}`} key={row}>
        {frames.slice(row * 4, row * 4 + 4).filter(photo => readyFrames.includes(photo.id)).map((photo, index) => <div className={styles.negative} key={photo.id}>
          <span>VIKU SINGH — {String(row * 4 + index + 1).padStart(2, '0')}</span>
          <Image src={photo.thumbnail} alt="" width={280} height={185} unoptimized loading="eager"/>
          <span>{photo.category.toUpperCase()} <i>◀</i></span>
        </div>)}
      </div>)}
    </div>
    <div className={styles.title}>
      <div className={styles.eyebrow}><span/> A DIFFERENT WAY OF SEEING</div>
      <p aria-label="Every frame. A feeling.">
        <span className={styles.line} aria-hidden="true"><span>Every frame.</span></span>
        <span className={`${styles.line} ${styles.accent}`} aria-hidden="true"><span>A feeling.</span></span>
      </p>
      <div className={styles.credit}>PHOTOGRAPHY BY VIKU SINGH</div>
    </div>
    <div className={styles.bottom}>
      <span className={styles.location}>NEW DELHI, INDIA<span>Light. Life. Everything in between.</span></span>
      <div className={styles.progress}>
        <div className={styles.progressLabel} role="status"><span>{revealing ? 'WELCOME TO THE FRAME' : 'OPENING THE ARCHIVE'}</span><span className={styles.statusDot}/></div>
        <div className={styles.track} aria-hidden="true"><motion.div style={{ scaleX: progress }}/></div>
      </div>
      <Aperture className={styles.aperture} size={36} strokeWidth={0.8} aria-hidden="true"/>
    </div>
  </motion.dialog>;
}
