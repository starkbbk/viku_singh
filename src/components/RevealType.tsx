'use client';

import { useRef, type CSSProperties } from 'react';
import { useInView } from 'framer-motion';

/** One accessible text layer; the outline and developing fill are decorative. */
export default function RevealType({ lines, play = true, accentLine = -1 }: {
  lines: string[];
  play?: boolean;
  accentLine?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return <span ref={ref} className="motion-type" data-revealed={inView && play}>
    {lines.map((line, index) => <span
      className={`type-line${index === accentLine ? ' type-accent' : ''}`}
      key={`${index}:${line}`}
      style={{ '--line-delay': `${index * 110}ms` } as CSSProperties}
    >
      <span className="type-text">{line}</span>{' '}
      <span className="type-outline" aria-hidden="true">{line}</span>
      <span className="type-fill" aria-hidden="true">{line}</span>
    </span>)}
  </span>;
}
