"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Camera, MapPin, Award, Clock, Sparkles, Disc } from "lucide-react";
import Image from "next/image";

const stats = [
  { icon: Camera, label: "Curated Shoots", value: "150+" },
  { icon: Clock, label: "Behind the Shutter", value: "3+ Years" },
  { icon: Disc, label: "Raw Exposures", value: "50K+" },
  { icon: Award, label: "Published Features", value: "12+" },
];

const philosophyWords = [
  "Light", "is", "not", "merely", "illumination.",
  "It", "is", "emotion,", "silence,", "and", "raw", "human",
  "truth", "captured", "forever", "in", "a", "single", "shutter", "click."
];

function KineticWord({
  word,
  index,
  total,
  scrollYProgress,
}: {
  word: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = index / total;
  const end = Math.min(start + 0.15, 1);
  const color = useTransform(
    scrollYProgress,
    [Math.max(0, start - 0.05), start, end],
    ["#332f3d", "#f59e0b", "#ffffff"]
  );
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, start - 0.05), start, end],
    [0.3, 0.9, 1]
  );

  return (
    <motion.span
      style={{ color, opacity }}
      className="inline-block mr-2.5 sm:mr-3.5 transition-colors duration-150"
    >
      {word}
    </motion.span>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const sectionScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.92]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.25, 0.85, 1], [0.4, 1, 1, 0.4]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center py-20 relative overflow-hidden bg-[#08070b] snap-section"
    >
      {/* Darkroom Ambient Background */}
      <div className="absolute inset-0 darkroom-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        style={{ scale: sectionScale, opacity: sectionOpacity }}
        className="container mx-auto px-6 relative z-10 my-auto"
      >
        {/* Kinetic Manifesto Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-950/40 text-amber-300 text-xs tracking-widest uppercase mb-6">
            <Sparkles size={13} className="text-amber-400" />
            <span>DEVELOPING THE UNSEEN · PHILOSOPHY</span>
          </div>

          <h2 className="text-xl sm:text-3xl md:text-5xl font-serif leading-snug sm:leading-tight uppercase font-normal tracking-wide">
            {philosophyWords.map((word, idx) => (
              <KineticWord
                key={idx}
                word={word}
                index={idx}
                total={philosophyWords.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </h2>
        </div>

        {/* Biography & Portrait Grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Portrait with 35mm Film Sprocket Frame */}
          <motion.div
            style={{ y: portraitY }}
            className="lg:col-span-5 relative group"
          >
            {/* 35mm Film Negative Frame */}
            <div className="relative rounded-3xl p-3 sm:p-4 bg-[#121016] border border-amber-400/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
              {/* Top Sprocket Strip */}
              <div className="flex justify-between items-center px-2 py-1.5 mb-2 border-b border-white/10 font-mono text-[9px] text-amber-300/70">
                <span>KODAK PORTRA 400</span>
                <span>35MM FILM</span>
                <span>EXP 24</span>
              </div>

              {/* Portrait Photo */}
              <div className="relative h-[320px] sm:h-[480px] w-full rounded-2xl overflow-hidden bg-black">
                <Image
                  src="/portfolio/viku/a00fc7ab-36b7-4f5c-917c-85a99084a004.JPG"
                  alt="Viku Singh"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Bottom Sprocket Strip */}
              <div className="flex justify-between items-center px-2 py-1.5 mt-2 border-t border-white/10 font-mono text-[9px] text-amber-300/70">
                <span>NEW DELHI</span>
                <span>VIKU SINGH</span>
                <span>F/1.2 OPTICS</span>
              </div>

              {/* Location Tag */}
              <div className="absolute -bottom-3 right-2 sm:-bottom-4 sm:-right-4 glass-panel p-3 sm:p-3.5 rounded-2xl flex items-center gap-2.5 shadow-xl border border-amber-400/30">
                <MapPin className="text-amber-400" size={16} />
                <div>
                  <p className="text-[9px] sm:text-[10px] text-stone-400 uppercase tracking-widest font-mono">Location</p>
                  <p className="text-xs font-semibold text-white">New Delhi, India</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text & Stats Column */}
          <div className="lg:col-span-7">
            <h3 className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em] mb-2 font-semibold">
              ABOUT THE ARTIST
            </h3>
            <h4 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white uppercase tracking-tight mb-4 sm:mb-6 font-normal">
              Visual Storyteller & <br />
              <span className="text-amber-300">Light Sculptor</span>
            </h4>

            <div className="space-y-4 sm:space-y-5 text-stone-300 text-sm sm:text-base md:text-lg leading-relaxed font-light mb-8 sm:mb-10">
              <p>
                Hello, I&apos;m Viku Singh. Photography began for me not as a technical trade,
                but as a fascination with how fleeting light transforms ordinary spaces into
                monumental memories.
              </p>
              <p>
                Specializing in editorial fashion, live concert spectacles, and unfiltered street
                portraiture, I compose each frame using authentic primes—seeking deep contrast,
                warm natural textures, and unscripted human emotion.
              </p>
            </div>

            {/* Photography Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass-panel p-3.5 sm:p-4 rounded-2xl text-center border border-white/10 hover:border-amber-400/40 transition-colors group"
                >
                  <stat.icon className="w-5 h-5 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xl sm:text-2xl font-serif font-bold text-white mb-0.5">
                    {stat.value}
                  </p>
                  <p className="text-[9px] sm:text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
