"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const heroImages = [
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop",
];

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);

    return (
        <section
            id="hero"
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden flex items-center justify-center"
        >
            {/* Background Carousel */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for contrast */}
                <motion.div
                    className="flex h-full w-fit"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30,
                    }}
                >
                    {[...heroImages, ...heroImages].map((src, index) => (
                        <div key={index} className="relative h-full w-screen md:w-[50vw] flex-shrink-0">
                            <Image
                                src={src}
                                alt={`Hero image ${index + 1}`}
                                fill
                                className="object-cover"
                                priority={index < 2}
                            />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Content Overlay */}
            <motion.div
                style={{ y }}
                className="relative z-20 container mx-auto px-6 text-center"
            >
                <div className="glass-panel inline-block px-4 py-8 md:px-16 md:py-20 rounded-2xl w-[90%] max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-accent-cyan font-medium tracking-widest mb-4 uppercase text-sm md:text-base">
                            Lifestyle & Portrait Photographer
                        </h2>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 text-white">
                            VIKU SINGH
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                            Capturing raw emotions and fleeting moments through a cinematic lens.
                            Based in New York, available worldwide.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="#portfolio"
                                className="group px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all flex items-center gap-2"
                            >
                                View Portfolio
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="#contact"
                                className="px-8 py-4 glass hover:bg-white/10 text-white font-semibold rounded-full transition-all border border-white/20"
                            >
                                Book a Shoot
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50 flex flex-col items-center gap-2"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
            </motion.div>
        </section>
    );
}
