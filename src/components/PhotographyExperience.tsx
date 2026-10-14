'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import CinematicLoader from './CinematicLoader';
import RevealType from './RevealType';
import ZoomablePhoto from './ZoomablePhoto';
import LatestCollections from './LatestCollections';
import AnimatedPhotoCard from './AnimatedPhotoCard';
import usePhotoChoreography from './usePhotoChoreography';
import { FilmstripTransition, FloatingGrain, SectionLens, ScrollProgress, useScrollReveals } from './ScrollEffects';
import { CHAPTER_COUNT, WIPE_HALF_SPAN, FULL_FRAME, HIDDEN_FRAME, chapterAtProgress, chapterLandingProgress } from '@/lib/photo-journey';
import { MOBILE_PHOTO_MEDIA } from '@/lib/responsive-photo';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Aperture, ChevronLeft, ChevronRight, Instagram, Menu, Minus, Plus, RotateCcw, X } from 'lucide-react';

interface Photo {
  id: string; category: string; src: string; thumbnail: string; original: string;
  width: number; height: number; title: string; alt: string; featured: number; recent?: boolean;
}
const GALLERY_BATCH_SIZE = 9;

const chapterContent = [
  { label: 'LIVE & LOUD', category: 'Events', title: ['Feel', 'everything.'], heading: 'A moment. A thousand feelings.', description: 'The lights come on. The crowd comes alive. For a fraction of a second, everything falls into place.', note: 'The energy of being there', number: '01', caption: 'Live performances & events', featured: 0 },
  { label: 'FORM & FEELING', category: 'Fashion', title: ['Made', 'of light.'], heading: 'Personality, in the frame.', description: 'A quiet gesture. An unguarded expression. Portraits and fashion, seen in their own light.', note: 'A study in presence', number: '02', caption: 'Fashion & studio portraits', featured: 1 },
  { label: 'EVERYDAY POETRY', category: 'Street', title: ['Ordinary.', 'Extraordinary.'], heading: 'Stories hiding in plain sight.', description: 'Between the familiar streets and the everyday rush, there is always a story waiting to be noticed.', note: 'Life, as it happens', number: '03', caption: 'Street & documentary', featured: 2 },
  { label: 'IN FULL MOTION', category: 'Motorsport', title: ['Chase', 'the feeling.'], heading: 'Still frames. Moving stories.', description: 'Speed, colour and the split second that brings them together. A little of the rush, held in a photograph.', note: 'A fraction of a second', number: '04', caption: 'Motorsport & movement', featured: 3 },
];

function Scene({ photo, index, progress }: { photo: Photo; index: number; progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const start = index / CHAPTER_COUNT;
  const end = (index + 1) / CHAPTER_COUNT;
  const clipPath = useTransform(progress, [start - WIPE_HALF_SPAN, start + WIPE_HALF_SPAN], [HIDDEN_FRAME, FULL_FRAME]);
  const cutOpacity = useTransform(progress, value => index === 0 || value >= start ? 1 : 0);
  const scale = useTransform(progress, [start, end], [1.06, 1.16]);
  const y = useTransform(progress, [start,end], ['0%', '-2%']);
  return <motion.div className={`scene scene-${index}`} style={{ zIndex: index + 1, opacity: reduced ? cutOpacity : 1, clipPath: index === 0 || reduced ? 'none' : clipPath }} aria-hidden="true">
    <motion.div className="scene-image" style={{ scale: reduced ? 1 : scale, y: reduced ? 0 : y }}>
      <picture>
        <source media={MOBILE_PHOTO_MEDIA} srcSet={photo.thumbnail}/>
        <Image src={photo.src} alt="" fill unoptimized loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} sizes="100vw" className="scene-photo" />
      </picture>
    </motion.div>
  </motion.div>;
}

