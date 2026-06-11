"use client";
import { motion } from "framer-motion";
import { Zap, Github, ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "AR DRONE INTERFACE",
    company: "MOSTAVIO",
    description: "Architecting an AR display system for a one-man drone. Bridging real-time telemetry with OLED hardware integration.",
    tech: ["C++", "AR Systems", "Hardware SDKs"],
    color: "#ff5722",
    link: null,
    visual: {
      label: "AR_HUD",
      lines: [
        { x1: 10, y1: 20, x2: 90, y2: 20 },
        { x1: 10, y1: 50, x2: 60, y2: 50 },
        { x1: 10, y1: 80, x2: 75, y2: 80 },
      ],
      circles: [{ cx: 80, cy: 50, r: 18 }, { cx: 80, cy: 50, r: 10 }],
      color: "#ff5722",
    },
  },
  {
    title: "YOLOv8 PEST DETECTION",
    company: "RESEARCH",
    description: "Deep learning framework optimized for edge devices. Detecting agricultural threats in real-time with 90%+ precision.",
    tech: ["PyTorch", "YOLOv8", "Computer Vision"],
    color: "#00f2ff",
    link: null,
    visual: {
      label: "CV_MODEL",
      lines: [
        { x1: 20, y1: 20, x2: 80, y2: 20 },
        { x1: 20, y1: 20, x2: 20, y2: 80 },
        { x1: 80, y1: 20, x2: 80, y2: 80 },
        { x1: 20, y1: 80, x2: 80, y2: 80 },
        { x1: 35, y1: 35, x2: 65, y2: 65 },
        { x1: 65, y1: 35, x2: 35, y2: 65 },
      ],
      circles: [{ cx: 50, cy: 50, r: 14 }],
      color: "#00f2ff",
    },
  },
  {
    title: "AIR CANVAS",
    company: "COMPUTER VISION",
    description: "Real-time hand gesture recognition for mid-air drawing. Built with OpenCV and MediaPipe for zero-latency tracking.",
    tech: ["Python", "OpenCV", "MediaPipe"],
    color: "#a855f7",
    link: "https://github.com/bilxl-irfan",
    visual: {
      label: "GESTURE_MAP",
      lines: [
        { x1: 50, y1: 10, x2: 30, y2: 40 },
        { x1: 50, y1: 10, x2: 50, y2: 45 },
        { x1: 50, y1: 10, x2: 70, y2: 40 },
        { x1: 30, y1: 40, x2: 20, y2: 75 },
        { x1: 50, y1: 45, x2: 50, y2: 80 },
        { x1: 70, y1: 40, x2: 80, y2: 75 },
      ],
      circles: [{ cx: 50, cy: 10, r: 4 }],
      color: "#a855f7",
    },
  },
  {
    title: "RIVET NEWS APP",
    company: "FULL STACK",
    description: "News aggregation platform with ML-powered personalization. Built with React Native, served with a custom recommendation engine.",
    tech: ["React Native", "TypeScript", "ML"],
    color: "#22c55e",
    link: "https://github.com/bilxl-irfan",
    visual: {
      label: "DATA_FEED",
      lines: [
        { x1: 15, y1: 25, x2: 85, y2: 25 },
        { x1: 15, y1: 45, x2: 70, y2: 45 },
        { x1: 15, y1: 65, x2: 80, y2: 65 },
        { x1: 15, y1: 85, x2: 55, y2: 85 },
      ],
      circles: [],
      color: "#22c55e",
    },
  },
];

import { useState, useEffect } from "react";

