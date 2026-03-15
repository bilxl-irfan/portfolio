"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => setIsHovering((e.target as HTMLElement).matches("a, button, [data-hover]"));
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] w-3 h-3 bg-[#00f2ff] rounded-full pointer-events-none mix-blend-difference"
        animate={{ x: pos.x - 6, y: pos.y - 6, scale: isHovering ? 2.5 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      <motion.div
        className="fixed top-0 left-0 z-[9998] w-8 h-8 border border-white/30 rounded-full pointer-events-none"
        animate={{ x: pos.x - 16, y: pos.y - 16 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      />
    </>
  );
}
