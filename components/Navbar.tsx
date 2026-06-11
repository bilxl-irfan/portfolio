"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

const navItems = ["Home", "About", "Skills", "Projects", "Contact"];

function CircuitLogo() {
  return (
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ scale: 1.1, rotate: 3 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      {/* Outer ring */}
      <motion.circle
        cx="24"
        cy="24"
        r="15"
        stroke="white"
        strokeWidth="2"
        strokeOpacity="0.85"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.85 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Inner ring */}
      <motion.circle
        cx="24"
        cy="24"
        r="8"
        stroke="#00f2ff"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      />

      {/* Center node — subtle breathing animation */}
      <motion.circle
        cx="24"
        cy="24"
        r="3"
        fill="#00f2ff"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1, 1.1, 1], opacity: [0, 1, 1, 1] }}
        transition={{ duration: 1.2, delay: 0.5, repeat: Infinity, repeatDelay: 2 }}
      />

      {/* Top stub */}
      <motion.line
        x1="24"
        y1="5"
        x2="24"
        y2="9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ y2: 5, opacity: 0 }}
        animate={{ y2: 9, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      />

      {/* Left stub */}
      <motion.line
        x1="8"
        y1="24"
        x2="12"
        y2="24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ x2: 8, opacity: 0 }}
        animate={{ x2: 12, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      />

      {/* Bottom-right stub */}
      <motion.line
        x1="36"
        y1="36"
        x2="33"
        y2="33"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ x1: 33, y1: 33, opacity: 0 }}
        animate={{ x1: 36, y1: 36, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      />
    </motion.svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLight, setIsLight] = useState(() => {
    if (typeof window !== "undefined") {
      const theme = localStorage.getItem("theme");
      const root = document.documentElement;
      return theme === "light" || (theme === null && root.classList.contains("light"));
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (isLight) {
        root.classList.add("light");
      } else {
        root.classList.remove("light");
      }
    }
  }, [isLight]);

  const toggleLightMode = () => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    if (root.classList.contains("light")) {
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setIsLight(false);
    } else {
      root.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsLight(true);
    }
  };

  const handleNav = (item: string) => {
    setOpen(false);
    setTimeout(() => {
      const el = document.getElementById(item.toLowerCase());
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-6 py-3 bg-[#080808]/80 backdrop-blur-md border-b border-white/10"
      >
        {/* Desktop links — left */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNav(item)}
              className="text-xs font-mono text-white/50 hover:text-[#00f2ff] transition-colors duration-200 tracking-widest uppercase"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Mobile: site label left */}
        <span className="md:hidden text-xs font-mono text-white/30 tracking-widest">
          BILAL_IRFAN
        </span>

        {/* Logo — right corner on both mobile and desktop */}
        <div className="flex items-center gap-4 z-[110]">
          {/* Theme Toggle */}
          <button
            onClick={toggleLightMode}
            className="text-white/50 hover:text-[#00f2ff] p-1.5 rounded transition-all duration-200 cursor-pointer"
            aria-label="Toggle Light/Dark Theme"
          >
            {isLight ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <CircuitLogo />

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/60 hover:text-[#00f2ff] transition-colors z-[110]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[99] bg-[#080808]/95 backdrop-blur-lg flex flex-col justify-center items-start px-10"
          >
            <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.012)_2px,rgba(255,255,255,0.012)_4px)]" />

            <p className="text-xs font-mono text-white/20 tracking-[0.3em] mb-10">
              {"// NAVIGATE"}
            </p>

            <div className="flex flex-col gap-2">
              {navItems.map((item, i) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ delay: i * 0.07 + 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => handleNav(item)}
                  className="text-left text-5xl font-black tracking-tighter text-white/80 hover:text-[#00f2ff] transition-colors duration-200 uppercase"
                >
                  {item}
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-16 text-xs font-mono text-white/20 tracking-widest"
            >
              LIVE_V1.0 // SYSTEM_ACTIVE
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
