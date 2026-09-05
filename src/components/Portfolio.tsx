"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2, Camera, Sparkles } from "lucide-react";
import Image from "next/image";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  src: string;
  exif: string;
}

const categories = ["All", "Event", "Fashion", "Street"];

const portfolioItems: PortfolioItem[] = [
  // Event
  { id: 1, title: "Grand Celebration Entrance", category: "Event", src: "/portfolio/Event/026a01b4-7c2d-4117-a19a-7b9fa9a5c02d.JPG", exif: "35mm · f/1.8 · 1/500s" },
  { id: 2, title: "Ecstatic Stage Lights", category: "Event", src: "/portfolio/Event/03124d5c-609f-44ca-ab19-cef83cdc2a2a.JPG", exif: "85mm · f/1.4 · 1/800s" },
  { id: 3, title: "Candid Laughter in Crowd", category: "Event", src: "/portfolio/Event/06dad40b-757a-4a53-8d2c-7d0ed7c80844.JPG", exif: "50mm · f/1.4 · 1/400s" },
  { id: 4, title: "Nocturnal Sparks", category: "Event", src: "/portfolio/Event/1f34c60f-c24a-49b5-92ce-77b57ee3e46b.JPG", exif: "35mm · f/2.0 · 1/250s" },
  { id: 5, title: "Champagne Toast Moments", category: "Event", src: "/portfolio/Event/227b6d87-68ed-4891-b238-b74993aff70c.JPG", exif: "85mm · f/1.4 · 1/640s" },
  { id: 6, title: "Dancefloor Rhythm", category: "Event", src: "/portfolio/Event/2965e099-b8f8-4a2a-a4a2-4111a9d78cf8.JPG", exif: "24mm · f/2.8 · 1/200s" },
  { id: 7, title: "Royal Amber Glow", category: "Event", src: "/portfolio/Event/2de7bd2c-146f-4771-be6e-ea590c84a47c.JPG", exif: "50mm · f/1.2 · 1/1000s" },
  { id: 8, title: "Celebration Fireworks", category: "Event", src: "/portfolio/Event/2f4a6773-39fc-49a2-aa82-76664b0b5bb8.JPG", exif: "35mm · f/1.4 · 1/800s" },
  { id: 9, title: "Midnight Revelry", category: "Event", src: "/portfolio/Event/35455759-90f9-47e3-a4d3-3f2f2dfc2136.JPG", exif: "85mm · f/1.8 · 1/320s" },
  { id: 10, title: "Neon Horizon Party", category: "Event", src: "/portfolio/Event/38d8c8f1-d0be-48c0-aa1d-665a11551375.JPG", exif: "35mm · f/1.4 · 1/500s" },
  { id: 11, title: "Ceremonial Harmony", category: "Event", src: "/portfolio/Event/3ac5e3d0-938e-4c3c-ab84-250b37e48271.JPG", exif: "50mm · f/1.4 · 1/400s" },
  { id: 12, title: "Golden Lantern Hour", category: "Event", src: "/portfolio/Event/3bdbcce7-a792-4393-b28d-2760c9523d62.JPG", exif: "85mm · f/1.4 · 1/800s" },

  // Fashion
  { id: 57, title: "Haute Contour I", category: "Fashion", src: "/portfolio/Fashion/04bf13aa-b728-45f2-80e2-35e384a6366c.JPG", exif: "85mm · f/1.2 · 1/2000s" },
  { id: 58, title: "Velvet Silhouette", category: "Fashion", src: "/portfolio/Fashion/42a34cc4-99db-4bec-89c3-5bd56c0c29cb.JPG", exif: "85mm · f/1.4 · 1/1600s" },
  { id: 59, title: "Avant-Garde Drape", category: "Fashion", src: "/portfolio/Fashion/7c224c2a-3214-4990-885b-150a52cb6761.JPG", exif: "50mm · f/1.2 · 1/2500s" },
  { id: 60, title: "Chiaroscuro Form", category: "Fashion", src: "/portfolio/Fashion/8feaebae-e9f3-4952-80d0-a431bd69d6ba.JPG", exif: "85mm · f/1.2 · 1/1250s" },
  { id: 61, title: "Noir Lookbook Vogue", category: "Fashion", src: "/portfolio/Fashion/dd276f26-cc2d-4035-8ca1-29d9c1db4bc1.JPG", exif: "85mm · f/1.8 · 1/800s" },
  { id: 62, title: "Modernist Minimalist", category: "Fashion", src: "/portfolio/Fashion/f588fead-4785-467d-b020-adff03cfab75.JPG", exif: "50mm · f/1.4 · 1/1600s" },
  { id: 63, title: "Monochrome Majesty", category: "Fashion", src: "/portfolio/Fashion/IMG_1596.JPG", exif: "85mm · f/1.2 · 1/3200s" },
  { id: 64, title: "Urban Haute", category: "Fashion", src: "/portfolio/Fashion/IMG_1597.JPG", exif: "85mm · f/1.4 · 1/2000s" },

  // Street
  { id: 66, title: "Monsoon Reflections", category: "Street", src: "/portfolio/Street/026c30df-6c91-4920-b34f-5ebf47e39607.JPG", exif: "28mm · f/1.7 · 1/1000s" },
  { id: 67, title: "Old Delhi Alleys", category: "Street", src: "/portfolio/Street/39ca6b35-d263-4291-a05a-b8a4f6cccc27.JPG", exif: "28mm · f/2.0 · 1/500s" },
  { id: 68, title: "Chai Vendor Solitude", category: "Street", src: "/portfolio/Street/7a034456-8798-446b-828d-a50fa626e893.JPG", exif: "28mm · f/1.7 · 1/400s" },
  { id: 69, title: "Dusk Rickshaw Glow", category: "Street", src: "/portfolio/Street/80de770d-2e5c-4d0a-90c5-5b3c34a4be31.JPG", exif: "28mm · f/2.2 · 1/250s" },
  { id: 70, title: "Metro Pulse Shadows", category: "Street", src: "/portfolio/Street/89bbbd20-b13c-4370-a9c9-3dcb63d10a51.JPG", exif: "28mm · f/1.7 · 1/800s" },
  { id: 71, title: "Passing Gaze", category: "Street", src: "/portfolio/Street/9496e548-972f-42d9-92f1-34519ff23b7c.JPG", exif: "28mm · f/2.0 · 1/1200s" },
];

