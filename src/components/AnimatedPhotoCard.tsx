'use client';

import { useEffect, useMemo, useRef, type PointerEvent } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Expand } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { getPhotoMotion } from '@/lib/photo-motion';

interface CardPhoto {
  id: string; category: string; thumbnail: string; width: number; height: number; alt: string;
}

export default function AnimatedPhotoCard({ photo, index, onOpen }: {
  photo: CardPhoto; index: number; onOpen: () => void;
}) {
  const profile = useMemo(() => getPhotoMotion(photo.id), [photo.id]);
  const reduced = useReducedMotion();
  const canTilt = useRef(false);
  const turnX = useMotionValue(0);
  const turnY = useMotionValue(0);
  const hover = useMotionValue(0);
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(50);
  const spring = { stiffness: 210, damping: 28, mass: 0.55 };
  const rotateX = useSpring(turnX, spring);
  const rotateY = useSpring(turnY, spring);
  const illumination = useSpring(hover, spring);
  const imageScale = useTransform(illumination, [0, 1], [1, 1.045]);
  const imageX = useTransform(rotateY, value => value * -0.7);
  const imageY = useTransform(rotateX, value => value * 0.7);
  const glare = useMotionTemplate`radial-gradient(260px circle at ${lightX}% ${lightY}%, rgba(255, 249, 212, .2), transparent 72%)`;

  useEffect(() => {
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => {
      canTilt.current = pointer.matches && !reduced;
      if (!canTilt.current) { turnX.set(0); turnY.set(0); hover.set(0); }
    };
    sync();
    pointer.addEventListener('change', sync);
    return () => pointer.removeEventListener('change', sync);
  }, [reduced, turnX, turnY, hover]);

  const reset = () => { turnX.set(0); turnY.set(0); hover.set(0); };
  const track = (event: PointerEvent<HTMLButtonElement>) => {
    if (!canTilt.current || event.pointerType !== 'mouse') return;
    const bounds = (event.currentTarget.parentElement ?? event.currentTarget).getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    turnX.set(-y * profile.tilt * .65);
    turnY.set(x * profile.tilt * .65);
    lightX.set((x + 1) * 50);
    lightY.set((y + 1) * 50);
    hover.set(1);
  };

  return <figure className="photo-card animated-photo" data-photo-id={photo.id} data-motion={profile.variant}>
    <div className="photo-entry">
      <div className="photo-depth-layer">
        <motion.button
          className="photo-open"
          onClick={onOpen}
          aria-label={`Open ${photo.alt}`}
          style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}
          whileTap={reduced ? undefined : { scale: .985 }}
          onPointerMove={track}
          onPointerLeave={reset}
          onPointerCancel={reset}
          onBlur={reset}
        >
          <span className="photo-canvas">
            <motion.span className="photo-image-layer" style={{ scale: reduced ? 1 : imageScale, x: reduced ? 0 : imageX, y: reduced ? 0 : imageY }}>
              <Image src={photo.thumbnail} alt={photo.alt} width={photo.width} height={photo.height} unoptimized loading="lazy" sizes="(max-width: 359px) 90vw, (max-width: 1024px) 45vw, 30vw"/>
            </motion.span>
          </span>
          <motion.span className="photo-glare" style={{ background: glare, opacity: reduced ? 0 : illumination }} aria-hidden="true"/>
          <span className="photo-focus-corners" aria-hidden="true"><i/><i/><i/><i/></span>
          <span className="photo-hover"><span>VIEW PHOTOGRAPH</span><Expand size={18}/></span>
          <span className="photo-edge-light" aria-hidden="true"/>
        </motion.button>
      </div>
    </div>
    <figcaption><span>{photo.category}</span><span>{String(index + 1).padStart(2, '0')} <ArrowUpRight size={12}/></span></figcaption>
    <span className="photo-caption-line" aria-hidden="true"/>
  </figure>;
}
