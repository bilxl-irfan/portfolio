"use client";
import { useEffect, useRef, useState } from "react";

type WaveType = "sine" | "square" | "triangle" | "sawtooth" | "noise";

export default function Oscilloscope() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [waveType, setWaveType] = useState<WaveType>("sine");
  const [hoverPos, setHoverPos] = useState({ x: -1, y: -1 });
  const [isHovered, setIsHovered] = useState(false);

  // Cycle wave types on click
  const toggleWave = () => {
    const types: WaveType[] = ["sine", "square", "triangle", "sawtooth", "noise"];
    const nextIndex = (types.indexOf(waveType) + 1) % types.length;
    setWaveType(types[nextIndex]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    // Resize handler for Retina/High-DPI display sharpness
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      
      // Clear Screen with slightly glowing CRT phosphor trails
      ctx.fillStyle = "rgba(8, 8, 8, 0.22)"; // slight decay effect for phosphor simulation
      ctx.fillRect(0, 0, w, h);

      // Draw Grid lines
      ctx.strokeStyle = "rgba(0, 242, 255, 0.05)";
      ctx.lineWidth = 1;
      
      // Grid cells
      const divisionsX = 10;
      const divisionsY = 8;
      const stepX = w / divisionsX;
      const stepY = h / divisionsY;

      // Vertical grid lines
      for (let i = 1; i < divisionsX; i++) {
        ctx.beginPath();
        ctx.moveTo(i * stepX, 0);
        ctx.lineTo(i * stepX, h);
        ctx.stroke();
      }

      // Horizontal grid lines
      for (let i = 1; i < divisionsY; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * stepY);
        ctx.lineTo(w, i * stepY);
        ctx.stroke();
      }

      // Center Axes (dashed and slightly brighter)
      ctx.strokeStyle = "rgba(0, 242, 255, 0.15)";
      ctx.setLineDash([4, 4]);
      
      // Center X axis
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Center Y axis
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();
      
      ctx.setLineDash([]); // Reset dashed

      phase += 0.08; // Wave animation speed

      // --- CH1: Primary Analog Signal (Cyan) ---
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(0, 242, 255, 0.7)";
      ctx.strokeStyle = "#00f2ff";
      ctx.lineWidth = 1.8;
      ctx.beginPath();

      for (let x = 0; x < w; x++) {
        // Map x coordinate to a frequency domain range
        const t = (x / w) * 5 * Math.PI;
        let yValue = 0;

        switch (waveType) {
          case "sine":
            // Modulated sine wave: fundamental + frequency modulation envelope
            yValue = Math.sin(t - phase) * Math.sin(t * 0.3) * 0.8;
            break;
          case "square":
            // Band-limited mock square wave with gibbs-phenomenon ripples
            const sineTerm = Math.sin(t * 1.5 - phase);
            yValue = Math.sign(sineTerm) * 0.75 + Math.sin(t * 8 - phase) * 0.05;
            break;
          case "triangle":
            // Triangual waveform
            yValue = (Math.abs(((t - phase * 0.5) % Math.PI) - Math.PI / 2) / (Math.PI / 2) - 0.5) * 1.4;
            break;
          case "sawtooth":
            // Sawtooth waveform
            yValue = (((t - phase * 0.5) % Math.PI) / Math.PI - 0.5) * 1.4;
            break;
          case "noise":
            // High frequency noise
            yValue = (Math.sin(t * 0.5 - phase) * 0.4) + (Math.random() - 0.5) * 0.3;
            break;
        }

        // Apply scale & vertical centering (limit amplitude to ~70% screen height)
        const y = h / 2 + yValue * (h * 0.28);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // --- CH2: Secondary Logic/Clock Train (Orange) ---
      ctx.shadowColor = "rgba(255, 87, 34, 0.5)";
      ctx.strokeStyle = "#ff5722";
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      
      for (let x = 0; x < w; x++) {
        // Digital clock pulse (CH2) running in phase
        const tClock = (x / w) * 12 * Math.PI;
        // Simple logic level high/low transitioning rapidly
        const logicLevel = Math.sin(tClock - phase * 1.8) > 0 ? 0.25 : -0.25;
        const y = (h * 0.8) + logicLevel * (h * 0.12);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          // Sharp edges (digital simulation)
          const prevClock = ( (x - 1) / w) * 12 * Math.PI;
          const prevLevel = Math.sin(prevClock - phase * 1.8) > 0 ? 0.25 : -0.25;
          if (logicLevel !== prevLevel) {
            ctx.lineTo(x, (h * 0.8) + prevLevel * (h * 0.12));
          }
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Reset shadows for crisp text rendering
      ctx.shadowBlur = 0;

      // --- CRT Dashboard Hud Overlay ---
      ctx.fillStyle = "rgba(0, 242, 255, 0.4)";
      ctx.font = "9px monospace";
      
      // Top Left Readouts
      ctx.fillText(`CH1: [ANLG] ${waveType.toUpperCase()}`, 12, 18);
      ctx.fillStyle = "rgba(255, 87, 34, 0.6)";
      ctx.fillText(`CH2: [DGTL] SYS_CLK`, 12, 30);
      
      // Top Right Readouts
      ctx.fillStyle = "rgba(0, 242, 255, 0.4)";
      const sweepRate = waveType === "noise" ? "10us" : "50us";
      ctx.fillText(`SWEEP: ${sweepRate}/DIV`, w - 110, 18);
      ctx.fillText("TRIG: AUTO [CH1]", w - 110, 30);

      // Bottom Status Indicator
      ctx.fillText("STATUS: ACQUIRING", 12, h - 12);
      ctx.fillText("CLICK SCREEN TO TOGGLE SOURCE", w - 180, h - 12);

      // --- Hover Measurement Cursors ---
      if (isHovered && hoverPos.x >= 0 && hoverPos.y >= 0) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 3]);

        // Vertical tracker
        ctx.beginPath();
        ctx.moveTo(hoverPos.x, 0);
        ctx.lineTo(hoverPos.x, h);
        ctx.stroke();

        // Horizontal tracker
        ctx.beginPath();
        ctx.moveTo(0, hoverPos.y);
        ctx.lineTo(w, hoverPos.y);
        ctx.stroke();

        ctx.setLineDash([]); // Reset dashed

        // Calculate physical representation values
        const deltaT = ((hoverPos.x / w) * 200).toFixed(1); // represented in microseconds
        const deltaV = (((h / 2 - hoverPos.y) / (h / 2)) * 3.3).toFixed(2); // represented in volts

        // Cursor coordinates tag background
        ctx.fillStyle = "rgba(10, 10, 10, 0.85)";
        ctx.strokeStyle = "rgba(0, 242, 255, 0.3)";
        ctx.lineWidth = 1;
        
        const tagW = 75;
        const tagH = 34;
        let tagX = hoverPos.x + 8;
        let tagY = hoverPos.y - 42;

        // Keep tag in screen boundary
        if (tagX + tagW > w) tagX = hoverPos.x - tagW - 8;
        if (tagY < 5) tagY = hoverPos.y + 8;

        ctx.beginPath();
        ctx.roundRect(tagX, tagY, tagW, tagH, 4);
        ctx.fill();
        ctx.stroke();

        // Coordinates tag text
        ctx.fillStyle = "#ffffff";
        ctx.font = "9.5px monospace";
        ctx.fillText(`ΔT: ${deltaT} us`, tagX + 6, tagY + 14);
        ctx.fillText(`ΔV: ${deltaV} V`, tagX + 6, tagY + 26);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [waveType, hoverPos, isHovered]);

  return (
    <div
      ref={containerRef}
      className="w-full h-64 md:h-full min-h-[220px] max-h-[300px] relative overflow-hidden group select-none rounded-xl border border-white/5 cursor-crosshair bg-[#050505]"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoverPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={toggleWave}
      title="Click to change waveform shape"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
