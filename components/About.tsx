"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Oscilloscope from "./Oscilloscope";

const techStack = [
  { name: "C/C++", color: "from-orange-500" },
  { name: "React/TS", color: "from-blue-400" },
  { name: "PyTorch", color: "from-purple-500" },
  { name: "VHDL/Verilog", color: "from-green-500" },
  { name: "RTOS/Embedded", color: "from-cyan-400" },
];

export default function About() {
  return (
    <section
      id="about"
      className="bg-[#080808] py-24 px-6 md:px-16 border-b border-white/10 relative overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02] opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-16"
      >
        <p className="text-xs font-mono text-white/30 tracking-[0.3em] mb-3">
          SYSTEM PROFILE
        </p>
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase">
          Engineering <br />
          <span className="italic text-white/20">Core</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Bio & Stats */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="group">
            <p className="text-sm font-mono text-white/60 leading-relaxed max-w-lg mb-8">
              Computer Engineering graduate from{" "}
              <span className="text-[#00f2ff] font-black tracking-wider">
                Toronto Metropolitan University
              </span>
              , incoming graduate student at the{" "}
              <span className="text-[#00f2ff] font-black tracking-wider">
                University of Waterloo
              </span>{" "}
              in September. Specializing in embedded systems, real-time computing, and AI at the edge. 
              Co-founder of ECEC club. Building production systems that run unsupervised.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
              <div>
                <div className="text-2xl font-black text-[#00f2ff]">5+</div>
                <div className="text-xs font-mono text-white/50 uppercase tracking-wider">
                  Projects Deployed
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#00f2ff]">Toronto, CA</div>
                <div className="text-xs font-mono text-white/50 uppercase tracking-wider">
                  Base Station
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Tech Badges */}
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech, i) => (
              <motion.button
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                className="px-4 py-2 text-xs font-mono border border-white/15 text-white/70 hover:text-[#00f2ff] hover:border-[#00f2ff] transition-all duration-200 uppercase tracking-wider flex items-center gap-2 group"
              >
                <Zap size={12} className="group-hover:rotate-12 transition-transform" />
                {tech.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Right: CRT Oscilloscope Visualizer */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="w-full h-80 bg-gradient-to-br from-black/40 via-[#0a0a0a]/60 to-[#00f2ff]/5 backdrop-blur-xl border border-[#00f2ff]/15 rounded-3xl p-6 relative overflow-hidden group">
            {/* CRT Screen Frame */}
            <div className="absolute inset-0 opacity-10 pointer-events-none z-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.012)_2px,rgba(255,255,255,0.012)_4px)]" />
            
            <Oscilloscope />
            
            {/* Controls & branding overlay */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity">
              <div className="text-[10px] font-mono text-white/30 tracking-[0.2em]">LOGIC_ANALYZER // MOD_0.2</div>
            </div>
          </div>

        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-20 pt-12 text-center text-xs font-mono text-white/20 tracking-widest border-t border-white/10"
      >
        AUTHENTICATION: CONFIRMED | STATUS: OPERATIONAL
      </motion.p>
    </section>
  );
}
