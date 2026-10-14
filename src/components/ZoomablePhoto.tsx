'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Maximize, ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomPhoto { src: string; width: number; height: number; alt: string }

/** The scroll canvas keeps the whole image reachable at any zoom level. */
export default function ZoomablePhoto({ photo }: { photo: ZoomPhoto }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const focalPoint = useRef({ x: .5, y: .5 });
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(() => setSize({ width: viewport.clientWidth, height: viewport.clientHeight }));
    observer.observe(viewport);
    setSize({ width: viewport.clientWidth, height: viewport.clientHeight });
    return () => observer.disconnect();
  }, []);

  const fitScale = Math.min(size.width / photo.width, size.height / photo.height);
  const width = photo.width * fitScale * zoom;
  const height = photo.height * fitScale * zoom;

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollLeft = viewport.scrollWidth * focalPoint.current.x - viewport.clientWidth / 2;
    viewport.scrollTop = viewport.scrollHeight * focalPoint.current.y - viewport.clientHeight / 2;
  }, [zoom, size]);

  const adjustZoom = useCallback((amount: number) => {
    const viewport = viewportRef.current;
    if (viewport) focalPoint.current = {
      x: (viewport.scrollLeft + viewport.clientWidth / 2) / viewport.scrollWidth,
      y: (viewport.scrollTop + viewport.clientHeight / 2) / viewport.scrollHeight,
    };
    setZoom(current => Math.max(1, Math.min(4, current + amount)));
  }, []);
  const resetZoom = useCallback(() => {
    focalPoint.current = { x: .5, y: .5 };
    setZoom(1);
    drag.current = null;
    setDragging(false);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === '+' || event.key === '=') { event.preventDefault(); adjustZoom(.25); }
      if (event.key === '-' || event.key === '_') { event.preventDefault(); adjustZoom(-.25); }
      if (event.key === '0') { event.preventDefault(); resetZoom(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [adjustZoom, resetZoom]);

  return <div className="zoom-viewer">
    <div ref={viewportRef} className={`zoom-viewport${zoom > 1 ? ' is-zoomed' : ''}${dragging ? ' is-dragging' : ''}`} tabIndex={0} aria-label="Photograph. Use zoom controls, then drag or scroll to pan."
      onDoubleClick={() => zoom > 1 ? resetZoom() : adjustZoom(1)}
      onTouchStart={event => { if (zoom > 1) event.stopPropagation(); }}
      onTouchMove={event => { if (zoom > 1) event.stopPropagation(); }}
      onTouchEnd={event => { if (zoom > 1) event.stopPropagation(); }}
      onPointerDown={event => {
        if (zoom <= 1 || event.pointerType !== 'mouse' || event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, top: event.currentTarget.scrollTop };
        setDragging(true);
      }}
      onPointerMove={event => {
        if (!drag.current) return;
        event.currentTarget.scrollLeft = drag.current.left - (event.clientX - drag.current.x);
        event.currentTarget.scrollTop = drag.current.top - (event.clientY - drag.current.y);
      }}
      onPointerUp={event => {
        drag.current = null; setDragging(false);
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onLostPointerCapture={() => { drag.current = null; setDragging(false); }}
      onPointerCancel={() => { drag.current = null; setDragging(false); }}>
      <div className="zoom-canvas" style={{ width: Math.max(size.width, width), height: Math.max(size.height, height) }}>
        <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} unoptimized draggable={false} className="zoom-image" style={{ width: width || 'auto', height: height || 'auto' }}/>
      </div>
    </div>
    <div className="zoom-controls" role="group" aria-label="Photograph zoom controls">
      <button onClick={() => adjustZoom(-.25)} disabled={zoom <= 1} aria-label="Zoom out" title="Zoom out (−)"><ZoomOut size={18}/></button>
      <output aria-live="polite" aria-label="Zoom level">{Math.round(zoom * 100)}%</output>
      <button onClick={() => adjustZoom(.25)} disabled={zoom >= 4} aria-label="Zoom in" title="Zoom in (+)"><ZoomIn size={18}/></button>
      <span className="zoom-control-divider" aria-hidden="true"/>
      <button onClick={resetZoom} className="zoom-fit" aria-label="Reset zoom to fit" title="Reset zoom (0)"><Maximize size={16}/><span>Fit</span></button>
    </div>
  </div>;
}
