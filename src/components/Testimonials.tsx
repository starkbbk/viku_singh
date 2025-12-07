"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        id: 1,
        name: "Sarah & James",
        role: "Wedding Clients",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        content: "Viku didn't just take photos; he captured the very soul of our wedding. Looking at the album feels like reliving the day all over again. His presence was so calming and professional.",
        rating: 5,
    },
    {
        id: 2,
        name: "Elena Rodriguez",
        role: "Fashion Model",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        content: "I've worked with many photographers, but Viku's eye for lighting and composition is unmatched. He made me feel completely at ease and the results were absolutely stunning.",
        rating: 5,
    },
    {
        id: 3,
        name: "TechStart Inc.",
        role: "Corporate Client",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        content: "We hired Viku for our annual event and headshots. The quality of work was exceptional and the turnaround time was incredibly fast. Highly recommended for any business needs.",
        rating: 5,
    },
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(nextTestimonial, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="testimonials" className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-accent-cyan font-medium tracking-widest mb-2 uppercase">Testimonials</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">Kind Words</h3>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-white/5">
                        <Quote size={120} />
                    </div>

                    <div className="relative z-10 min-h-[400px] flex items-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                className="w-full"
                            >
                                <div className="glass-panel p-8 md:p-12 rounded-3xl text-center">
                                    <div className="flex justify-center mb-6">
                                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>

                                    <p className="text-xl md:text-2xl text-gray-200 italic mb-8 leading-relaxed">
                                        "{testimonials[currentIndex].content}"
                                    </p>

                                    <div className="flex items-center justify-center gap-4">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-accent-cyan">
                                            <Image
                                                src={testimonials[currentIndex].image}
                                                alt={testimonials[currentIndex].name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-bold text-white">{testimonials[currentIndex].name}</h4>
                                            <p className="text-sm text-accent-cyan">{testimonials[currentIndex].role}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <button
                            onClick={prevTestimonial}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 glass rounded-full hover:bg-white/10 transition-colors z-20"
                        >
                            <ChevronLeft className="text-white" />
                        </button>
                        <button
                            onClick={nextTestimonial}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 glass rounded-full hover:bg-white/10 transition-colors z-20"
                        >
                            <ChevronRight className="text-white" />
                        </button>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-accent-cyan" : "bg-white/20 hover:bg-white/40"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