export default function PhotographyExperience({ photos }: { photos: Photo[] }) {
  const journeyRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(true);
  const finishIntro = useCallback(() => setShowIntro(false), []);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number; identifier: number } | null>(null);
  const { scrollYProgress } = useScroll({ target: journeyRef, offset: ['start start', 'end end'] });
  const progressScale = useTransform(scrollYProgress, [0,1], [0.025,1]);
  const [chapter, setChapter] = useState(0);
  const [filter, setFilter] = useState('All');
  const [visibleLimit, setVisibleLimit] = useState(GALLERY_BATCH_SIZE);
  const selectFilter = (category: string) => {
    setFilter(category);
    setVisibleLimit(category === 'New' ? photos.filter(photo => photo.recent).length : GALLERY_BATCH_SIZE);
    if (category === 'All') filtersRef.current?.scrollTo({ left: 0, behavior: 'instant' });
  };
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [photoDirection, setPhotoDirection] = useState(1);
  const photoIsOpen = activePhoto !== null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(true);
  const reducedMotion = useReducedMotion();
  useMotionValueEvent(scrollYProgress, 'change', value => setChapter(chapterAtProgress(value)));
  const selected = chapterContent[chapter];
  const featuredPhotos = chapterContent.map(item => photos.find(photo => photo.featured === item.featured)!).filter(Boolean);
  const categories = ['All', 'New', ...new Set(['Events', 'Fashion', 'Street', 'Motorsport', 'Personal', ...photos.map(photo => photo.category)].filter(category => photos.some(photo => photo.category === category)))];
  const selectedFilter = categories.includes(filter) ? filter : 'All';
  const filtered = selectedFilter === 'All' ? photos : photos.filter(photo => selectedFilter === 'New' ? photo.recent : photo.category === selectedFilter);
  const photoCount = filtered.length;
  const visiblePhotos = filtered.slice(0, visibleLimit);
  const remainingPhotos = photoCount - visiblePhotos.length;
  const photoBatches = Array.from({ length: Math.ceil(visiblePhotos.length / GALLERY_BATCH_SIZE) }, (_, index) => visiblePhotos.slice(index * GALLERY_BATCH_SIZE, (index + 1) * GALLERY_BATCH_SIZE));
  useEffect(() => {
    const scroller = filtersRef.current;
    const active = scroller?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (!scroller || !active || scroller.scrollWidth <= scroller.clientWidth) return;
    const left = active.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    const right = left + active.offsetWidth;
    if (left < scroller.scrollLeft || right > scroller.scrollLeft + scroller.clientWidth) {
      scroller.scrollTo({ left: Math.max(0, left - (scroller.clientWidth - active.offsetWidth) / 2), behavior: 'instant' });
    }
  }, [selectedFilter]);
  useScrollReveals(mainRef, `${selectedFilter}:${visiblePhotos.length}`);
  usePhotoChoreography(mainRef, `${selectedFilter}:${visiblePhotos.length}`, photoIsOpen || showIntro);
  const showMorePhotos = () => {
    const firstNewIndex = visiblePhotos.length;
    const scrollTop = window.scrollY;
    setVisibleLimit(current => Math.min(current + GALLERY_BATCH_SIZE, photoCount));
    requestAnimationFrame(() => {
      galleryRef.current?.querySelectorAll<HTMLButtonElement>('.photo-open')[firstNewIndex]?.focus({ preventScroll: true });
      window.scrollTo({ top: scrollTop, behavior: 'instant' });
    });
  };
  const recentStripPhotos = photos.filter(photo => photo.recent).slice(0, 8);
  const stripPhotos = [...recentStripPhotos, ...photos.filter(photo => !photo.recent)].slice(0, 8);
  const portrait = photos.find(photo => photo.original.includes('a00fc7ab')) || photos.find(photo => photo.category === 'Personal');

  const goToChapter = (index: number) => {
    if (!journeyRef.current) return;
    const top = journeyRef.current.getBoundingClientRect().top + window.scrollY;
    const stageHeight = journeyRef.current.querySelector<HTMLElement>('.journey-stage')?.offsetHeight ?? window.innerHeight;
    const scrollable = journeyRef.current.offsetHeight - stageHeight;
    window.scrollTo({ top: top + chapterLandingProgress(index) * scrollable, behavior: reducedMotion ? 'instant' : 'smooth' });
  };
  const changePhoto = useCallback((direction: number) => {
    setPhotoDirection(direction);
    setActivePhoto(current => current === null ? null : (current + direction + photoCount) % photoCount);
  }, [photoCount]);
  // Warm only the two neighbouring viewer images; full originals stay on demand.
  const previousPhotoSrc = activePhoto === null ? null : filtered[(activePhoto - 1 + photoCount) % photoCount]?.src;
  const nextPhotoSrc = activePhoto === null ? null : filtered[(activePhoto + 1) % photoCount]?.src;
  useEffect(() => {
    if (!photoIsOpen) return;
    [previousPhotoSrc, nextPhotoSrc].forEach(src => {
      if (!src) return;
      const image = new window.Image();
      image.decoding = 'async';
      image.src = src;
    });
  }, [photoIsOpen, previousPhotoSrc, nextPhotoSrc]);
  const openPhoto = (index: number) => {
    setPhotoDirection(1);
    setActivePhoto(index);
    dialogRef.current?.showModal();
  };
  const closePhoto = () => dialogRef.current?.close();

  useEffect(() => {
    if (!photoIsOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); changePhoto(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); changePhoto(-1); }
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previousOverflow; document.documentElement.style.overflow = previousRootOverflow; window.removeEventListener('keydown', onKey); };
  }, [photoIsOpen, changePhoto]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButtonRef.current?.focus({ preventScroll: true }); }
    };
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target) && !menuButtonRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 1025px)');
    const onResize = () => { if (desktop.matches) setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    desktop.addEventListener('change', onResize);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('pointerdown', onPointer); desktop.removeEventListener('change', onResize); };
  }, [menuOpen]);

  return <>
    {showIntro && <CinematicLoader photos={photos} onComplete={finishIntro}/>}
    <ScrollProgress/>
    <a href="#portfolio" className="skip-link" onClick={() => selectFilter('All')}>Skip to all photographs</a>
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Viku Singh — home"><Aperture size={25} strokeWidth={1.35} /><span>VIKU SINGH<span className="wordmark-sub">PHOTOGRAPHER & VISUAL STORYTELLER</span></span></a>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="#home">The experience</a><a href="#portfolio" onClick={() => selectFilter('All')}>All photographs <sup>{photos.length}</sup></a><a href="#about">Behind the lens</a></nav>
      <div className="header-actions"><a className="booking-button" href="#contact">Let’s create <ArrowUpRight size={15}/></a><button ref={menuButtonRef} className="menu-button icon-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></div>
      {menuOpen && <nav ref={menuRef} id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{[['#home','The experience'],['#portfolio',`All ${photos.length} photographs`],['#about','Behind the lens'],['#contact','Get in touch']].map(([href,label]) => <a key={href} href={href} onClick={() => { setMenuOpen(false); if (href === '#portfolio') selectFilter('All'); }}>{label}<ArrowUpRight size={18}/></a>)}</nav>}
    </header>

    <main ref={mainRef}>
      <section ref={journeyRef} className="journey" id="home" aria-label="A photographic journey through four collections">
        <div className="journey-stage">
          <div className="scenes">{featuredPhotos.map((photo,index) => <Scene key={photo.id} photo={photo} index={index} progress={scrollYProgress}/>)}</div>
          <div className="scene-shade"/>
          <FloatingGrain play={!showIntro}/>
          <div className="top-caption"><span>INDEPENDENT PHOTOGRAPHER</span><span>NEW DELHI, INDIA <span className="live-dot"/></span></div>
          <aside className={`story-panel ${infoOpen ? '' : 'is-collapsed'}`}>
            <div className="story-panel-top"><span className="eyebrow">THE FIELD NOTES / {selected.number}</span><button className="icon-button" onClick={() => setInfoOpen(!infoOpen)} aria-expanded={infoOpen} aria-controls="story-copy" aria-label={infoOpen ? 'Collapse field notes' : 'Expand field notes'}>{infoOpen ? <Minus size={15}/> : <Plus size={15}/>}</button></div>
            <div id="story-copy" hidden={!infoOpen}>
              <div key={chapter} className="story-copy"><h2>{selected.heading}</h2><p>{selected.description}</p><div className="story-rule"/><div className="story-facts"><span>COLLECTION<strong>{selected.category}</strong></span><span>PHOTOGRAPHS<strong>{String(photos.filter(photo => photo.category === selected.category).length).padStart(2,'0')}</strong></span></div><p className="story-note"><span className="live-dot"/>{selected.note}</p><a href="#portfolio" onClick={() => selectFilter(selected.category)} className="text-link">Explore collection <ArrowUpRight size={15}/></a></div>
            </div>
          </aside>
          <div className="hero-copy" aria-live="polite" aria-atomic="true"><div className="eyebrow hero-eyebrow"><span className="small-cross">+</span> {selected.label}</div><h1 className={`motion-heading${chapter === 2 ? ' long-headline' : ''}`}><RevealType key={chapter} lines={selected.title} play={!showIntro} accentLine={1}/></h1><p><span>{selected.caption}</span><span className="caption-line" aria-hidden="true"/><span className="hero-byline">Viku Singh</span></p></div>
          <div className="scene-marker" aria-hidden="true"><span className="marker-cross"/><span>FRAME {selected.number}<br/>A DIFFERENT WAY OF SEEING</span></div>
          <a href="#portfolio" className="archive-rail" onClick={() => selectFilter('All')}>ALL PHOTOGRAPHS <span>{photos.length}</span><ArrowDown size={14}/></a>
          <div className="journey-bottom"><a href="#portfolio" className="scroll-cue" onClick={() => selectFilter('All')}><span className="scroll-circle"><ArrowDown size={17}/></span><span>SCROLL TO EXPLORE<br/><span className="muted">Or jump to the full archive</span></span></a><div className="chapter-timeline" aria-label="Photography chapters"><div className="timeline-track"><motion.div style={{scaleX:progressScale}}/></div><div className="chapter-buttons">{chapterContent.map((item,index) => <button key={item.number} className={`chapter-button ${chapter === index ? 'active' : ''}`} onClick={() => goToChapter(index)} aria-label={`View chapter ${item.number}: ${item.caption}`} aria-current={chapter === index ? 'step' : undefined}><span>{item.number}</span><span>{['LIVE & LOUD','FASHION','STREET LIFE','IN MOTION'][index]}</span><i/></button>)}</div></div><span className="journey-count">{selected.number}<span> / 04</span></span></div>
        </div>
      </section>

      <LatestCollections photos={photos} onExplore={selectFilter} onOpen={photo => { selectFilter(photo.category); setPhotoDirection(1); setActivePhoto(photos.filter(item => item.category === photo.category).findIndex(item => item.id === photo.id)); dialogRef.current?.showModal(); }}/>

      <FilmstripTransition photos={stripPhotos} onExplore={() => selectFilter('All')}/>

      <section id="portfolio" className="portfolio-section">
        <div className="section-kicker" data-reveal="text"><span><span className="live-dot"/> THE PHOTOGRAPHIC ARCHIVE</span><span>{photos.length} FRAMES · ONE PERSPECTIVE</span></div>
        <div className="archive-heading"><h2 className="motion-heading"><RevealType lines={['A closer look.']}/></h2><p data-reveal="text" data-reveal-delay="140">From the front row to the everyday.<br/>A collection of the way I see the world.</p></div>
        <div className="gallery-toolbar" data-reveal="text"><div ref={filtersRef} className="filters" aria-label="Filter photographs">{categories.map(category => <button key={category} onClick={() => { selectFilter(category); requestAnimationFrame(() => galleryRef.current?.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'instant' : 'smooth' })); }} aria-pressed={selectedFilter === category} className={selectedFilter === category ? 'active' : ''}>{category === 'All' ? 'All photographs' : category}<sup>{category === 'All' ? photos.length : photos.filter(photo => category === 'New' ? photo.recent : photo.category === category).length}</sup></button>)}</div><span className="gallery-count">{visiblePhotos.length} of {photoCount} photographs</span></div>
        <div id="photo-gallery" className="gallery-batches" ref={galleryRef} key={selectedFilter}>
          {photoBatches.map((batch, batchIndex) => <div className="photo-grid" key={batchIndex}>
            {batch.map((photo, localIndex) => {
              const index = batchIndex * GALLERY_BATCH_SIZE + localIndex;
              return <AnimatedPhotoCard key={photo.id} photo={photo} index={index} onOpen={() => openPhoto(index)}/>;
            })}
          </div>)}
        </div>
        <div className="gallery-pagination">
          <p role="status" aria-live="polite" aria-atomic="true">Showing {visiblePhotos.length} of {photoCount} photographs</p>
          {remainingPhotos > 0 && <button className="view-more-button" onClick={showMorePhotos} aria-controls="photo-gallery">View more <span>+{Math.min(GALLERY_BATCH_SIZE, remainingPhotos)}</span><ArrowDown size={17}/></button>}
        </div>
        <div className="archive-end" data-reveal="text"><Aperture size={22} strokeWidth={1}/><span>{photoCount} moments. Each one worth a second look.</span><a href="#portfolio">Back to collection <ArrowUpRight size={14}/></a></div>
      </section>

      <section className="about-section" id="about"><SectionLens/><div className="about-image" data-photo-id={portrait?.id}>{portrait && <div className="photo-entry"><div className="photo-depth-layer"><picture><source media={MOBILE_PHOTO_MEDIA} srcSet={portrait.thumbnail}/><Image src={portrait.src} alt="Viku Singh, photographer" width={portrait.width} height={portrait.height} unoptimized loading="lazy"/></picture></div></div>}<span className="portrait-focus-outline" aria-hidden="true"/><div className="portrait-label"><span>ON THE OTHER SIDE<br/>OF THE CAMERA</span><Aperture size={28} strokeWidth={1}/></div></div><div className="about-copy"><span className="eyebrow" data-reveal="text">BEHIND THE LENS / NEW DELHI</span><h2 className="motion-heading"><RevealType lines={["Hi, I’m Viku.", "I notice things."]} accentLine={1}/></h2><p data-reveal="text">The energy of a crowd. The character of a face. The small stories that make a street feel alive.</p><p data-reveal="text" data-reveal-delay="90">I’m a photographer based in New Delhi, working across live events, fashion and street photography. My work follows the light, the movement, and the people in between.</p><a className="text-link" href="https://www.instagram.com/ind_god_vkt" target="_blank" rel="noreferrer"><Instagram size={16}/> Follow the everyday <ArrowUpRight size={16}/></a><span className="signature" data-reveal="text">Viku Singh</span></div></section>

      <section className="contact-section" id="contact"><SectionLens/><div className="section-kicker" data-reveal="text"><span><span className="live-dot"/> LET’S MAKE SOMETHING</span><span>EVENTS / FASHION / PORTRAITS</span></div><div className="contact-heading"><h2 className="motion-heading"><RevealType lines={["Your story.", "My perspective."]} accentLine={1}/></h2><a data-reveal="photo" className="contact-arrow" href="mailto:vikashtkd19@gmail.com" aria-label="Email Viku Singh about a shoot"><ArrowUpRight strokeWidth={1} size={68}/></a></div><div className="contact-details" data-reveal="text"><p>Have a shoot in mind?<br/>I’d love to hear about it.</p><a href="mailto:vikashtkd19@gmail.com">vikashtkd19@gmail.com <ArrowUpRight size={16}/></a><a href="https://wa.me/917428441649" target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={16}/></a><a href="tel:+917428441649">+91 74284 41649</a></div></section>
    </main>
    <footer className="site-footer"><a className="footer-brand" href="#home"><Aperture size={18}/> VIKU SINGH</a><span>© {new Date().getFullYear()} Viku Singh. All photographs reserved.</span><a href="https://www.instagram.com/ind_god_vkt" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={13}/></a><button className="replay-intro" onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); setShowIntro(true); }}><RotateCcw size={14}/> Replay intro</button><a href="#home">Back to top ↑</a></footer>

    <dialog className="lightbox" ref={dialogRef} onClose={() => setActivePhoto(null)} aria-label="Photograph viewer" onClick={event => { if (event.target === event.currentTarget) closePhoto(); }} onTouchStart={event => { touchStart.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY, identifier: event.touches[0].identifier } : null; }} onTouchMove={event => { if (event.touches.length !== 1) touchStart.current = null; }} onTouchCancel={() => { touchStart.current = null; }} onTouchEnd={event => { const start = touchStart.current; touchStart.current = null; if (!start || event.touches.length || event.changedTouches.length !== 1 || event.changedTouches[0].identifier !== start.identifier) return; const dx = event.changedTouches[0].clientX - start.x; const dy = event.changedTouches[0].clientY - start.y; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) changePhoto(dx < 0 ? 1 : -1); }}>
      <div className="lightbox-top"><span>VIKU SINGH / {filtered[activePhoto ?? 0]?.category.toUpperCase()}</span><button className="icon-button" autoFocus onClick={closePhoto} aria-label="Close photograph"><X size={25}/></button></div>
      {activePhoto !== null && filtered[activePhoto] && <><div className="lightbox-main"><button className="lightbox-nav previous" aria-label="Previous photograph" onClick={() => changePhoto(-1)}><ChevronLeft/></button><motion.div key={filtered[activePhoto].id} className="lightbox-frame" initial={reducedMotion ? false : { opacity: 0, scale: .975, x: photoDirection * 24 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: reducedMotion ? 0 : .45, ease: [.2,.75,.2,1] }}><ZoomablePhoto photo={filtered[activePhoto]}/></motion.div><button className="lightbox-nav next" aria-label="Next photograph" onClick={() => changePhoto(1)}><ChevronRight/></button></div><div className="lightbox-caption"><span>{filtered[activePhoto].recent && <span className="new-photo-label">NEW</span>}{filtered[activePhoto].title}</span><span>{activePhoto+1} / {photoCount}</span><a href={filtered[activePhoto].original} target="_blank" rel="noreferrer">View full photo <ArrowUpRight size={15}/></a></div></>}
      <p className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{activePhoto !== null && filtered[activePhoto] ? `Photograph ${activePhoto + 1} of ${photoCount}. ${filtered[activePhoto].alt}.` : ''}</p>
      <p className="lightbox-hint"><span className="lightbox-keyboard-hint"><ArrowLeft size={12}/> <ArrowRight size={12}/> to browse · + / − to zoom · 0 to fit · Esc to close</span><span className="lightbox-touch-hint">Swipe to browse · Zoom, then drag to explore</span></p>
    </dialog>
  </>;
}