function GalleryCard({
  item,
  onClick,
}: {
  item: PortfolioItem;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-cursor="VIEW"
      className="relative group overflow-hidden rounded-2xl cursor-pointer w-full mb-6 preserve-3d"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
    >
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-xl group-hover:border-amber-400/40 group-hover:shadow-[0_20px_50px_rgba(245,158,11,0.2)] transition-all duration-300">
        {/* Photograph with internal zoom */}
        <motion.div
          className="relative w-full h-full"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src={item.src}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>

        {/* Soft Darkroom Vignette & Editorial Title */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5">
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 font-bold mb-1">
            {item.category}
          </span>
          <h4 className="text-white font-serif font-normal text-base sm:text-lg tracking-tight">
            {item.title}
          </h4>
          {item.exif && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-stone-300 mt-1.5 sm:mt-2 bg-black/60 px-2.5 sm:px-3 py-1 rounded-full border border-white/10 w-fit backdrop-blur-md">
              <Camera size={12} className="text-amber-400 shrink-0" />
              <span>{item.exif}</span>
            </div>
          )}
          <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 bg-black/70 rounded-full border border-white/20 text-white sm:group-hover:text-amber-400 transition-colors shadow">
            <Maximize2 size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Multi-speed parallax offsets for the 3 columns (only on multi-column desktop)
  const col1Y = useTransform(scrollYProgress, [0, 1], [40, -80]);
  const col2Y = useTransform(scrollYProgress, [0, 1], [-30, 60]);
  const col3Y = useTransform(scrollYProgress, [0, 1], [80, -120]);

  const filteredItems =
    selectedCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  // Distribute items into 3 columns for multi-speed parallax
  const col1Items = filteredItems.filter((_, idx) => idx % 3 === 0);
  const col2Items = filteredItems.filter((_, idx) => idx % 3 === 1);
  const col3Items = filteredItems.filter((_, idx) => idx % 3 === 2);

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) =>
        prev === filteredItems.length - 1 ? 0 : (prev as number) + 1
      );
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) =>
        prev === 0 ? filteredItems.length - 1 : (prev as number) - 1
      );
    }
  };

  return (
    <section
      id="portfolio"
      ref={galleryRef}
      className="min-h-screen flex flex-col justify-center py-20 relative overflow-hidden bg-[#08070b] snap-section"
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-950/40 text-amber-300 text-xs tracking-widest uppercase mb-4">
            <Sparkles size={13} className="text-amber-400" />
            <span>PARALLAX EXHIBITION GALLERY</span>
          </div>
          <h2 className="text-xs uppercase font-mono tracking-[0.3em] text-amber-400 mb-2 font-semibold">
            FINE ART ARCHIVE
          </h2>
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white uppercase tracking-tight font-normal">
            Selected Works
          </h3>
          <p className="text-stone-300 text-base md:text-lg mt-4 font-light">
            Columns flow at varying parallax velocities as you scroll. Hover over any frame for optical details.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-light tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === category
                  ? "bg-amber-400 text-black font-semibold shadow-[0_0_25px_rgba(245,158,11,0.35)]"
                  : "glass text-stone-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {category === "All" ? "All Works" : category}
            </button>
          ))}
        </div>

        {/* 3-Column Multi-Speed Parallax Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Column 1 (Fast Parallax on desktop) */}
          <motion.div style={{ y: isMobile ? 0 : col1Y }} className="w-full">
            {col1Items.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={() => setLightboxIndex(filteredItems.indexOf(item))}
              />
            ))}
          </motion.div>

          {/* Column 2 (Grounded Counter-Speed on desktop) */}
          <motion.div style={{ y: isMobile ? 0 : col2Y }} className="w-full">
            {col2Items.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={() => setLightboxIndex(filteredItems.indexOf(item))}
              />
            ))}
          </motion.div>

          {/* Column 3 (Dynamic Lead Parallax on desktop) */}
          <motion.div style={{ y: isMobile ? 0 : col3Y }} className="w-full">
            {col3Items.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={() => setLightboxIndex(filteredItems.indexOf(item))}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Hi-Res Lightbox Modal with EXIF */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors cursor-pointer"
              onClick={() => setLightboxIndex(null)}
            >
              <X size={36} />
            </button>

            <button
              className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-full cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft size={36} />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[75vh]">
                <Image
                  src={filteredItems[lightboxIndex]?.src || portfolioItems[0].src}
                  alt={filteredItems[lightboxIndex]?.title || portfolioItems[0].title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="mt-4 p-4 text-center">
                <h3 className="text-2xl font-serif text-white uppercase">
                  {filteredItems[lightboxIndex]?.title}
                </h3>
                <div className="flex items-center justify-center gap-3 mt-2 font-mono text-xs">
                  <span className="text-amber-400 font-semibold uppercase">
                    {filteredItems[lightboxIndex]?.category}
                  </span>
                  {filteredItems[lightboxIndex]?.exif && (
                    <>
                      <span className="text-white/30">|</span>
                      <span className="text-stone-300">
                        {filteredItems[lightboxIndex]?.exif}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            <button
              className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-full cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight size={36} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
