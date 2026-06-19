"use client";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import Experience from "./Experience";

function useScramble(text: string, trigger: boolean) {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%";

  useEffect(() => {
    if (!trigger) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) =>
            i < iteration ? text[i] : chars[Math.floor(Math.random() * chars.length)]
          )
          .join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 0.4;
    }, 40);
    return () => clearInterval(interval);
  }, [trigger, text]);

  return trigger ? display : text;
}

function AnimatedName({
  text,
  delay = 0,
  outline = false,
}: {
  text: string;
  delay?: number;
  outline?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [autoScramble, setAutoScramble] = useState(false);
  const scrambled = useScramble(text, hovered || autoScramble);

  useEffect(() => {
    const loop = setInterval(() => {
      setAutoScramble(true);
      setTimeout(() => setAutoScramble(false), text.length * 40 + 200);
    }, 4000 + delay);
    return () => clearInterval(loop);
  }, [delay, text]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [4, -4]);
  const rotateY = useTransform(x, [-200, 200], [-6, 6]);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 25 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 25 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 800,
        ...(outline
          ? { WebkitTextStroke: "2px var(--name-stroke)", color: "transparent" }
          : {}),
      }}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
        setHovered(false);
      }}
      onMouseEnter={() => setHovered(true)}
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className="select-none"
    >
      {scrambled}
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-[#080808] flex flex-col justify-between overflow-hidden border-b border-white/10"
    >
      {/* Particle Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Experience />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 flex justify-between items-start px-6 pt-20 text-xs text-white/40 font-mono">
        <span>{"// SYSTEM_INITIALIZED / REV_0.1"}</span>
        <div className="text-right">
          <div>43.6532° N, 79.3832° W</div>
          <div>UNI_OF_WATERLOO // TMU_ALUM</div>
        </div>
      </div>

      {/* Name */}
      <div
        className="relative z-10 px-6 md:px-16 py-10 text-[clamp(72px,16vw,200px)] font-black leading-none tracking-tighter uppercase"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <AnimatedName text="BILAL" delay={0} />
        <AnimatedName text="IRFAN" delay={0.3} outline />
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end px-6 pb-8 gap-4 text-xs font-mono"
      >
        <div>
          <span className="text-[#00f2ff]">[ CORE_FOCUS ]</span>
          <p className="mt-1 text-white/50 max-w-md leading-relaxed">
            Computer Engineering Intern @ Mostavio. Developing AR architecture for drone systems & optimized edge intelligence.
          </p>
        </div>
        <div className="text-white/30 tracking-widest animate-pulse">
          AWAITING COMMAND
        </div>
      </motion.div>

      {/* Scanlines */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.012)_2px,rgba(255,255,255,0.012)_4px)]" />
    </section>
  );
}
