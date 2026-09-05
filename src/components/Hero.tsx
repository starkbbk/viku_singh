"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Disc, Camera, Sparkles, Aperture } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

const heroBackgroundPhotos = [
  { src: "/portfolio/Background/026a01b4-7c2d-4117-a19a-7b9fa9a5c02d.JPG", title: "Celebration Flash" },
  { src: "/portfolio/Background/2de7bd2c-146f-4771-be6e-ea590c84a47c.JPG", title: "Amber Silhouette" },
  { src: "/portfolio/Background/2f4a6773-39fc-49a2-aa82-76664b0b5bb8.JPG", title: "Midnight Spark" },
  { src: "/portfolio/Background/4aac5cd8-ecf6-40b5-a98d-db50214c9611.JPG", title: "Prismatic Wave" },
  { src: "/portfolio/Background/6263c93c-afba-4572-a460-24a48ddd6eb2.JPG", title: "Atmospheric Glow" },
  { src: "/portfolio/Background/c37b6374-dee4-4f6f-b204-a1b39cb9d138.JPG", title: "Sublime Frame" },
  { src: "/portfolio/Background/d7b393da-2533-4024-9d80-f1aad6966bcf.JPG", title: "Golden Mirage" },
  { src: "/portfolio/Background/e9154f79-6eb2-4594-944f-82fb4e74e645.JPG", title: "Silvery Shadow" },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const { scrollY } = useScroll();
  // Scroll-driven aperture expansion and focus pull
  const apertureScale = useTransform(scrollY, [0, 500], [1, 2.8]);
  const apertureRotate = useTransform(scrollY, [0, 500], [0, 90]);
  const heroY = useTransform(scrollY, [0, 600], [0, 160]);
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0.15]);
  const bgScale = useTransform(scrollY, [0, 600], [1.02, 1.15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-24 pb-16 perspective-1200 select-none bg-[#08070b]"
    >
      {/* 3D Dynamic Floating Photo Wall in Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Darkroom Vignette Overlay for Crisp Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08070b]/90 via-[#0d0c12]/80 to-[#08070b] z-10" />
        <div className="absolute inset-0 darkroom-grid opacity-30 z-10 pointer-events-none" />

        {/* Ambient Darkroom Warm Glows */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[160px] pointer-events-none" />

        {/* Continuous 3D Floating Infinite Film Strip Ribbon */}
        <motion.div
          className="flex h-full w-fit items-center"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 42,
          }}
          style={{
            rotateX: mouseOffset.y * -6,
            rotateY: mouseOffset.x * 10,
            scale: bgScale,
          }}
        >
          {[...heroBackgroundPhotos, ...heroBackgroundPhotos].map((item, index) => (
            <div
              key={index}
              className="relative h-[75vh] w-[280px] sm:w-[380px] md:w-[460px] mx-4 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/10 shrink-0 transform-gpu"
              style={{
                transform: `translateZ(${((index % 3) - 1) * 35}px) rotateZ(${
                  ((index % 5) - 2) * 1.5
                }deg)`,
              }}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover opacity-50 filter contrast-110 brightness-90"
                priority={index < 3}
                sizes="460px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
              <div className="absolute bottom-4 left-4 font-mono text-[10px] text-amber-300/80 uppercase tracking-widest flex items-center gap-1.5">
                <Camera size={11} className="text-amber-400" />
                FRAME // 0{index + 1} · 35MM
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll-Driven Aperture Iris Simulation Layer */}
      <motion.div
        style={{
          scale: apertureScale,
          rotate: apertureRotate,
        }}
        className="absolute z-10 pointer-events-none opacity-20 hidden md:flex items-center justify-center"
      >
        <div className="w-[580px] h-[580px] rounded-full border border-amber-400/30 flex items-center justify-center">
          <div className="w-[460px] h-[460px] rounded-full border border-dashed border-amber-400/20 flex items-center justify-center">
            <Aperture size={280} className="text-amber-400/30 stroke-[0.5]" />
          </div>
        </div>
      </motion.div>

      {/* Hero Foreground 3D Glass Editorial Frame */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        animate={{
          rotateX: mouseOffset.y * -8,
          rotateY: mouseOffset.x * 10,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-20 container mx-auto px-6 text-center max-w-4xl preserve-3d"
      >
        <div className="glass-panel p-5 sm:p-10 md:p-16 rounded-3xl border border-white/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-2xl">
          {/* Subtle Viewfinder Reticles */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-amber-400/60" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-amber-400/60" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-amber-400/60" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-amber-400/60" />

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Top Photography Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-amber-400/25 text-amber-300 text-[11px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase mb-4 sm:mb-6 backdrop-blur-md shadow-lg">
              <Camera size={13} className="text-amber-400 shrink-0" />
              <span>Fine Art Photography · New Delhi</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-[0.05em] sm:tracking-[0.08em] mb-3 sm:mb-4 text-white uppercase font-normal">
              VIKU SINGH
            </h1>

            <p className="text-[11px] sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase text-stone-300 mb-4 sm:mb-6 font-light">
              Haute Couture · Portraiture · Concerts · Street
            </p>

            <p className="text-stone-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light">
              Crafting high-contrast editorial narratives and capturing unfiltered human moments through a cinematic lens.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
              <Link
                href="#visual-stories"
                className="group w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black font-semibold tracking-wider text-xs uppercase rounded-full hover:bg-amber-100 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(245,158,11,0.25)] active:scale-95 cursor-pointer"
              >
                <Disc className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700 text-black" />
                Explore Visual Stories
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-black" />
              </Link>

              <Link
                href="#albums"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 glass hover:bg-white/10 text-white font-light tracking-wider text-xs uppercase rounded-full transition-all border border-white/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={14} className="text-amber-400" />
                3D Spatial Vault
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/50 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      >
        <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-amber-300/80 whitespace-nowrap">
          SCROLL TO ENTER CINEMATIC STORIES
        </span>
        <div className="w-[1px] h-8 sm:h-10 bg-gradient-to-b from-amber-400/80 via-amber-200/40 to-transparent" />
      </motion.div>
    </section>
  );
}
