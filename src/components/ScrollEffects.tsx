'use client';

import { useEffect, useRef, type CSSProperties, type RefObject } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import Image from 'next/image';

/** Progressive enhancement: server-rendered content stays visible without JavaScript. */
export function useScrollReveals(root: RefObject<HTMLElement | null>, contentKey: string) {
  const revealed = useRef(new WeakSet<Element>());
  useEffect(() => {
    const surface = root.current;
    if (!surface || !('IntersectionObserver' in window)) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const active = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || preference.matches) continue;
        const element = entry.target as HTMLElement;
        if (revealed.current.has(element)) { observer.unobserve(element); continue; }
        revealed.current.add(element);
        const type = element.dataset.reveal;
        const frames: Keyframe[] = type === 'photo'
          ? [{ opacity: 0.25, transform: 'translateY(42px) scale(.96)', clipPath: 'inset(0 0 16% 0)' }, { opacity: 1, transform: 'translateY(0) scale(1)', clipPath: 'inset(0 0 0 0)' }]
          : type === 'line'
          ? [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }]
          : [{ opacity: 0.1, transform: `translateY(${type === 'heading' ? 45 : 26}px)` }, { opacity: 1, transform: 'translateY(0)' }];
        const animation = element.animate(frames, { duration: type === 'photo' ? 950 : 850, delay: Number(element.dataset.revealDelay || 0), easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
        active.add(animation);
        animation.finished.then(() => active.delete(animation)).catch(() => active.delete(animation));
        observer.unobserve(element);
      }
    }, { threshold: 0.06, rootMargin: '0px 0px -25px 0px' });
    surface.querySelectorAll('[data-reveal]').forEach(element => { if (!revealed.current.has(element)) observer.observe(element); });
    const cancelMotion = () => { if (preference.matches) active.forEach(animation => animation.cancel()); };
    preference.addEventListener('change', cancelMotion);
    return () => { observer.disconnect(); active.forEach(animation => animation.cancel()); preference.removeEventListener('change', cancelMotion); };
  }, [root, contentKey]);
}

interface StripPhoto { id: string; thumbnail: string; category: string; width: number; height: number; alt: string }

function FilmstripFrame({ photo, index, progress }: { photo: StripPhoto; index: number; progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const direction = index % 2 ? 1 : -1;
  const y = useTransform(progress, [0, 1], [direction * -10, direction * 10]);
  const labelX = useTransform(progress, [0, 1], [direction * 4, direction * -4]);
  return <motion.div className="scroll-film-frame" style={{ y: reduced ? 0 : y }}>
    <motion.span style={{ x: reduced ? 0 : labelX }}>VS — {String(index+1).padStart(2,'0')}</motion.span>
    <Image src={photo.thumbnail} alt={photo.alt} width={photo.width} height={photo.height} unoptimized loading="lazy"/>
    <motion.span style={{ x: reduced ? 0 : labelX }}>{photo.category.toUpperCase()}<i>35 / VS</i></motion.span>
  </motion.div>;
}

export function SectionLens() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-25, 65]);
  const y = useTransform(scrollYProgress, [0, 1], [35, -35]);
  return <div className="section-lens" ref={ref} aria-hidden="true"><motion.div className="section-lens-ring" style={{ rotate: reduced ? 0 : rotate, y: reduced ? 0 : y }}><span className="section-lens-cross"/></motion.div></div>;
}

/** A few drifting flecks of light, paused whenever the scene is off screen. */
export function FloatingGrain({ play }: { play: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  return <div ref={ref} className="floating-grain" data-running={play && visible} aria-hidden="true">
    {Array.from({ length: 14 }, (_, index) => <i key={index} style={{
      left: `${(index * 37 + 11) % 100}%`,
      top: `${(index * 23 + 7) % 100}%`,
      '--drift-time': `${12 + index % 6}s`,
      '--drift-delay': `${-index * 1.7}s`,
    } as CSSProperties}/>)}
  </div>;
}

export function FilmstripTransition({ photos, onExplore }: { photos: StripPhoto[]; onExplore: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const reduced = useReducedMotion();
  const x = useTransform(scrollYProgress, [0, 1], ['8%', '-24%']);
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 2]);
  const textX = useTransform(scrollYProgress, [0, 1], ['-8%', '4%']);
  const opacity = useTransform(scrollYProgress, [0, .2, .8, 1], [.15, 1, 1, .15]);
  return <section className="filmstrip-interlude" ref={ref} aria-label="A glimpse through the collections">
    <motion.div className="interlude-title" style={{ x: reduced ? 0 : textX }} aria-hidden="true">LIFE IN <em>FRAMES.</em></motion.div>
    <motion.div className="scroll-filmstrip" style={{ x: reduced ? 0 : x, rotate: reduced ? 0 : rotate, opacity: reduced ? 1 : opacity }}>
      {photos.map((photo,index) => <FilmstripFrame key={photo.id} photo={photo} index={index} progress={scrollYProgress}/>)}
    </motion.div>
    <div className="interlude-bottom" data-reveal="text"><span>THE PLACES. THE PEOPLE. THE IN-BETWEEN.</span><a href="#portfolio" onClick={onExplore}>Explore every frame ↓</a></div>
  </section>;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="page-scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true"/>;
}
