"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Zap, Sun, BatteryMedium, Sparkles } from "lucide-react";
import Image from "next/image";

interface CinematicLoaderProps {
  onComplete: () => void;
}

export default function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFocusLocked, setIsFocusLocked] = useState(false);
  const [isShutterPressed, setIsShutterPressed] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // High-fidelity Camera Sound Effects (Focus Hunting, AF Lock & Mechanical Shutter)
  const playSound = useCallback(
    (type: "af-hunt" | "af-lock" | "shutter-click") => {
      if (isMuted || typeof window === "undefined") return;
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") ctx.resume();

        const now = ctx.currentTime;

        if (type === "af-hunt") {
          // Lens focus search step
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(280, now);
          osc.frequency.exponentialRampToValueAtTime(160, now + 0.04);

          gain.gain.setValueAtTime(0.015, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
        } else if (type === "af-lock") {
          // Crisp camera AF-lock double beep (1560Hz)
          [0, 0.08].forEach((delay) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(1560, now + delay);

            gain.gain.setValueAtTime(0.08, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + delay);
            osc.stop(now + delay + 0.06);
          });
        } else if (type === "shutter-click") {
          // Punchy mechanical camera shutter click
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);

          // Second leaf curtain rebound
          setTimeout(() => {
            if (!ctx) return;
            const t = ctx.currentTime;
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(320, t);
            osc2.frequency.exponentialRampToValueAtTime(65, t + 0.06);

            gain2.gain.setValueAtTime(0.25, t);
            gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(t);
            osc2.stop(t + 0.06);
          }, 35);
        }
      } catch {
        // Fallback
      }
    },
    [isMuted]
  );

  // Auto-Focus & Loading Progress Simulation
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 6) + 4;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        setIsFocusLocked(true);
        playSound("af-lock");
        clearInterval(interval);
      } else {
        setProgress(current);
        if (Math.random() > 0.65) playSound("af-hunt");
      }
    }, 60);

    return () => clearInterval(interval);
  }, [playSound]);

  // Execute Shutter Release and Screen Flash
  const triggerShutterClick = useCallback(() => {
    if (isFlashing || isExiting) return;
    setIsShutterPressed(true);
    playSound("shutter-click");

    // Camera flash bursts immediately
    setTimeout(() => {
      setIsFlashing(true);
    }, 70);

    // Fade out viewfinder under the brilliant white flash
    setTimeout(() => {
      setIsExiting(true);
    }, 320);

    // Smooth entry to website
    setTimeout(() => {
      onComplete();
    }, 950);
  }, [isFlashing, isExiting, playSound, onComplete]);

  // Auto trigger shot shortly after focus lock
  useEffect(() => {
    if (progress === 100) {
      const autoShotTimer = setTimeout(() => {
        triggerShutterClick();
      }, 1200);
      return () => clearTimeout(autoShotTimer);
    }
  }, [progress, triggerShutterClick]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="fullscreen-camera-viewfinder"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(14px)",
            transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
          }}
          className="fixed inset-0 z-[100] bg-black text-white flex flex-col justify-between select-none overflow-hidden"
        >
          {/* ======================================================== */}
          {/* FULLSCREEN CAMERA LENS LIVE VIEW (PHOTO BEING FRAMED)     */}
          {/* ======================================================== */}
          <motion.div
            className="absolute inset-0 z-0 overflow-hidden transform-gpu"
            animate={{
              scale: isFocusLocked ? [1, 1.015, 1] : [1.03, 1, 1.03],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/portfolio/Background/d7b393da-2533-4024-9d80-f1aad6966bcf.JPG"
              alt="Live Viewfinder View"
              fill
              priority
              className="object-cover transition-all duration-700 ease-out"
              style={{
                filter: isFocusLocked
                  ? "blur(0px) brightness(1.05) contrast(1.12)"
                  : `blur(${Math.max(0, (100 - progress) * 0.12)}px) brightness(0.9) contrast(1.05)`,
              }}
              sizes="100vw"
            />

            {/* Subtle Viewfinder Edge Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/80 pointer-events-none" />
            <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />
          </motion.div>

          {/* ======================================================== */}
          {/* CAMERA RULE-OF-THIRDS COMPOSITION GRID & CORNER RETICLES */}
          {/* ======================================================== */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Horizontal Grid Lines */}
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/15" />
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/15" />

            {/* Vertical Grid Lines */}
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/15" />
            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/15" />

            {/* 4 Viewfinder Corner Framing Brackets */}
            <div className="absolute inset-4 sm:inset-10 flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-white/60" />
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-white/60" />
              </div>
              <div className="flex justify-between">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-white/60" />
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-white/60" />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* TOP CAMERA STATUS & TELEMETRY BAR                        */}
          {/* ======================================================== */}
          <div className="relative z-20 flex items-center justify-between px-4 sm:px-10 pt-4 sm:pt-6 text-xs font-mono text-white/90">
            {/* Left Flash & Format Badges */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20">
                <Zap size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-[11px] font-semibold tracking-wider">AUTO</span>
              </div>

              <div className="hidden sm:flex items-center px-2.5 py-1.5 rounded-md bg-black/50 backdrop-blur-md border border-white/20 text-[10px] tracking-widest font-bold">
                RAW MAX · 48MP
              </div>

              <div className="hidden md:flex items-center px-2.5 py-1.5 rounded-md bg-black/50 backdrop-blur-md border border-white/20 text-[10px] text-amber-300">
                4K · 60 FPS
              </div>
            </div>

            {/* Center Brand Title */}
            <div className="text-center">
              <span className="font-serif tracking-[0.25em] text-sm uppercase text-white drop-shadow-md">
                VIKU SINGH
              </span>
              <p className="text-[9px] font-mono tracking-widest text-amber-300 uppercase">
                PRO VIEW &bull; {isFocusLocked ? "LOCKED" : "FOCUSING"}
              </p>
            </div>

            {/* Right Battery & Sound Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white transition-colors cursor-pointer text-[11px]"
              >
                {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className="text-amber-400" />}
                <span className="hidden sm:inline">{isMuted ? "Muted" : "Sound"}</span>
              </button>

              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[11px]">
                <BatteryMedium size={14} className="text-emerald-400" />
                <span className="font-semibold">98%</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CENTER ACTIVE CAMERA FOCUS BOX WITH EXPOSURE SUN SLIDER  */}
          {/* ======================================================== */}
          <div className="relative z-20 flex flex-col items-center justify-center my-auto pointer-events-none">
            <motion.div
              animate={{
                scale: isFocusLocked ? 1 : [1, 1.08, 1],
              }}
              transition={{
                repeat: isFocusLocked ? 0 : Infinity,
                duration: 1.8,
                ease: "easeInOut",
              }}
              className="relative flex items-center justify-center"
            >
              {/* Yellow / Amber Pro Camera Focus Box */}
              <div
                className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                  isFocusLocked
                    ? "border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.6)]"
                    : "border-yellow-400/80 shadow-[0_0_15px_rgba(250,204,21,0.4)]"
                }`}
              >
                {/* 4 Corner Ticks */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white" />

                {/* Center Target Spot */}
                <div
                  className={`w-3 h-3 rounded-full transition-colors ${
                    isFocusLocked
                      ? "bg-amber-400 shadow-[0_0_10px_#f59e0b]"
                      : "bg-yellow-300 animate-ping"
                  }`}
                />

                {/* Focus Lock Badge */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-amber-300 whitespace-nowrap shadow-lg">
                  {isFocusLocked ? "● AF-LOCKED · f/1.2" : `FOCUSING ${progress}%`}
                </div>
              </div>

              {/* Side Exposure Sun Dial Slider (Iconic Phone / Camera UI) */}
              <motion.div
                animate={{
                  y: isFocusLocked ? -10 : [0, 8, 0],
                }}
                transition={{ duration: 2, repeat: isFocusLocked ? 0 : Infinity }}
                className="absolute -right-8 flex flex-col items-center gap-1.5 text-amber-400"
              >
                <div className="w-px h-10 bg-amber-400/50" />
                <Sun size={18} className="fill-amber-400/40 animate-spin" style={{ animationDuration: "12s" }} />
                <div className="w-px h-10 bg-amber-400/50" />
              </motion.div>
            </motion.div>
          </div>

          {/* ======================================================== */}
          {/* BOTTOM CAMERA CONTROLS: LENS SELECTOR & SHUTTER BUTTON   */}
          {/* ======================================================== */}
          <div className="relative z-20 flex flex-col items-center pb-8 sm:pb-12 px-6">
            {/* Focal Length Lens Selector (.5 · 1x · 2x · 3x) */}
            <div className="flex items-center gap-2 mb-6 bg-black/50 backdrop-blur-md p-1.5 rounded-full border border-white/15">
              {[
                { label: ".5", sub: "16mm" },
                { label: "1x", sub: "35mm", active: true },
                { label: "2x", sub: "50mm" },
                { label: "3x", sub: "85mm" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                    opt.active
                      ? "bg-amber-400 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Mode Strip (CINEMATIC · PHOTO · PORTRAIT) */}
            <div className="flex items-center gap-6 mb-6 text-[11px] font-mono tracking-widest uppercase text-white/50">
              <span className="hidden sm:inline">CINEMATIC</span>
              <span className="text-white/70">PHOTO</span>
              <span className="text-amber-400 font-bold border-b border-amber-400 pb-0.5">
                PORTRAIT
              </span>
              <span className="hidden sm:inline">PANORAMA</span>
            </div>

            {/* Big Iconic Pro White Camera Shutter Button */}
            <div className="relative flex flex-col items-center">
              <motion.button
                type="button"
                onClick={triggerShutterClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: isShutterPressed ? 0.88 : 1,
                }}
                transition={{ duration: 0.08 }}
                title="Press Shutter to Take Photo"
                className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full border-4 border-white/80 p-1.5 flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(0,0,0,0.8)] active:scale-95 group"
              >
                {/* Inner Solid White Shutter Button */}
                <div className="w-full h-full rounded-full bg-white group-hover:bg-amber-100 transition-colors shadow-inner flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full border border-stone-400/40" />
                </div>
              </motion.button>

              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase text-stone-300 mt-2.5 flex items-center gap-1.5 text-center px-4">
                <Sparkles size={11} className="text-amber-400 shrink-0" />
                TAP SHUTTER TO CAPTURE &bull; AUTO SHOOT
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CAMERA SHUTTER BLINDING WHITE FLASH EXPLOSION            */}
          {/* ======================================================== */}
          {isFlashing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.95, 0] }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="fixed inset-0 bg-white z-[999] pointer-events-none"
              style={{
                boxShadow: "inset 0 0 150px rgba(254, 243, 199, 0.95)",
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
