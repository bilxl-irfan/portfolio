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

function BlueprintVisual({ visual, index }: { visual: typeof projects[0]["visual"]; index: number }) {
  return (
    <div className="w-full md:w-72 h-36 md:h-44 border border-white/10 relative overflow-hidden flex-shrink-0 group-hover:border-white/20 transition-colors duration-300">
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 50%, ${visual.color}08 0%, transparent 70%)` }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {visual.lines.map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke={visual.color}
            strokeWidth="0.5"
            strokeOpacity="0.4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: i * 0.1 + index * 0.2 }}
          />
        ))}
        {visual.circles.map((c, i) => (
          <motion.circle
            key={i}
            cx={c.cx} cy={c.cy} r={c.r}
            stroke={visual.color}
            strokeWidth="0.5"
            strokeOpacity="0.5"
            fill="none"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
          />
        ))}
      </svg>
      <div className="absolute bottom-2 left-3 text-[10px] font-mono tracking-widest" style={{ color: visual.color, opacity: 0.5 }}>
        [ {visual.label} ]
      </div>
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/20" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-white/20" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-white/20" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/20" />
      <motion.div
        className="absolute left-0 right-0 h-px opacity-20"
        style={{ background: `linear-gradient(90deg, transparent, ${visual.color}, transparent)` }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
      />
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="bg-[#080808] py-20 md:py-24 px-5 md:px-16 border-b border-white/10">
      <div className="mb-12 md:mb-16">
        <p className="text-xs font-mono text-white/30 tracking-[0.3em] mb-3">// PROJECT_LAB_ACCESS</p>
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
            className="group flex flex-col md:flex-row justify-between items-start gap-6 py-10 md:py-12 transition-all duration-300"
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

            <BlueprintVisual visual={project.visual} index={index} />
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
          <p className="text-xs font-mono text-white/30 tracking-[0.3em] mb-1">// MORE_IN_THE_LAB</p>
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
