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
        src: "/portfolio/38d8c8f1-d0be-48c0-aa1d-665a11551375.JPG",
    },
    {
        id: 2,
        title: "Ethereal Bride",
        category: "Wedding",
        src: "/portfolio/5110bce8-fff9-4e1c-b40d-09d9e8b8f12a.JPG",
    },
    {
        id: 3,
        title: "Neon Nights",
        category: "Fashion",
        src: "/portfolio/5efacc1a-c325-4410-a547-a02628630219.JPG",
    },
    {
        id: 4,
        title: "Golden Hour",
        category: "Portrait",
        src: "/portfolio/6235e189-b240-455e-b119-4fd787d88662.JPG",
    },
    {
        id: 5,
        title: "City Rhythm",
        category: "Street",
        src: "/portfolio/6c2a2cd6-faee-430e-b247-b24e83a15491.JPG",
    },
    {
        id: 6,
        title: "Vogue Edit",
        category: "Fashion",
        src: "/portfolio/7de304fd-77a7-4ac8-af6d-0d039ece7653.JPG",
    },
    {
        id: 7,
        title: "The Vows",
        category: "Wedding",
        src: "/portfolio/80a9d234-c9a9-492a-ad40-f34ee7b8a7ad.JPG",
    },
    {
        id: 8,
        title: "Raw Emotion",
        category: "Portrait",
        src: "/portfolio/8dc0d1af-b3b4-4f60-a293-63973a3a282d.JPG",
    },
    {
        id: 9,
        title: "Captured Moment 9",
        category: "Wedding",
        src: "/portfolio/026a01b4-7c2d-4117-a19a-7b9fa9a5c02d.JPG",
    },
    {
        id: 10,
        title: "Captured Moment 10",
        category: "Portrait",
        src: "/portfolio/03124d5c-609f-44ca-ab19-cef83cdc2a2a.JPG",
    },
    {
        id: 11,
        title: "Captured Moment 11",
        category: "Fashion",
        src: "/portfolio/06dad40b-757a-4a53-8d2c-7d0ed7c80844.JPG",
    },
    {
        id: 12,
        title: "Captured Moment 12",
        category: "Street",
        src: "/portfolio/236c7fba-f637-4072-ac1e-c8fd0440e392.JPG",
    },
    {
        id: 13,
        title: "Captured Moment 13",
        category: "Wedding",
        src: "/portfolio/2965e099-b8f8-4a2a-a4a2-4111a9d78cf8.JPG",
    },
    {
        id: 14,
        title: "Captured Moment 14",
        category: "Portrait",
        src: "/portfolio/2f4a6773-39fc-49a2-aa82-76664b0b5bb8.JPG",
    },
    {
        id: 15,
        title: "Captured Moment 15",
        category: "Fashion",
        src: "/portfolio/35455759-90f9-47e3-a4d3-3f2f2dfc2136.JPG",
    },
    {
        id: 16,
        title: "Captured Moment 16",
        category: "Street",
        src: "/portfolio/3bdbcce7-a792-4393-b28d-2760c9523d62.JPG",
    },
    {
        id: 17,
        title: "Captured Moment 17",
        category: "Wedding",
        src: "/portfolio/4aac5cd8-ecf6-40b5-a98d-db50214c9611.JPG",
    },
    {
        id: 18,
        title: "Captured Moment 18",
        category: "Portrait",
        src: "/portfolio/6263c93c-afba-4572-a460-24a48ddd6eb2.JPG",
    },
    {
        id: 19,
        title: "Captured Moment 19",
        category: "Fashion",
        src: "/portfolio/9e296412-8c86-4205-bf06-17916ef89b1a.JPG",
    },
    {
        id: 20,
        title: "Captured Moment 20",
        category: "Street",
        src: "/portfolio/b2593d4d-d976-41ed-8f5d-d475e5367286.JPG",
    },
    {
        id: 21,
        title: "Captured Moment 21",
        category: "Wedding",
        src: "/portfolio/c37b6374-dee4-4f6f-b204-a1b39cb9d138.JPG",
    },
    {
        id: 22,
        title: "Captured Moment 22",
        category: "Portrait",
        src: "/portfolio/d1a6b195-a146-464a-ae86-789e607e10c5.JPG",
    },
    {
        id: 23,
        title: "Captured Moment 23",
        category: "Fashion",
        src: "/portfolio/d7c48394-07af-41fe-98e8-caea899dcca5.JPG",
    },
    {
        id: 24,
        title: "Captured Moment 24",
        category: "Street",
        src: "/portfolio/d7d02646-3b1a-44c1-9f2c-004bd3194988.JPG",
    },
    {
        id: 25,
        title: "Captured Moment 25",
        category: "Wedding",
        src: "/portfolio/df973b95-abae-4441-80fb-f7fb38dbbf55.JPG",
    },
    {
        id: 26,
        title: "Captured Moment 26",
        category: "Portrait",
        src: "/portfolio/e489ee6f-9740-4d48-a4d3-41decc6ce45b.JPG",
    },
    {
        id: 27,
        title: "Captured Moment 27",
        category: "Fashion",
        src: "/portfolio/e5e7e00f-6961-484b-9e27-e4f9b039fc4d.JPG",
    },
    {
        id: 28,
        title: "Captured Moment 28",
        category: "Street",
        src: "/portfolio/e615db48-2896-4d90-8cf0-3fb096231576.JPG",
    },
    {
        id: 29,
        title: "Captured Moment 29",
        category: "Wedding",
        src: "/portfolio/e6c4d66f-29ff-49e7-809b-4e969c02cfe5.JPG",
    },
    {
        id: 30,
        title: "Captured Moment 30",
        category: "Portrait",
        src: "/portfolio/e9154f79-6eb2-4594-944f-82fb4e74e645.JPG",
    },
    {
        id: 31,
        title: "Captured Moment 31",
        category: "Fashion",
        src: "/portfolio/e9e3e961-a0b5-46f4-9773-f0923a09a0d5.JPG",
    },
    {
        id: 32,
        title: "Captured Moment 32",
        category: "Street",
        src: "/portfolio/f94dece2-f49b-4fc6-84b1-2a7e51fd2db4.JPG",
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
