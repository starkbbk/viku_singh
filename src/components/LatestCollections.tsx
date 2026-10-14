'use client';

import { useState, type PointerEvent } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand } from 'lucide-react';

interface LatestPhoto {
  id: string; category: string; src: string; thumbnail: string;
  width: number; height: number; title: string; alt: string; recent?: boolean;
}
const collections = [
  { category: 'Motorsport', label: 'TRACKSIDE STORIES', title: 'Built for the rush.', description: 'Tyre smoke. Golden light. The art of a split second.' },
  { category: 'Events', label: 'FROM THE FRONT ROW', title: 'Feel the room.', description: 'The lights, the voices, the moments that stay with you.' },
];

export default function LatestCollections({ photos, onExplore, onOpen }: {
  photos: LatestPhoto[]; onExplore: (category: string) => void; onOpen: (photo: LatestPhoto) => void;
}) {
  const [selection, setSelection] = useState({ collection: 0, frame: 0 });
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerX, { stiffness: 140, damping: 26, mass: .65 });
  const rotateY = useSpring(pointerY, { stiffness: 140, damping: 26, mass: .65 });
  const collection = collections[selection.collection];
  const frames = photos.filter(photo => photo.recent && photo.category === collection.category);
  if (!frames.length) return null;
  const active = frames[selection.frame % frames.length];
  const reset = () => { pointerX.set(0); pointerY.set(0); };
  const track = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(-((event.clientY - bounds.top) / bounds.height - .5) * 7);
    pointerY.set(((event.clientX - bounds.left) / bounds.width - .5) * 10);
  };
  const changeFrame = (direction: number) => setSelection(current => ({ ...current, frame: (current.frame + direction + frames.length) % frames.length }));

  return <section className="latest-section" aria-labelledby="latest-heading">
    <div className="section-kicker"><span><span className="live-dot"/> JUST ADDED / NEW PERSPECTIVES</span><span>{photos.filter(photo => photo.recent).length} NEW FRAMES</span></div>
    <div className="latest-layout">
      <div className="latest-copy">
        <div className="latest-tabs" aria-label="Featured collections">
          {collections.map((item, index) => <button key={item.category} aria-pressed={selection.collection === index} onClick={() => { reset(); setSelection({ collection: index, frame: 0 }); }}>
            {selection.collection === index && <motion.span className="latest-tab-background" layoutId="latest-tab" transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 32 }} />}
            <span>{item.category}</span>
          </button>)}
        </div>
        <span className="eyebrow latest-eyebrow">{collection.label}</span>
        <h2 id="latest-heading">{collection.title}</h2>
        <p>{collection.description}</p>
        <a className="text-link" href="#portfolio" onClick={() => onExplore(collection.category)}>Explore {collection.category.toLowerCase()} <ArrowUpRight size={17}/></a>
        <div className="latest-controls">
          <button className="latest-arrow" onClick={() => changeFrame(-1)} aria-label="Previous featured photograph"><ChevronLeft size={20}/></button>
          <span aria-live="polite" aria-atomic="true">{String(selection.frame + 1).padStart(2, '0')} <span>/ {String(frames.length).padStart(2, '0')}</span></span>
          <button className="latest-arrow" onClick={() => changeFrame(1)} aria-label="Next featured photograph"><ChevronRight size={20}/></button>
        </div>
      </div>
      <div className="latest-stage" onPointerMove={track} onPointerLeave={reset} onPointerCancel={reset}>
        <div className="latest-orbit" aria-hidden="true"/>
        <motion.div className="latest-deck" style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}>
          {[2, 1, 0].map(depth => {
            const photo = frames[(selection.frame + depth) % frames.length];
            return <motion.div key={depth} className={`latest-print latest-print-${depth}`} animate={{ x: depth * 20, y: depth * -17, rotate: depth * 4, z: depth * -40 }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 28 }} aria-hidden={depth > 0 ? true : undefined}>
              {depth === 0 ? <button className="latest-photo-button" onClick={() => onOpen(active)} aria-label={`Open ${active.title}`}>
                <motion.div key={active.id} className="latest-photo-image" initial={reduced ? false : { opacity: .25, scale: .975, rotateY: 8 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: reduced ? 0 : .5, ease: [.2,.75,.2,1] }}>
                  <Image src={photo.src} alt={photo.alt} fill unoptimized sizes="(max-width: 800px) 85vw, 52vw" loading="lazy"/>
                </motion.div>
                <span className="latest-expand"><Expand size={16}/></span>
              </button> : <div className="latest-photo-image"><Image src={photo.thumbnail} alt="" fill unoptimized loading="lazy" sizes="200px"/></div>}
              <div className="latest-print-caption"><span>{photo.title}</span><span>VS / {String((selection.frame + depth) % frames.length + 1).padStart(2, '0')}</span></div>
            </motion.div>;
          })}
        </motion.div>
        <span className="latest-stage-note">A SMALL COLLECTION. A BIG FEELING.</span>
      </div>
    </div>
  </section>;
}
