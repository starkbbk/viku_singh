"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Camera,
  X,
  Maximize2,
  Sliders,
  Disc,
} from "lucide-react";

interface Album {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  count: number;
  badge: string;
  gear: string;
  accent: string;
  cover: string;
  photos: { id: number; title: string; src: string; exif?: string }[];
}

const albumsData: Album[] = [
  {
    id: "events",
    title: "EVENT CHRONICLES",
    category: "Events & Celebrations",
    subtitle:
      "Electric energy, monumental nights, emotional weddings and unfiltered celebration euphoria.",
    count: 51,
    badge: "51 FRAMES",
    gear: "Sony A7 IV · 35mm f/1.4 GM · 85mm f/1.4",
    accent: "#f59e0b",
    cover: "/portfolio/Event/026a01b4-7c2d-4117-a19a-7b9fa9a5c02d.JPG",
    photos: [
      { id: 1, title: "Grand Celebration Entrance", src: "/portfolio/Event/026a01b4-7c2d-4117-a19a-7b9fa9a5c02d.JPG", exif: "35mm · f/1.8 · 1/500s · ISO 800" },
      { id: 2, title: "Ecstatic Stage Lights", src: "/portfolio/Event/03124d5c-609f-44ca-ab19-cef83cdc2a2a.JPG", exif: "85mm · f/1.4 · 1/800s · ISO 1200" },
      { id: 3, title: "Candid Laughter in the Crowd", src: "/portfolio/Event/06dad40b-757a-4a53-8d2c-7d0ed7c80844.JPG", exif: "50mm · f/1.4 · 1/400s · ISO 640" },
      { id: 4, title: "Nocturnal Sparks", src: "/portfolio/Event/1f34c60f-c24a-49b5-92ce-77b57ee3e46b.JPG", exif: "35mm · f/2.0 · 1/250s · ISO 1600" },
      { id: 5, title: "Champagne Toast Moments", src: "/portfolio/Event/227b6d87-68ed-4891-b238-b74993aff70c.JPG", exif: "85mm · f/1.4 · 1/640s · ISO 800" },
      { id: 6, title: "Dancefloor Rhythm", src: "/portfolio/Event/2965e099-b8f8-4a2a-a4a2-4111a9d78cf8.JPG", exif: "24mm · f/2.8 · 1/200s · ISO 2000" },
      { id: 7, title: "Royal Amber Glow", src: "/portfolio/Event/2de7bd2c-146f-4771-be6e-ea590c84a47c.JPG", exif: "50mm · f/1.2 · 1/1000s · ISO 400" },
      { id: 8, title: "Celebration Fireworks", src: "/portfolio/Event/2f4a6773-39fc-49a2-aa82-76664b0b5bb8.JPG", exif: "35mm · f/1.4 · 1/800s · ISO 500" },
      { id: 9, title: "Midnight Revelry", src: "/portfolio/Event/35455759-90f9-47e3-a4d3-3f2f2dfc2136.JPG", exif: "85mm · f/1.8 · 1/320s · ISO 1000" },
      { id: 10, title: "Neon Horizon Party", src: "/portfolio/Event/38d8c8f1-d0be-48c0-aa1d-665a11551375.JPG", exif: "35mm · f/1.4 · 1/500s · ISO 800" },
      { id: 11, title: "Ceremonial Harmony", src: "/portfolio/Event/3ac5e3d0-938e-4c3c-ab84-250b37e48271.JPG", exif: "50mm · f/1.4 · 1/400s · ISO 640" },
      { id: 12, title: "Golden Lantern Hour", src: "/portfolio/Event/3bdbcce7-a792-4393-b28d-2760c9523d62.JPG", exif: "85mm · f/1.4 · 1/800s · ISO 400" },
    ],
  },
  {
    id: "fashion",
    title: "HAUTE & EDITORIAL",
    category: "Fashion Editorial",
    subtitle:
      "Sculpted chiaroscuro lighting, textured garments, avant-garde framing and haute couture styling.",
    count: 9,
    badge: "9 MASTERPIECES",
    gear: "Canon R5 · 85mm f/1.2 L USM · Profoto B10X",
    accent: "#fbbf24",
    cover: "/portfolio/Fashion/04bf13aa-b728-45f2-80e2-35e384a6366c.JPG",
    photos: [
      { id: 57, title: "Haute Contour I", src: "/portfolio/Fashion/04bf13aa-b728-45f2-80e2-35e384a6366c.JPG", exif: "85mm · f/1.2 · 1/2000s · ISO 100" },
      { id: 58, title: "Velvet Silhouette", src: "/portfolio/Fashion/42a34cc4-99db-4bec-89c3-5bd56c0c29cb.JPG", exif: "85mm · f/1.4 · 1/1600s · ISO 100" },
      { id: 59, title: "Avant-Garde Drape", src: "/portfolio/Fashion/7c224c2a-3214-4990-885b-150a52cb6761.JPG", exif: "50mm · f/1.2 · 1/2500s · ISO 100" },
      { id: 60, title: "Chiaroscuro Form", src: "/portfolio/Fashion/8feaebae-e9f3-4952-80d0-a431bd69d6ba.JPG", exif: "85mm · f/1.2 · 1/1250s · ISO 100" },
      { id: 61, title: "Noir Lookbook Vogue", src: "/portfolio/Fashion/dd276f26-cc2d-4035-8ca1-29d9c1db4bc1.JPG", exif: "85mm · f/1.8 · 1/800s · ISO 200" },
      { id: 62, title: "Modernist Minimalist", src: "/portfolio/Fashion/f588fead-4785-467d-b020-adff03cfab75.JPG", exif: "50mm · f/1.4 · 1/1600s · ISO 100" },
      { id: 63, title: "Monochrome Majesty", src: "/portfolio/Fashion/IMG_1596.JPG", exif: "85mm · f/1.2 · 1/3200s · ISO 64" },
      { id: 64, title: "Urban Haute", src: "/portfolio/Fashion/IMG_1597.JPG", exif: "85mm · f/1.4 · 1/2000s · ISO 100" },
      { id: 65, title: "Futurism Lookbook", src: "/portfolio/Fashion/IMG_1598.JPG", exif: "35mm · f/1.4 · 1/1600s · ISO 100" },
    ],
  },
  {
    id: "street",
    title: "STREET & RAW SOULS",
    category: "Street Documentary",
    subtitle:
      "Unscripted human poetry, monsoon reflections, old alley shadows and fleeting Delhi moments.",
    count: 9,
    badge: "9 CANDIDS",
    gear: "Leica Q2 · 28mm f/1.7 Summilux",
    accent: "#d97706",
    cover: "/portfolio/Street/026c30df-6c91-4920-b34f-5ebf47e39607.JPG",
    photos: [
      { id: 66, title: "Monsoon Reflections", src: "/portfolio/Street/026c30df-6c91-4920-b34f-5ebf47e39607.JPG", exif: "28mm · f/1.7 · 1/1000s · ISO 400" },
      { id: 67, title: "Old Delhi Alleys", src: "/portfolio/Street/39ca6b35-d263-4291-a05a-b8a4f6cccc27.JPG", exif: "28mm · f/2.0 · 1/500s · ISO 800" },
      { id: 68, title: "Chai Vendor Solitude", src: "/portfolio/Street/7a034456-8798-446b-828d-a50fa626e893.JPG", exif: "28mm · f/1.7 · 1/400s · ISO 1200" },
      { id: 69, title: "Dusk Rickshaw Glow", src: "/portfolio/Street/80de770d-2e5c-4d0a-90c5-5b3c34a4be31.JPG", exif: "28mm · f/2.2 · 1/250s · ISO 1600" },
      { id: 70, title: "Metro Pulse Shadows", src: "/portfolio/Street/89bbbd20-b13c-4370-a9c9-3dcb63d10a51.JPG", exif: "28mm · f/1.7 · 1/800s · ISO 640" },
      { id: 71, title: "Passing Gaze", src: "/portfolio/Street/9496e548-972f-42d9-92f1-34519ff23b7c.JPG", exif: "28mm · f/2.0 · 1/1200s · ISO 200" },
      { id: 72, title: "Sunlit Street Smokes", src: "/portfolio/Street/95d624e6-d3bd-4655-a975-052d215c5856.JPG", exif: "28mm · f/2.8 · 1/2000s · ISO 100" },
      { id: 73, title: "City Crossroads", src: "/portfolio/Street/a6d35c02-a9af-4001-b233-2fcbfcc4405a.JPG", exif: "28mm · f/2.0 · 1/640s · ISO 500" },
      { id: 74, title: "Nocturnal Transit", src: "/portfolio/Street/deda56da-e267-4ce6-a046-e81066aff158.JPG", exif: "28mm · f/1.7 · 1/160s · ISO 3200" },
    ],
  },
  {
    id: "cinematic",
    title: "CINEMATIC VISIONS",
    category: "Atmospheric & Landscapes",
    subtitle:
      "Moody ambient hues, ethereal backlight flares, grand compositions and cinematic storytelling.",
    count: 9,
    badge: "9 VISIONS",
    gear: "Sony A7S III · 50mm f/1.2 GM · Cine ND Filters",
    accent: "#f59e0b",
    cover: "/portfolio/Background/d7b393da-2533-4024-9d80-f1aad6966bcf.JPG",
    photos: [
      { id: 81, title: "Golden Haze Mirage", src: "/portfolio/Background/d7b393da-2533-4024-9d80-f1aad6966bcf.JPG", exif: "50mm · f/1.2 · 1/4000s · ISO 100" },
      { id: 82, title: "Midnight Fog Study", src: "/portfolio/Background/026a01b4-7c2d-4117-a19a-7b9fa9a5c02d.JPG", exif: "35mm · f/1.4 · 1/2000s · ISO 200" },
      { id: 83, title: "Amber Twilight", src: "/portfolio/Background/2de7bd2c-146f-4771-be6e-ea590c84a47c.JPG", exif: "85mm · f/1.4 · 1/1600s · ISO 100" },
      { id: 84, title: "Electric Horizon", src: "/portfolio/Background/2f4a6773-39fc-49a2-aa82-76664b0b5bb8.JPG", exif: "50mm · f/1.2 · 1/3200s · ISO 100" },
      { id: 85, title: "Prismatic Reflections", src: "/portfolio/Background/4aac5cd8-ecf6-40b5-a98d-db50214c9611.JPG", exif: "35mm · f/1.4 · 1/800s · ISO 400" },
      { id: 86, title: "Atmospheric Noir", src: "/portfolio/Background/6263c93c-afba-4572-a460-24a48ddd6eb2.JPG", exif: "85mm · f/1.2 · 1/1000s · ISO 200" },
      { id: 87, title: "Sublime Radiance", src: "/portfolio/Background/c37b6374-dee4-4f6f-b204-a1b39cb9d138.JPG", exif: "50mm · f/1.4 · 1/2500s · ISO 100" },
      { id: 88, title: "Silvery Dusk", src: "/portfolio/Background/e9154f79-6eb2-4594-944f-82fb4e74e645.JPG", exif: "85mm · f/1.4 · 1/1600s · ISO 100" },
      { id: 89, title: "Celestial Calm", src: "/portfolio/Background/e9e3e961-a0b5-46f4-9773-f0923a09a0d5.JPG", exif: "35mm · f/1.2 · 1/4000s · ISO 64" },
    ],
  },
];

