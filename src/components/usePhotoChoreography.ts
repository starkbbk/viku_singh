'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { getPhotoMotion } from '@/lib/photo-motion';

/** One scroll scheduler for visible photographs, regardless of archive size. */
export default function usePhotoChoreography(root: RefObject<HTMLElement | null>, contentKey: string, paused: boolean) {
  const seen = useRef(new WeakSet<Element>());
  useEffect(() => {
    const surface = root.current;
    if (!surface || paused || !('IntersectionObserver' in window)) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = window.matchMedia('(max-width: 1024px), (pointer: coarse)');
    const cards = [...surface.querySelectorAll<HTMLElement>('[data-photo-id]')];
    const profiles = new Map(cards.map(card => [card, getPhotoMotion(card.dataset.photoId!)]));
    const visible = new Set<HTMLElement>();
    const animations = new Set<Animation>();
    const imageListeners: Array<() => void> = [];
    let frame = 0;

    const reveal = (card: HTMLElement) => {
      if (seen.current.has(card) || !visible.has(card) || document.hidden) return;
      const image = card.querySelector('img');
      if (image && !image.complete) return;
      const layer = card.querySelector<HTMLElement>('.photo-entry');
      const profile = profiles.get(card);
      if (!layer || !profile) return;
      seen.current.add(card);
      card.dataset.photoRevealed = 'true';
      if (preference.matches) return;
      const animation = layer.animate(profile.frames, {
        duration: profile.duration * (compact.matches ? .85 : 1),
        delay: profile.delay,
        easing: 'cubic-bezier(.2,.75,.2,1)',
        fill: 'backwards',
      });
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation)).catch(() => animations.delete(animation));
    };

    const updateDepth = () => {
      frame = 0;
      if (preference.matches || document.hidden) return;
      const height = window.innerHeight;
      // Complete geometry reads before writing styles to avoid layout thrashing.
      const updates = [...visible].map(card => {
        const bounds = card.getBoundingClientRect();
        const position = Math.max(-1, Math.min(1, ((bounds.top + bounds.height / 2) - height / 2) / (height / 2 + bounds.height / 2)));
        const depth = Math.min(profiles.get(card)!.depth * .6, compact.matches ? 3 : 7);
        return { card, y: position * depth };
      });
      updates.forEach(({ card, y }) => card.style.setProperty('--photo-depth-y', `${y.toFixed(2)}px`));
    };
    const schedule = () => {
      if (!frame && visible.size && !document.hidden && !preference.matches) frame = requestAnimationFrame(updateDepth);
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const card = entry.target as HTMLElement;
        if (entry.isIntersecting) { visible.add(card); reveal(card); }
        else { visible.delete(card); card.style.removeProperty('--photo-depth-y'); }
      });
      schedule();
    }, { threshold: .08 });
    cards.forEach(card => {
      observer.observe(card);
      const image = card.querySelector('img');
      if (image && !image.complete) {
        const ready = () => reveal(card);
        image.addEventListener('load', ready);
        image.addEventListener('error', ready);
        imageListeners.push(() => { image.removeEventListener('load', ready); image.removeEventListener('error', ready); });
      }
    });
    const stop = () => {
      cancelAnimationFrame(frame); frame = 0;
      animations.forEach(animation => animation.cancel());
      cards.forEach(card => card.style.removeProperty('--photo-depth-y'));
    };
    const onVisibility = () => {
      if (document.hidden || preference.matches) stop();
      else { visible.forEach(reveal); schedule(); }
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', onVisibility);
    preference.addEventListener('change', onVisibility);
    return () => {
      observer.disconnect(); stop(); imageListeners.forEach(remove => remove());
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', onVisibility);
      preference.removeEventListener('change', onVisibility);
    };
  }, [root, contentKey, paused]);
}