function ArHudVisual({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="w-full md:w-72 h-36 md:h-44 border border-white/10 relative overflow-hidden flex-shrink-0 group-hover:border-[#ff5722]/30 transition-colors duration-300 bg-black/40 backdrop-blur-md rounded-lg p-2"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,87,34,0.06)_0%,transparent_70%)]" />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* Compass Ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          stroke="#ff5722"
          strokeWidth="0.5"
          strokeOpacity="0.4"
          fill="none"
          strokeDasharray="2,2"
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        {/* Compass Crosshair lines */}
        <line x1="50" y1="12" x2="50" y2="88" stroke="#ff5722" strokeWidth="0.25" strokeOpacity="0.2" />
        <line x1="12" y1="50" x2="88" y2="50" stroke="#ff5722" strokeWidth="0.25" strokeOpacity="0.2" />

        {/* Pitch Ladder (tilts and moves up/down) */}
        <motion.g
          animate={{ y: [-4, 4, -4], rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Horizon line */}
          <line x1="30" y1="50" x2="45" y2="50" stroke="#ff5722" strokeWidth="0.75" strokeOpacity="0.8" />
          <line x1="55" y1="50" x2="70" y2="50" stroke="#ff5722" strokeWidth="0.75" strokeOpacity="0.8" />
          {/* Ladder tick 1 */}
          <line x1="38" y1="40" x2="62" y2="40" stroke="#ff5722" strokeWidth="0.5" strokeOpacity="0.5" />
          <line x1="38" y1="40" x2="38" y2="43" stroke="#ff5722" strokeWidth="0.5" strokeOpacity="0.5" />
          <line x1="62" y1="40" x2="62" y2="43" stroke="#ff5722" strokeWidth="0.5" strokeOpacity="0.5" />
          {/* Ladder tick 2 */}
          <line x1="38" y1="60" x2="62" y2="60" stroke="#ff5722" strokeWidth="0.5" strokeOpacity="0.5" />
          <line x1="38" y1="60" x2="38" y2="57" stroke="#ff5722" strokeWidth="0.5" strokeOpacity="0.5" />
          <line x1="62" y1="60" x2="62" y2="57" stroke="#ff5722" strokeWidth="0.5" strokeOpacity="0.5" />
        </motion.g>

        {/* Center reticle */}
        <circle cx="50" cy="50" r="2" fill="none" stroke="#ff5722" strokeWidth="0.5" />
      </svg>

      {/* Side HUD text readouts */}
      <div className="absolute top-3 left-3 text-[8px] font-mono text-[#ff5722]/60 tracking-wider">
        ALT: <motion.span animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 0.5, repeat: Infinity }}>142m</motion.span>
      </div>
      <div className="absolute top-3 right-3 text-[8px] font-mono text-[#ff5722]/60 tracking-wider">
        SPD: 42km/h
      </div>
      <div className="absolute bottom-3 left-3 text-[8px] font-mono text-[#ff5722]/60 tracking-widest">
        [ AR_HUD_MODE ]
      </div>
      <div className="absolute bottom-3 right-3 text-[8px] font-mono text-[#ff5722]/80 font-black">
        PITCH: ACTIVE
      </div>

      {/* Frame corners */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20" />
      
      {/* Scanline sweep */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] opacity-20 bg-gradient-to-r from-transparent via-[#ff5722] to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: index * 0.2 }}
      />
    </motion.div>
  );
}

function CvModelVisual({ index }: { index: number }) {
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const targets = [
        { x: 30, y: 35 },
        { x: 70, y: 45 },
        { x: 45, y: 65 },
        { x: 60, y: 25 },
      ];
      const nextTarget = targets[Math.floor(Math.random() * targets.length)];
      setLocked(false);
      
      setTimeout(() => {
        setCoords(nextTarget);
        setLocked(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="w-full md:w-72 h-36 md:h-44 border border-white/10 relative overflow-hidden flex-shrink-0 group-hover:border-[#00f2ff]/30 transition-colors duration-300 bg-black/40 backdrop-blur-md rounded-lg p-2"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.06)_0%,transparent_70%)]" />
      
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* Coordinate grids */}
        <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(0, 242, 255, 0.05)" strokeWidth="0.25" />
        <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(0, 242, 255, 0.05)" strokeWidth="0.25" />
        <line x1="0" y1="60" x2="100" y2="60" stroke="rgba(0, 242, 255, 0.05)" strokeWidth="0.25" />
        <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(0, 242, 255, 0.05)" strokeWidth="0.25" />
        <line x1="20" y1="0" x2="20" y2="100" stroke="rgba(0, 242, 255, 0.05)" strokeWidth="0.25" />
        <line x1="40" y1="0" x2="40" y2="100" stroke="rgba(0, 242, 255, 0.05)" strokeWidth="0.25" />
        <line x1="60" y1="0" x2="60" y2="100" stroke="rgba(0, 242, 255, 0.05)" strokeWidth="0.25" />
        <line x1="80" y1="0" x2="80" y2="100" stroke="rgba(0, 242, 255, 0.05)" strokeWidth="0.25" />

        {/* Tracking crosshair */}
        <motion.g animate={{ x: coords.x - 50, y: coords.y - 50 }} transition={{ type: "spring", stiffness: 80, damping: 15 }}>
          {/* Target box */}
          <motion.rect
            x="38"
            y="38"
            width="24"
            height="24"
            rx="2"
            fill="none"
            stroke={locked ? "#00f2ff" : "rgba(0, 242, 255, 0.4)"}
            strokeWidth="0.75"
            animate={{ scale: locked ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.3 }}
          />
          {/* Corners */}
          <path d="M 36 44 L 36 36 L 44 36" fill="none" stroke="#00f2ff" strokeWidth="1" />
          <path d="M 64 36 L 64 44" fill="none" stroke="#00f2ff" strokeWidth="1" />
          <path d="M 56 36 L 64 36" fill="none" stroke="#00f2ff" strokeWidth="1" />
          <path d="M 36 56 L 36 64 L 44 64" fill="none" stroke="#00f2ff" strokeWidth="1" />
          <path d="M 56 64 L 64 64 L 64 56" fill="none" stroke="#00f2ff" strokeWidth="1" />
          
          {/* Tiny center dot */}
          <circle cx="50" cy="50" r="1" fill="#00f2ff" />
        </motion.g>
      </svg>

      {/* Target details */}
      <div className="absolute top-3 left-3 text-[8px] font-mono text-[#00f2ff]/70 tracking-wider">
        CV_FEED: ACTIVE
      </div>
      <div className="absolute top-3 right-3 text-[8px] font-mono text-[#00f2ff] tracking-wider font-bold">
        {locked ? "LOCK_ACQUIRED" : "SCANNING..."}
      </div>
      <div className="absolute bottom-3 left-3 text-[8px] font-mono text-[#00f2ff]/60 tracking-wider">
        LOC: {coords.x}, {coords.y}
      </div>
      <div className="absolute bottom-3 right-3 text-[8px] font-mono text-[#00f2ff]/80 font-black">
        CONF: {locked ? "98.2%" : "---"}
      </div>

      {/* Frame corners */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20" />
    </motion.div>
  );
}