function AlbumCard3D({
  album,
  index,
  activeIndex,
  isMobile,
  onSelect,
  onOpen,
}: {
  album: Album;
  index: number;
  activeIndex: number;
  isMobile: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const offset = (index - activeIndex + albumsData.length) % albumsData.length;
  let distance = offset;
  if (distance > albumsData.length / 2) {
    distance -= albumsData.length;
  }

  const isActive = distance === 0;
  const isHidden = Math.abs(distance) > 1;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 12}deg)`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    }
  };

  if (isHidden) return null;

  // Responsive horizontal displacement and 3D rotation
  const translateX = isMobile ? distance * 240 : distance * 380;
  const baseRotateY = distance * (isMobile ? -18 : -22);
  // Prominent scale zoom on hover
  const targetScale = isHovered ? (isActive ? 1.05 : 0.98) : isActive ? 1 : 0.88;
  const targetOpacity = isActive ? 1 : isHovered ? 1 : 0.82;
  const zIndex = isHovered ? 60 : isActive ? 30 : 20;

  return (
    <motion.div
      animate={{
        x: translateX,
        y: isHovered ? -12 : 0,
        rotateY: baseRotateY,
        scale: targetScale,
        opacity: targetOpacity,
      }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 24,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        e.stopPropagation();
        if (isActive) {
          onOpen();
        } else {
          onSelect();
        }
      }}
      data-cursor={isActive ? "OPEN" : "SELECT"}
      className={`absolute w-[270px] sm:w-[350px] md:w-[380px] aspect-[4/5] rounded-3xl cursor-pointer select-none transition-shadow duration-300 ${
        isActive
          ? "shadow-[0_25px_60px_-15px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/50"
          : isHovered
          ? "shadow-[0_30px_70px_rgba(245,158,11,0.5)] ring-2 ring-amber-400"
          : "shadow-2xl hover:opacity-100"
      }`}
      style={{
        zIndex,
      }}
    >
      {/* 3D Vinyl Sleeve Photography Card (Smooth mouse tilt applied here) */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className={`relative w-full h-full rounded-3xl overflow-hidden border p-4 flex flex-col justify-between transition-all duration-300 ${
          isActive
            ? "bg-[#131118] border-amber-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            : isHovered
            ? "bg-[#1c1922] border-amber-400/80 shadow-[0_25px_60px_rgba(245,158,11,0.3)]"
            : "bg-[#0f0e14] border-white/10 shadow-2xl"
        }`}
        style={{
          transition: "transform 0.15s ease-out, border-color 0.3s, background-color 0.3s",
        }}
      >
        {/* Album Cover Photograph with internal zoom on hover */}
        <div className="relative w-full h-[72%] rounded-2xl overflow-hidden bg-black">
          <motion.div
            className="relative w-full h-full"
            animate={{ scale: isHovered ? 1.12 : 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Image
              src={album.cover}
              alt={album.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 320px, 400px"
              priority={isActive}
            />
          </motion.div>

          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/85 to-transparent pointer-events-none" />

          {/* Badge on Cover */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-mono font-semibold text-amber-300 shadow-md pointer-events-none">
            <Disc size={12} className="text-amber-400 animate-spin" style={{ animationDuration: "8s" }} />
            <span>{album.badge}</span>
          </div>

          <div className="absolute top-3 right-3 p-2 bg-black/80 rounded-full border border-white/20 backdrop-blur-md text-white/90 group-hover:text-amber-400 transition-colors shadow-md pointer-events-none">
            <Maximize2 size={14} className={isHovered ? "text-amber-400" : "text-white/80"} />
          </div>

          {/* Category Stamp & Switch Tooltip */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 font-bold px-2.5 py-1 rounded bg-black/80 border border-amber-500/40 shadow">
              {album.category}
            </span>

            {!isActive && (
              <span
                className={`text-[10px] font-mono font-bold transition-all px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400/40 ${
                  isHovered ? "text-amber-300 scale-105 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "text-stone-400"
                }`}
              >
                {isHovered ? "CLICK TO ROTATE ➔" : "CLICK TO ROTATE"}
              </span>
            )}
          </div>
        </div>

        {/* Album Info / Bottom Sleeve */}
        <div className="relative z-10 pt-3 flex flex-col justify-between pointer-events-none">
          <div>
            <h3 className="text-xl sm:text-2xl font-serif tracking-tight text-white mb-1">
              {album.title}
            </h3>
            <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed font-light">
              {album.subtitle}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-stone-400">
            <div className="flex items-center gap-1.5 truncate max-w-[200px]">
              <Camera size={12} className="text-amber-400 shrink-0" />
              <span className="truncate text-stone-300">{album.gear}</span>
            </div>
            <span
              className={`font-semibold shrink-0 transition-colors ${
                isActive
                  ? "text-amber-400"
                  : isHovered
                  ? "text-amber-300 font-bold underline"
                  : "text-stone-400"
              }`}
            >
              {isActive ? "[ CLICK TO OPEN ]" : "[ CLICK TO ROTATE ]"}
            </span>
          </div>
        </div>
      </div>

      {/* 3D Under-Shadow Glow */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-black/60 blur-xl rounded-full pointer-events-none -z-10"
        style={{
          backgroundColor: isActive || isHovered ? "rgba(245,158,11,0.25)" : "transparent",
        }}
      />
    </motion.div>
  );
}

export default function Albums3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<{ src: string; title: string; exif?: string } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const activeAlbum = albumsData[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % albumsData.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + albumsData.length) % albumsData.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    setTouchStart(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedAlbum) {
        if (e.key === "Escape") {
          setSelectedAlbum(null);
          setPreviewPhoto(null);
        }
        return;
      }
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedAlbum]);

  // Scroll-linked opacity for middle-of-screen focus
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.4, 1, 1, 0.4]);

  return (
    <section
      id="albums"
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center items-center py-12 sm:py-16 relative overflow-hidden bg-[#08070b]"
    >
      {/* Subtle Darkroom Ambient Background */}
      <div className="absolute inset-0 darkroom-grid opacity-25 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-40 right-1/4 w-[600px] h-[500px] bg-orange-600/10 blur-[160px] pointer-events-none rounded-full" />

      <motion.div
        style={{ opacity: sectionOpacity }}
        className="container mx-auto px-4 sm:px-6 relative z-10 w-full flex flex-col justify-center my-auto"
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-amber-950/40 text-amber-300 text-[11px] sm:text-xs tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Sparkles size={13} className="animate-spin" style={{ animationDuration: "8s" }} />
            <span>EXHIBITION · SPATIAL VAULT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight mb-2 sm:mb-3 uppercase">
            CURATED <span className="text-amber-400">SPATIAL VAULT</span>
          </h2>
          <p className="text-stone-300 text-sm sm:text-base md:text-lg leading-relaxed font-light px-2">
            Swipe or click any album to navigate in 3D. Tap to bring forward or expand.
          </p>
        </div>

        {/* 3D Stage / Coverflow Viewport with touch-swipe support */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative h-[430px] sm:h-[540px] md:h-[580px] flex items-center justify-center perspective-1200 preserve-3d select-none touch-pan-y"
        >
          {albumsData.map((album, index) => (
            <AlbumCard3D
              key={album.id}
              album={album}
              index={index}
              activeIndex={activeIndex}
              isMobile={isMobile}
              onSelect={() => setActiveIndex(index)}
              onOpen={() => setSelectedAlbum(album)}
            />
          ))}
        </div>

        {/* Carousel Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 max-w-3xl mx-auto mt-6 px-4 w-full">
          {/* Active Album Specs Bar */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs font-mono text-stone-400">
            <span className="text-amber-400 font-bold">ALBUM_0{activeIndex + 1}</span>
            <span className="text-white/20">/</span>
            <span>0{albumsData.length}</span>
            <span className="text-white/20">|</span>
            <span className="text-white/90 truncate max-w-[150px] sm:max-w-none">{activeAlbum.title}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              data-cursor="PREV"
              className="p-3 rounded-full glass hover:bg-amber-500/20 text-white hover:text-amber-300 transition-all border border-white/10 active:scale-95 cursor-pointer touch-manipulation"
              aria-label="Previous Album"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-2 px-2 sm:px-3">
              {albumsData.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === activeIndex
                      ? "w-8 bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to album ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              data-cursor="NEXT"
              className="p-3 rounded-full glass hover:bg-amber-500/20 text-white hover:text-amber-300 transition-all border border-white/10 active:scale-95 cursor-pointer touch-manipulation"
              aria-label="Next Album"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Quick Open Button */}
          <button
            type="button"
            onClick={() => setSelectedAlbum(activeAlbum)}
            data-cursor="OPEN"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-amber-400 text-black font-semibold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-amber-300 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 cursor-pointer touch-manipulation"
          >
            <Layers size={14} />
            EXPLORE ARCHIVE [ 3D ]
          </button>
        </div>
      </motion.div>

      {/* 3D Album Fan-Out & Explorer Modal */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/92 backdrop-blur-2xl flex flex-col p-4 md:p-8 overflow-y-auto"
            onClick={() => setSelectedAlbum(null)}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between border-b border-white/10 pb-4 mb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-white tracking-tight uppercase">
                    {selectedAlbum.title}
                  </h3>
                  <p className="text-xs font-mono text-amber-300">
                    {selectedAlbum.category} · {selectedAlbum.count} CAPTURES ARCHIVE
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAlbum(null)}
                className="p-2.5 rounded-full glass hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Album Summary Card & EXIF Strip */}
            <div
              className="glass-panel rounded-2xl p-4 md:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-amber-400/40">
                  <Image
                    src={selectedAlbum.cover}
                    alt={selectedAlbum.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-stone-200">{selectedAlbum.subtitle}</p>
                  <p className="text-xs font-mono text-amber-300/80 mt-1">
                    PRIMARY OPTICS: {selectedAlbum.gear}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-stone-300 bg-black/40 px-4 py-2 rounded-xl border border-white/10">
                <Sliders size={14} className="text-amber-400" />
                <span>CLICK PHOTO FOR HI-RES LIGHTBOX & EXIF</span>
              </div>
            </div>

            {/* 3D Photo Grid / Fan-Out Cards */}
            <div
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 container mx-auto pb-12"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedAlbum.photos.map((photo, pIdx) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: pIdx * 0.04, duration: 0.3 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  onClick={() => setPreviewPhoto(photo)}
                  data-cursor="VIEW"
                  className="relative group rounded-2xl overflow-hidden glass-panel border border-white/10 cursor-pointer aspect-[3/4] shadow-lg"
                >
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h4 className="text-white font-serif font-bold text-sm tracking-wide">
                      {photo.title}
                    </h4>
                    {photo.exif && (
                      <p className="text-[11px] font-mono text-amber-300 mt-1">
                        {photo.exif}
                      </p>
                    )}
                    <div className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white backdrop-blur-sm border border-white/20">
                      <Maximize2 size={14} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hi-Res Lightbox Modal */}
      <AnimatePresence>
        {previewPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setPreviewPhoto(null)}
          >
            <button
              type="button"
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors cursor-pointer"
              onClick={() => setPreviewPhoto(null)}
            >
              <X size={36} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[75vh]">
                <Image
                  src={previewPhoto.src}
                  alt={previewPhoto.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-xl font-serif font-bold text-white">{previewPhoto.title}</h3>
                {previewPhoto.exif && (
                  <p className="text-xs font-mono text-amber-400 mt-1">
                    EXIF: {previewPhoto.exif}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
