"use client";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#080808] py-24 px-6 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="text-xs font-mono text-white/30 tracking-[0.3em] mb-6">{"// INITIATE_CONTACT"}</p>
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none mb-4">
          {"LET'S BUILD THE"}
        </h2>
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white/20 italic uppercase leading-none mb-16">
          NEXT SYSTEM
        </h2>

        <p className="text-xs font-mono text-white/40 tracking-widest mb-12 max-w-xl">
          CURRENTLY OPEN TO ENGINEERING OPPORTUNITIES IN AR, AI, AND EMBEDDED SYSTEMS. BASED IN TORONTO, CA.
        </p>

        <a
          href="mailto:irfan.bilal0904@gmail.com"
          className="inline-block text-sm font-mono text-[#00f2ff] border border-[#00f2ff] px-8 py-4 hover:bg-[#00f2ff] hover:text-black transition-all duration-200 tracking-widest mb-20"
        >
          INITIATE CONTACT →
        </a>

        <div className="flex justify-between items-end border-t border-white/10 pt-8">
          <div className="flex gap-6">
            <a href="https://github.com/bilxl-irfan" className="text-white/30 hover:text-white transition-colors"><Github size={18} /></a>
            <a href="https://www.linkedin.com/in/bilal-irfan-575583233/" className="text-white/30 hover:text-white transition-colors"><Linkedin size={18} /></a>
            <a href="mailto:irfan.bilal0904@gmail.com" className="text-white/30 hover:text-white transition-colors"><Mail size={18} /></a>
          </div>
          <p className="text-xs font-mono text-white/20">{"© BILAL IRFAN // SYSTEM_ACTIVE"}</p>
        </div>
      </motion.div>
    </footer>
  );
}
