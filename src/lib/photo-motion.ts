export type PhotoMotionVariant =
  | 'rise'
  | 'diagonal-left'
  | 'diagonal-right'
  | 'iris'
  | 'shutter'
  | 'focus';

export interface PhotoMotionProfile {
  variant: PhotoMotionVariant;
  /** Web Animations timings, in milliseconds. */
  duration: number;
  delay: number;
  /** Maximum image parallax in pixels. */
  depth: number;
  /** Maximum pointer tilt in degrees. */
  tilt: number;
  frames: Keyframe[];
}

const variants: PhotoMotionVariant[] = [
  'rise', 'diagonal-left', 'diagonal-right', 'iris', 'shutter', 'focus',
];

// Identity, rather than gallery position, keeps each photograph's motion the
// same after filtering, pagination, or a new collection order.
function hashPhotoId(id: string): number {
  let hash = 2166136261;
  for (let index = 0; index < id.length; index += 1) {
    hash = Math.imul(hash ^ id.charCodeAt(index), 16777619);
  }
  return hash >>> 0;
}

export function getPhotoMotion(id: string): PhotoMotionProfile {
  const hash = hashPhotoId(id);
  const variant = variants[hash % variants.length];
  const distance = 26 + ((hash >>> 4) % 11);
  const rotation = 1 + ((hash >>> 22) % 81) / 100;
  const start: Keyframe = {
    opacity: 0.18,
    transform: 'none',
    clipPath: 'inset(0% 0% 0% 0%)',
    filter: 'none',
  };
  const end: Keyframe = {
    opacity: 1,
    transform: 'none',
    clipPath: 'inset(0% 0% 0% 0%)',
    filter: 'none',
  };

  switch (variant) {
    case 'rise':
      start.transform = `translate3d(0, ${distance}px, 0) scale(0.98)`;
      start.clipPath = 'inset(0% 0% 10% 0%)';
      break;
    case 'diagonal-left':
      start.transform = `translate3d(-${distance}px, 18px, 0) rotate(-${rotation}deg) scale(0.98)`;
      start.clipPath = 'polygon(0% 0%, 88% 0%, 72% 100%, 0% 100%)';
      end.clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
      break;
    case 'diagonal-right':
      start.transform = `translate3d(${distance}px, 18px, 0) rotate(${rotation}deg) scale(0.98)`;
      start.clipPath = 'polygon(12% 0%, 100% 0%, 100% 100%, 28% 100%)';
      end.clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
      break;
    case 'iris':
      start.transform = 'translate3d(0, 12px, 0) scale(0.96)';
      start.clipPath = 'inset(8% 8% 8% 8% round 18%)';
      end.clipPath = 'inset(0% 0% 0% 0% round 0%)';
      break;
    case 'shutter':
      start.transform = 'translate3d(0, 18px, 0) scale(0.985)';
      start.clipPath = 'inset(0% 0% 85% 0%)';
      break;
    case 'focus':
      start.transform = 'translate3d(0, 14px, 0) scale(0.975)';
      start.filter = 'blur(2px)';
      break;
  }

  return {
    variant,
    duration: 760 + ((hash >>> 8) % 301),
    delay: (hash >>> 17) % 145,
    depth: 6 + (hash % 7),
    tilt: 2 + ((hash >>> 14) % 201) / 100,
    // Return fresh frames: one element's animation must not mutate another's.
    frames: [start, end],
  };
}
