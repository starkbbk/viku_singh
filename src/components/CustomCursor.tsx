"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const subscribeFinePointer = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(pointer: fine)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
};

const getFinePointerSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
};

const getServerSnapshot = () => false;

export default function CustomCursor() {
  const hasFinePointer = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getServerSnapshot
  );

  const [cursorState, setCursorState] = useState<{
    text: string;
    isHovered: boolean;
    isClicking: boolean;
  }>({
    text: "",
    isHovered: false,
    isClicking: false,
  });

  const [isVisible, setIsVisible] = useState(false);

  // Mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Soft elegant spring
  const springConfig = { damping: 30, stiffness: 280, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (!hasFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => {
      setCursorState((prev) => ({ ...prev, isClicking: true }));
    };

    const handleMouseUp = () => {
      setCursorState((prev) => ({ ...prev, isClicking: false }));
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("button, a, input, [role='button'], .cursor-pointer");
      const cursorTextAttr = target.closest("[data-cursor]")?.getAttribute("data-cursor");

      if (cursorTextAttr) {
        setCursorState((prev) => ({
          ...prev,
          isHovered: true,
          text: cursorTextAttr,
        }));
      } else if (interactive) {
        setCursorState((prev) => ({
          ...prev,
          isHovered: true,
          text: "",
        }));
      } else {
        setCursorState((prev) => ({
          ...prev,
          isHovered: false,
          text: "",
        }));
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasFinePointer, isVisible, mouseX, mouseY]);

  if (!hasFinePointer || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Outer Photographer Focus Ring */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: cursorState.isClicking ? 0.75 : cursorState.isHovered ? 1.4 : 1,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
        className="absolute flex items-center justify-center pointer-events-none"
      >
        <div
          className={`w-7 h-7 rounded-full border transition-all duration-200 flex items-center justify-center ${
            cursorState.isHovered
              ? "border-amber-400/80 bg-amber-400/5 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              : "border-white/35"
          }`}
        >
          {/* Subtle Viewfinder Tick Marks */}
          <div className="w-1 h-[1px] bg-white/40 absolute -top-1" />
          <div className="w-1 h-[1px] bg-white/40 absolute -bottom-1" />
        </div>

        {/* Minimalist Action Tag */}
        {cursorState.text && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.15em] uppercase font-light text-amber-200 bg-black/75 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/15 whitespace-nowrap shadow"
          >
            {cursorState.text}
          </motion.span>
        )}
      </motion.div>

      {/* Inner Pin-Sharp Optical Center Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: cursorState.isClicking ? 1.6 : cursorState.isHovered ? 0.6 : 1,
        }}
        className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)] pointer-events-none"
      />
    </div>
  );
}
