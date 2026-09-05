"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VisualStoryChapters from "@/components/VisualStoryChapters";
import Albums3D from "@/components/Albums3D";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CinematicLoader from "@/components/CinematicLoader";

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <main className="min-h-screen bg-[#08070b] text-white selection:bg-amber-400 selection:text-black relative">
      {/* Cinematic 3D Aperture & Lens Calibration Loader */}
      {showLoader && (
        <CinematicLoader onComplete={() => setShowLoader(false)} />
      )}

      {/* Main Website Structure */}
      <Navbar onReplayIntro={() => setShowLoader(true)} />
      <Hero />
      <VisualStoryChapters />
      <Albums3D />
      <Portfolio />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