function AirCanvasVisual({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="w-full md:w-72 h-36 md:h-44 border border-white/10 relative overflow-hidden flex-shrink-0 group-hover:border-[#a855f7]/30 transition-colors duration-300 bg-black/40 backdrop-blur-md rounded-lg p-2"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.06)_0%,transparent_70%)]" />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* Draw Path */}
        <motion.path
          d="M 15 50 C 30 20, 40 80, 55 50 C 70 20, 80 80, 85 50"
          fill="none"
          stroke="#a855f7"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0.8, 1, 1, 0.8] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Pointer dot tracking path */}
        <motion.circle
          r="3"
          fill="#a855f7"
          animate={{
            cx: [15, 22.5, 33, 47, 55, 63, 73, 80.5, 85],
            cy: [50, 32, 38, 62, 50, 38, 62, 68, 50],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ filter: "drop-shadow(0px 0px 4px #a855f7)" }}
        />
      </svg>

      {/* Hud Readouts */}
      <div className="absolute top-3 left-3 text-[8px] font-mono text-[#a855f7]/60 tracking-wider">
        GESTURE: ENABLED
      </div>
      <div className="absolute top-3 right-3 text-[8px] font-mono text-[#a855f7]/60 tracking-wider">
        FPS: 60
      </div>
      <div className="absolute bottom-3 left-3 text-[8px] font-mono text-[#a855f7]/60 tracking-widest">
        [ MID_AIR_DRAW ]
      </div>
      <div className="absolute bottom-3 right-3 text-[8px] font-mono text-[#a855f7]/80 font-black">
        TRACKING: ACTIVE
      </div>

      {/* Frame corners */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20" />
    </motion.div>
  );
}

