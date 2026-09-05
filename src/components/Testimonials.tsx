"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah & James",
    role: "Wedding Clients · New Delhi",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    content:
      "Viku didn't just document our celebration; he captured the very soul of the night. Looking at the gallery feels like stepping directly back into that golden euphoria. Unmatched artistry.",
    rating: 5,
  },
  {
    id: 2,
    name: "Elena Rodriguez",
    role: "Haute Fashion Editorial Model",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    content:
      "Working with Viku in the studio is effortless. His understanding of chiaroscuro lighting and raw silhouette creates frames that look like Italian Vogue covers. Pure mastery of optics.",
    rating: 5,
  },
  {
    id: 3,
    name: "Arjun Verma",
    role: "Music Festival Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    content:
      "Covering live stages requires extraordinary reflex and lens speed. Viku captured pyro explosions, crowd energy, and performer intimacy flawlessly. Our definitive visual partner.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextTestimonial();
    } else if (diff < -40) {
      prevTestimonial();
    }
    setTouchStart(null);
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="testimonials"
      className="min-h-screen flex flex-col justify-center items-center py-16 relative overflow-hidden bg-[#08070b]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="container mx-auto px-4 sm:px-6 w-full my-auto"
      >
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-amber-950/40 text-amber-300 text-[11px] sm:text-xs tracking-widest uppercase mb-3 sm:mb-4">
            <Sparkles size={13} className="text-amber-400" />
            <span>COLLECTOR & CLIENT REVIEWS</span>
          </div>
          <h2 className="text-xs uppercase font-mono tracking-[0.3em] text-amber-400 mb-2 font-semibold">
            TESTIMONIALS
          </h2>
          <h3 className="text-3xl sm:text-5xl font-serif text-white uppercase tracking-tight font-normal">
            Reflections & Words
          </h3>
        </div>

        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="max-w-4xl mx-auto relative touch-pan-y"
        >
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-white/5 pointer-events-none">
            <Quote size={140} />
          </div>

          <div className="relative z-10 min-h-[300px] sm:min-h-[360px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <div className="glass-panel p-6 sm:p-12 md:p-14 rounded-3xl text-center border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                  <div className="flex justify-center mb-4 sm:mb-6 gap-1">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-base sm:text-xl md:text-2xl font-serif text-stone-200 italic mb-6 sm:mb-8 leading-relaxed font-light">
                    &ldquo;{testimonials[currentIndex].content}&rdquo;
                  </p>

                  <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-amber-400/50 shrink-0">
                      <Image
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="font-serif font-bold text-white tracking-wide text-sm sm:text-base">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-[11px] sm:text-xs font-mono text-amber-300">
                        {testimonials[currentIndex].role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Desktop Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              aria-label="Previous Testimonial"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 glass rounded-full hover:bg-amber-400/20 text-white hover:text-amber-300 transition-colors z-20 hidden md:block cursor-pointer"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={nextTestimonial}
              aria-label="Next Testimonial"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 glass rounded-full hover:bg-amber-400/20 text-white hover:text-amber-300 transition-colors z-20 hidden md:block cursor-pointer"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Indicator Dots & Mobile Nav Arrows */}
          <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8">
            <button
              onClick={prevTestimonial}
              aria-label="Previous Testimonial"
              className="md:hidden p-2 rounded-full glass text-white/70 hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentIndex ? "w-8 bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              aria-label="Next Testimonial"
              className="md:hidden p-2 rounded-full glass text-white/70 hover:text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
