"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Image from "next/image";

const categories = ["All", "Wedding", "Portrait", "Fashion", "Street"];

const portfolioItems = [
    {
        id: 1,
        title: "Urban Solitude",
        category: "Street",
        src: "https://images.unsplash.com/photo-1445975849567-eb6b522b3041?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Ethereal Bride",
        category: "Wedding",
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Neon Nights",
        category: "Fashion",
        src: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 4,
        title: "Golden Hour",
        category: "Portrait",
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 5,
        title: "City Rhythm",
        category: "Street",
        src: "https://images.unsplash.com/photo-1475598322381-f1b499717dda?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 6,
        title: "Vogue Edit",
        category: "Fashion",
        src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 7,
        title: "The Vows",
        category: "Wedding",
        src: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 8,
        title: "Raw Emotion",
        category: "Portrait",
        src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
    },
];

export default function Portfolio() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const filteredItems =
        activeCategory === "All"
            ? portfolioItems
            : portfolioItems.filter((item) => item.category === activeCategory);

    const openLightbox = (index: number) => {
        // Find the actual index in the full list if filtered
        // For simplicity in this demo, we'll just use the filtered list index for navigation
        // but we need to map it back to the filtered item
        setSelectedImageIndex(index);
    };

    const closeLightbox = () => setSelectedImageIndex(null);

    const nextImage = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) =>
                prev === filteredItems.length - 1 ? 0 : (prev as number) + 1
            );
        }
    };

    const prevImage = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) =>
                prev === 0 ? filteredItems.length - 1 : (prev as number) - 1
            );
        }
    };

    return (
        <section id="portfolio" className="py-20 bg-black/20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-accent-cyan font-medium tracking-widest mb-2 uppercase">Portfolio</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">Selected Works</h3>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                                    ? "bg-accent-cyan text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                    : "glass text-gray-300 hover:bg-white/10"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid */}
                <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    <AnimatePresence>
                        {filteredItems.map((item, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                key={item.id}
                                className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer"
                                onClick={() => openLightbox(index)}
                            >
                                <Image
                                    src={item.src}
                                    alt={item.title}
                                    width={600}
                                    height={800}
                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                                    <h4 className="text-xl font-bold text-white mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {item.title}
                                    </h4>
                                    <p className="text-accent-cyan text-sm uppercase tracking-wider translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                        {item.category}
                                    </p>
                                    <div className="mt-4 p-2 bg-white/10 rounded-full backdrop-blur-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                                        <Maximize2 size={20} className="text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImageIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
                            onClick={closeLightbox}
                        >
                            <X size={40} />
                        </button>

                        <button
                            className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                            }}
                        >
                            <ChevronLeft size={40} />
                        </button>

                        <motion.div
                            key={selectedImageIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="relative max-w-5xl max-h-[85vh] w-full h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={filteredItems[selectedImageIndex].src}
                                alt={filteredItems[selectedImageIndex].title}
                                fill
                                className="object-contain"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-center">
                                <h3 className="text-2xl font-bold text-white">{filteredItems[selectedImageIndex].title}</h3>
                                <p className="text-accent-cyan">{filteredItems[selectedImageIndex].category}</p>
                            </div>
                        </motion.div>

                        <button
                            className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                        >
                            <ChevronRight size={40} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