function DataFeedVisual({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="w-full md:w-72 h-36 md:h-44 border border-white/10 relative overflow-hidden flex-shrink-0 group-hover:border-[#22c55e]/30 transition-colors duration-300 bg-black/40 backdrop-blur-md rounded-lg p-2"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.06)_0%,transparent_70%)]" />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* Database nodes */}
        <circle cx="20" cy="50" r="3" fill="#22c55e" />
        <circle cx="50" cy="25" r="2.5" fill="#22c55e" fillOpacity="0.6" />
        <circle cx="50" cy="50" r="2.5" fill="#22c55e" fillOpacity="0.6" />
        <circle cx="50" cy="75" r="2.5" fill="#22c55e" fillOpacity="0.6" />
        <circle cx="80" cy="35" r="3" fill="#22c55e" />
        <circle cx="80" cy="65" r="3" fill="#22c55e" />

        {/* Links */}
        <line x1="20" y1="50" x2="50" y2="25" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.2" />
        <line x1="20" y1="50" x2="50" y2="50" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.2" />
        <line x1="20" y1="50" x2="50" y2="75" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.2" />
        <line x1="50" y1="25" x2="80" y2="35" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.2" />
        <line x1="50" y1="50" x2="80" y2="35" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.2" />
        <line x1="50" y1="50" x2="80" y2="65" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.2" />
        <line x1="50" y1="75" x2="80" y2="65" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.2" />

        {/* Moving pulses along lines */}
        <motion.circle
          r="1.5"
          fill="#22c55e"
          animate={{
            cx: [20, 50, 80],
            cy: [50, 25, 35],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          r="1.5"
          fill="#22c55e"
          animate={{
            cx: [20, 50, 80],
            cy: [50, 50, 65],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
        />
        <motion.circle
          r="1.5"
          fill="#22c55e"
          animate={{
            cx: [20, 50, 80],
            cy: [50, 75, 65],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
        />
      </svg>

      {/* Hud details */}
      <div className="absolute top-3 left-3 text-[8px] font-mono text-[#22c55e]/60 tracking-wider">
        DATA_PIPELINE
      </div>
      <div className="absolute top-3 right-3 text-[8px] font-mono text-[#22c55e]/60 tracking-wider">
        REQ: 200 OK
      </div>
      <div className="absolute bottom-3 left-3 text-[8px] font-mono text-[#22c55e]/60 tracking-widest">
        [ RECOMMEND_SYS ]
      </div>
      <div className="absolute bottom-3 right-3 text-[8px] font-mono text-[#22c55e]/80 font-black">
        FEED: STREAMING
      </div>

      {/* Frame corners */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20" />
    </motion.div>
  );
}

const renderVisual = (index: number) => {
  switch (index) {
    case 0:
      return <ArHudVisual index={index} />;
    case 1:
      return <CvModelVisual index={index} />;
    case 2:
      return <AirCanvasVisual index={index} />;
    case 3:
      return <DataFeedVisual index={index} />;
    default:
      return null;
  }
};

export default function Projects() {
  return (
    <section id="projects" className="bg-[#080808] py-20 md:py-24 px-5 md:px-16 border-b border-white/10">
      <div className="mb-12 md:mb-16">
        <p className="text-xs font-mono text-white/30 tracking-[0.3em] mb-3">{"// PROJECT_LAB_ACCESS"}</p>
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase">
          Selected<br />
          <span className="italic text-white/20">Works</span>
        </h2>
      </div>

      <div className="divide-y divide-white/10">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
            className="group flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-10 md:py-12 px-6 md:px-8 -mx-6 md:-mx-8 rounded-xl transition-all duration-300"
          >
            <div className="flex-1 w-full">
              <p className="text-xs font-mono tracking-[0.3em] mb-3" style={{ color: project.color }}>
                {project.company}
              </p>
              <h3 className="text-2xl md:text-5xl font-black tracking-tighter text-white mb-4 transition-colors duration-300 group-hover:opacity-80">
                {project.title}
              </h3>
              <p className="text-sm text-white/50 max-w-lg leading-relaxed mb-6 font-mono">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t) => (
                  <span key={t} className="text-xs font-mono px-3 py-1 border border-white/20 text-white/50 tracking-widest">
                    {t}
                  </span>
                ))}
              </div>
              <a
                href={project.link ?? "#"}
                target={project.link ? "_blank" : undefined}
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-white/40 hover:text-[#00f2ff] border border-white/20 hover:border-[#00f2ff] px-4 py-2 transition-all duration-200"
              >
                <Zap size={12} />
                VIEW TECHNICAL BREAKDOWN
              </a>
            </div>

            {renderVisual(index)}
          </motion.div>
        ))}
      </div>

      {/* GitHub CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-16 pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
      >
        <div>
          <p className="text-xs font-mono text-white/30 tracking-[0.3em] mb-1">{"// MORE_IN_THE_LAB"}</p>
          <p className="text-sm font-mono text-white/50">Additional projects, experiments & open source work.</p>
        </div>
        <a
          href="https://github.com/bilxl-irfan"
          target="_blank"
          rel="noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-3 text-xs font-mono px-6 py-3 border border-white/20 text-white/60 hover:text-white hover:border-white transition-all duration-200 group"
        >
          <Github size={14} />
          VIEW ALL ON GITHUB
          <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </a>
      </motion.div>
    </section>
  );
}
