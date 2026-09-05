"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Aperture, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Stories", href: "#visual-stories" },
  { name: "3D Vault", href: "#albums", highlight: true },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Philosophy", href: "#about" },
  { name: "Contact", href: "#contact" },
];

interface NavbarProps {
  onReplayIntro?: () => void;
}

export default function Navbar({ onReplayIntro }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-panel py-3 shadow-2xl backdrop-blur-xl border-b border-white/10"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-1">
          <span className="font-serif uppercase tracking-[0.15em] text-white font-normal">VIKU SINGH</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-xs uppercase tracking-widest font-light transition-all flex items-center gap-1.5 ${
                link.highlight
                  ? "text-amber-300 hover:text-white px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              {link.highlight && <Sparkles size={11} className="text-amber-400" />}
              {link.name}
            </Link>
          ))}

          {/* Replay Cinematic Intro Trigger */}
          {onReplayIntro && (
            <button
              type="button"
              onClick={onReplayIntro}
              title="Replay Exhibition Intro"
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-wider uppercase text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/20 rounded-full transition-all cursor-pointer"
            >
              <Aperture size={12} className="text-amber-300" />
              <span>Replay Intro</span>
            </button>
          )}

          <Link
            href="#contact"
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-amber-400 text-black rounded-full transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:bg-amber-300 active:scale-95 cursor-pointer"
          >
            Book Shoot
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 rounded-lg glass cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-[60px] bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 bg-[#0c0a10]/98 backdrop-blur-3xl border-b border-amber-400/20 md:hidden shadow-2xl z-50"
            >
              <div className="flex flex-col p-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-base font-serif tracking-wider uppercase text-stone-200 hover:text-amber-300 transition-colors flex items-center justify-between py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{link.name}</span>
                    {link.highlight && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono">
                        3D VAULT
                      </span>
                    )}
                  </Link>
                ))}

                {onReplayIntro && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onReplayIntro();
                    }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-amber-500/30 bg-amber-950/40 text-amber-300 text-xs font-mono tracking-wider cursor-pointer"
                  >
                    <Aperture size={15} />
                    <span>REPLAY CAMERA INTRO</span>
                  </button>
                )}

                <Link
                  href="#contact"
                  className="px-5 py-3.5 text-center font-semibold tracking-wider text-xs uppercase bg-amber-400 text-black rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 transition-transform"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Book a Shoot
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
