"use client";

import Link from "next/link";
import { Instagram, Twitter, Facebook, Camera } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-10 border-t border-white/10 bg-[#060508] backdrop-blur-md">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
          <Camera size={16} className="text-amber-400 shrink-0" />
          <span className="font-serif uppercase tracking-widest text-white text-sm">
            VIKU SINGH
          </span>
          <span className="text-white/20 hidden sm:inline">|</span>
          <p className="text-stone-400 text-xs font-mono w-full sm:w-auto">
            &copy; {new Date().getFullYear()} Fine Art & Editorial Photography.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-light">
          <Link href="#hero" className="text-stone-400 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="#visual-stories" className="text-stone-400 hover:text-white transition-colors">
            Stories
          </Link>
          <Link href="#albums" className="text-stone-400 hover:text-white transition-colors">
            3D Vault
          </Link>
          <Link href="#portfolio" className="text-stone-400 hover:text-white transition-colors">
            Portfolio
          </Link>
          <Link href="#contact" className="text-stone-400 hover:text-white transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/ind_god_vkt"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-stone-400 hover:text-amber-400 transition-colors p-2 glass rounded-full"
          >
            <Instagram size={16} />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="text-stone-400 hover:text-amber-400 transition-colors p-2 glass rounded-full"
          >
            <Twitter size={16} />
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="text-stone-400 hover:text-amber-400 transition-colors p-2 glass rounded-full"
          >
            <Facebook size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
