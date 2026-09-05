"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Camera, Aperture, Eye, Disc, Sparkles } from "lucide-react";
import Link from "next/link";

interface Chapter {
  id: string;
  num: string;
  title: string;
  category: string;
  subtitle: string;
  image: string;
  lens: string;
  fstop: string;
  shutter: string;
  iso: string;
  notes: string;
  location: string;
}

const chapters: Chapter[] = [
  {
    id: "chapter-01",
    num: "01",
    title: "Sandstone & Sunset",
    category: "Atmospheric Light",
    subtitle: "The fragile 90 seconds when the sun strikes Old Delhi at 14 degrees.",
    image: "/portfolio/Background/d7b393da-2533-4024-9d80-f1aad6966bcf.JPG",
    lens: "Sony FE 50mm f/1.2 GM",
    fstop: "f/1.2",
    shutter: "1/4000s",
    iso: "ISO 100",
    notes: "Chasing ambient dust and low-angle golden haze. No artificial fill—pure natural exposure.",
    location: "Old Delhi · Dusk",
  },
  {
    id: "chapter-02",
    num: "02",
    title: "Midnight Euphoria",
    category: "Live Energy & Sparks",
    subtitle: "Unscripted adrenaline, heavy bass vibrations, and incandescent celebration.",
    image: "/portfolio/Event/026a01b4-7c2d-4117-a19a-7b9fa9a5c02d.JPG",
    lens: "Sony FE 35mm f/1.4 GM",
    fstop: "f/1.4",
    shutter: "1/640s",
    iso: "ISO 1600",
    notes: "Freezing motion in near pitch black with stage pyro bursts. Capturing raw euphoria.",
    location: "Main Stage · 01:42 AM",
  },
  {
    id: "chapter-03",
    num: "03",
    title: "Haute Form & Shadow",
    category: "Editorial Chiaroscuro",
    subtitle: "Shadow is not the absence of illumination, but its most sculpted companion.",
    image: "/portfolio/Fashion/04bf13aa-b728-45f2-80e2-35e384a6366c.JPG",
    lens: "Canon RF 85mm f/1.2 L USM",
    fstop: "f/1.2",
    shutter: "1/2000s",
    iso: "ISO 100",
    notes: "Carving silhouette with a single key-light grid. Every fold tells an architectural story.",
    location: "Darkroom Studio · Editorial",
  },
];

