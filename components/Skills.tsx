"use client";
import { motion } from "framer-motion";
import { Cpu, Brain, Terminal, Layers } from "lucide-react";

const skillCategories = [
  {
    title: "Embedded Systems",
    icon: <Cpu size={18} />,
    skills: ["C/C++", "VHDL", "SystemC", "Arduino", "ARM Cortex-M3"],
    className: "md:col-span-2",
  },
  {
    title: "AI & Research",
    icon: <Brain size={18} />,
    skills: ["PyTorch", "YOLOv8", "NumPy", "MATLAB", "Simulink"],
    className: "md:col-span-1",
  },
  {
    title: "Software Suite",
    icon: <Terminal size={18} />,
    skills: ["TypeScript", "Next.js", "Git", "React Native", "Java"],
    className: "md:col-span-1",
  },
  {
    title: "Systems Architecture",
    icon: <Layers size={18} />,
    skills: ["Structural Minimalism", "System Modeling", "Product Design"],
    className: "md:col-span-2",
  },
];

export default function Skills() {
  return (
    <section id="skills" className="bg-[#080808] py-24 px-6 md:px-16 border-b border-white/10">
      <div className="mb-16">
        <p className="text-xs font-mono text-white/30 tracking-[0.3em] mb-3">// CORE_CAPABILITIES</p>
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase">
          Engineering<br/><span className="italic text-white/20">Stack</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
        {skillCategories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`${cat.className} bg-[#080808] p-8 relative group hover:bg-white/[0.03] transition-colors duration-300`}
          >
            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/20 group-hover:border-[#00f2ff] transition-colors" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/20 group-hover:border-[#00f2ff] transition-colors" />

            <div className="flex items-center gap-3 mb-6 text-[#00f2ff]">
              {cat.icon}
              <h3 className="text-sm font-mono tracking-widest text-white uppercase">
                {cat.title}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-mono px-3 py-1 border border-white/15 text-white/60 hover:border-[#00f2ff] hover:text-[#00f2ff] transition-all duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>

            <p className="mt-6 text-xs font-mono text-white/20 tracking-widest">
              SYSTEM_AUTHENTICATED
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