export default function VisualStoryChapters() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth opacity transforms for the 3 chapters
  // Chapter 1: [0, 0.28, 0.36]
  const op1 = useTransform(scrollYProgress, [0, 0.24, 0.33], [1, 1, 0]);
  const scale1 = useTransform(scrollYProgress, [0, 0.33], [1, 1.08]);

  // Chapter 2: [0.28, 0.35, 0.60, 0.68]
  const op2 = useTransform(scrollYProgress, [0.28, 0.36, 0.60, 0.68], [0, 1, 1, 0]);
  const scale2 = useTransform(scrollYProgress, [0.3, 0.68], [1.08, 1]);

  // Chapter 3: [0.62, 0.70, 1]
  const op3 = useTransform(scrollYProgress, [0.63, 0.72, 1], [0, 1, 1]);
  const scale3 = useTransform(scrollYProgress, [0.65, 1], [1.08, 1]);

  // Progress scrub bar height
  const scrubHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className="relative h-[320vh] w-full bg-[#08070b] select-none snap-section"
      id="visual-stories"
    >
      {/* Sticky Fixed Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Film Chapters */}
        <div className="absolute inset-0 z-0">
          {/* Chapter 1 Background */}
          <motion.div
            style={{ opacity: op1, scale: scale1 }}
            className="absolute inset-0 transform-gpu"
          >
            <Image
              src={chapters[0].image}
              alt={chapters[0].title}
              fill
              priority
              className="object-cover brightness-75 contrast-110 filter"
              sizes="100vw"
            />
          </motion.div>

          {/* Chapter 2 Background */}
          <motion.div
            style={{ opacity: op2, scale: scale2 }}
            className="absolute inset-0 transform-gpu"
          >
            <Image
              src={chapters[1].image}
              alt={chapters[1].title}
              fill
              className="object-cover brightness-75 contrast-110 filter"
              sizes="100vw"
            />
          </motion.div>

          {/* Chapter 3 Background */}
          <motion.div
            style={{ opacity: op3, scale: scale3 }}
            className="absolute inset-0 transform-gpu"
          >
            <Image
              src={chapters[2].image}
              alt={chapters[2].title}
              fill
              className="object-cover brightness-75 contrast-110 filter"
              sizes="100vw"
            />
          </motion.div>

          {/* Darkroom Vignette & Amber Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08070b] via-transparent to-[#08070b]/80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08070b]/90 via-transparent to-[#08070b]/70 pointer-events-none" />
          <div className="absolute inset-0 darkroom-grid opacity-30 pointer-events-none" />
        </div>

        {/* Viewfinder Reticle Framing */}
        <div className="absolute inset-6 sm:inset-10 md:inset-14 pointer-events-none z-20 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 border-t-2 border-l-2 border-amber-400/50" />
            <div className="w-8 h-8 border-t-2 border-r-2 border-amber-400/50" />
          </div>
          <div className="flex justify-between items-end">
            <div className="w-8 h-8 border-b-2 border-l-2 border-amber-400/50" />
            <div className="w-8 h-8 border-b-2 border-r-2 border-amber-400/50" />
          </div>
        </div>

        {/* Center Optical Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 opacity-35">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="w-px h-8 bg-amber-300" />
            <div className="absolute h-px w-8 bg-amber-300" />
            <div className="absolute w-2 h-2 rounded-full border border-amber-400" />
          </div>
        </div>

        {/* Main Content Overlay: Transitions Synchronously with Scroll */}
        <div className="relative z-20 container mx-auto px-5 sm:px-12 md:px-20 h-full flex flex-col justify-between py-10 sm:py-16 md:py-24">
          {/* Top Exhibition Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono text-amber-300">
                SCROLL-DRIVEN EXHIBITION · REEL
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-stone-300 bg-black/60 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <Eye size={13} className="text-amber-400" />
              <span>LIVE VIEWFINDER MODE</span>
            </div>
          </div>

          {/* Chapter Content Stack */}
          <div className="relative w-full max-w-3xl my-auto">
            {chapters.map((chap, idx) => {
              const currentOp = idx === 0 ? op1 : idx === 1 ? op2 : op3;
              return (
                <motion.div
                  key={chap.id}
                  style={{ opacity: currentOp }}
                  className={`${
                    idx === 0 ? "relative" : "absolute top-0 left-0 right-0"
                  } pointer-events-auto`}
                >
                  {/* Category & Badge */}
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs tracking-widest uppercase mb-2.5 sm:mb-4 backdrop-blur-md">
                    <Sparkles size={11} className="text-amber-400" />
                    <span>{chap.category}</span>
                  </div>

                  <div className="flex items-baseline gap-3 sm:gap-4 mb-1.5 sm:mb-2">
                    <span className="text-3xl sm:text-6xl md:text-7xl font-serif text-amber-400/40 font-light">
                      {chap.num}
                    </span>
                    <h2 className="text-2xl sm:text-5xl md:text-6xl font-serif tracking-tight text-white uppercase font-normal">
                      {chap.title}
                    </h2>
                  </div>

                  <p className="text-stone-300 text-xs sm:text-base md:text-xl font-light leading-relaxed max-w-2xl mb-3 sm:mb-6 line-clamp-2 sm:line-clamp-none">
                    {chap.subtitle}
                  </p>

                  <blockquote className="border-l-2 border-amber-400/60 pl-3 sm:pl-4 py-0.5 sm:py-1 text-xs sm:text-base text-stone-400 italic mb-4 sm:mb-8 max-w-xl line-clamp-2 sm:line-clamp-none">
                    &ldquo;{chap.notes}&rdquo;
                  </blockquote>

                  {/* Camera EXIF Strip */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono text-stone-300 bg-black/70 backdrop-blur-xl p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 w-fit">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-amber-300">
                      <Camera size={13} />
                      <span className="font-semibold">{chap.lens}</span>
                    </div>
                    <span className="text-white/20">|</span>
                    <div className="flex items-center gap-1">
                      <Aperture size={12} className="text-amber-400" />
                      <span>{chap.fstop}</span>
                    </div>
                    <span className="text-white/20">|</span>
                    <span>{chap.shutter}</span>
                    <span className="text-white/20">|</span>
                    <span>{chap.iso}</span>
                    <span className="text-white/20 hidden md:inline">|</span>
                    <span className="text-stone-400 hidden md:inline">{chap.location}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Bar with Scroll Scrub Timeline & Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 pt-3 sm:pt-6 border-t border-white/10">
            {/* Scroll Progress Timeline */}
            <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
              <span className="text-[10px] sm:text-[11px] font-mono text-amber-300/80 uppercase tracking-wider">
                SCRUB TIMELINE
              </span>
              <div className="relative flex-1 sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  style={{ width: scrubHeight }}
                  className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-amber-400 to-amber-200"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-mono text-stone-400 shrink-0">03 CHAPTERS</span>
            </div>

            {/* Quick Link to 3D Archives */}
            <div className="w-full sm:w-auto flex justify-center sm:justify-end">
              <Link
                href="#albums"
                className="w-full sm:w-auto text-center justify-center px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-amber-100 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] active:scale-95"
              >
                <Disc size={13} />
                Explore 3D Vault
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
