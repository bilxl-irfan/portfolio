"use client";
import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  pulseOffset: number;
}

interface Trace {
  points: { x: number; y: number }[];
  packetPos: number;
  speed: number;
  active: boolean;
}

interface Packet {
  traceIndex: number;
  pos: number;
  speed: number;
}

export default function Experience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let mouseX = -999;
    let mouseY = -999;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Muted single color — no cyan, no orange clash
    const TRACE_COLOR = "rgba(255, 255, 255, 0.06)";
    const TRACE_HOT   = "rgba(255, 255, 255, 0.18)";
    const NODE_COLOR  = "rgba(255, 255, 255, 0.12)";
    const NODE_HOT    = "rgba(255, 255, 255, 0.5)";
    const PACKET_COLOR = "rgba(255, 255, 255, 0.7)";

    const COLS = 12;
    const ROWS = 8;
    const nodes: Node[] = [];

    const buildNodes = () => {
      nodes.length = 0;
      const colW = canvas.width / (COLS + 1);
      const rowH = canvas.height / (ROWS + 1);
      for (let r = 1; r <= ROWS; r++) {
        for (let c = 1; c <= COLS; c++) {
          const jx = (Math.random() - 0.5) * colW * 0.5;
          const jy = (Math.random() - 0.5) * rowH * 0.5;
          nodes.push({
            x: c * colW + jx,
            y: r * rowH + jy,
            pulseOffset: Math.random() * Math.PI * 2,
          });
        }
      }
    };
    buildNodes();

    const buildTraces = (): Trace[] => {
      const traces: Trace[] = [];
      const used = new Set<string>();

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const sorted = nodes
          .map((b, j) => ({ b, j, d: Math.hypot(b.x - a.x, b.y - a.y) }))
          .filter(({ j }) => j !== i)
          .sort((x, y) => x.d - y.d)
          .slice(0, 1 + Math.floor(Math.random() * 2)); // fewer connections = cleaner

        sorted.forEach(({ b, j }) => {
          const key = [i, j].sort().join("-");
          if (used.has(key)) return;
          used.add(key);

          // Manhattan routing — right angle only
          const mid = Math.random() > 0.5
            ? { x: b.x, y: a.y }
            : { x: a.x, y: b.y };

          traces.push({
            points: [{ x: a.x, y: a.y }, mid, { x: b.x, y: b.y }],
            packetPos: Math.random(),
            speed: 0.002 + Math.random() * 0.003,
            active: Math.random() > 0.25,
          });
        });
      }
      return traces;
    };

    const traces = buildTraces();
    const packets: Packet[] = [];

    const spawnInterval = setInterval(() => {
      const t = traces[Math.floor(Math.random() * traces.length)];
      if (!t?.active) return;
      packets.push({
        traceIndex: traces.indexOf(t),
        pos: 0,
        speed: 0.006 + Math.random() * 0.008,
      });
    }, 300);

    const getPointOnTrace = (trace: Trace, t: number) => {
      const segs = trace.points.length - 1;
      const seg = Math.min(Math.floor(t * segs), segs - 1);
      const localT = t * segs - seg;
      const a = trace.points[seg];
      const b = trace.points[seg + 1];
      return { x: a.x + (b.x - a.x) * localT, y: a.y + (b.y - a.y) * localT };
    };

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      // Draw traces
      traces.forEach((trace) => {
        if (!trace.active) return;
        const mid = getPointOnTrace(trace, 0.5);
        const dist = Math.hypot(mid.x - mouseX, mid.y - mouseY);
        const hot = dist < 120;

        ctx.beginPath();
        ctx.moveTo(trace.points[0].x, trace.points[0].y);
        trace.points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = hot ? TRACE_HOT : TRACE_COLOR;
        ctx.lineWidth = hot ? 1 : 0.6;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      });

      // Draw nodes (vias)
      nodes.forEach((node) => {
        const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
        const pulse = 0.5 + 0.5 * Math.sin(time * 1.2 + node.pulseOffset);
        const hot = dist < 90;
        const r = hot ? 3 + pulse : 1.2 + pulse * 0.5;

        // Outer ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 2, 0, Math.PI * 2);
        ctx.strokeStyle = hot ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)";
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Center dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = hot ? NODE_HOT : NODE_COLOR;
        ctx.fill();
      });

      // Draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.pos += p.speed;
        if (p.pos >= 1) { packets.splice(i, 1); continue; }

        const trace = traces[p.traceIndex];
        if (!trace) { packets.splice(i, 1); continue; }

        // Trail
        for (let s = 5; s >= 0; s--) {
          const trailPos = Math.max(0, p.pos - s * 0.012);
          const pt = getPointOnTrace(trace, trailPos);
          const alpha = ((5 - s) / 5) * 0.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, Math.max(0.3, 2 - s * 0.2), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fill();
        }

        // Head
        const pt = getPointOnTrace(trace, p.pos);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = PACKET_COLOR;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener("mousemove", (e) => { mouseX = e.clientX; mouseY = e.clientY; });

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(spawnInterval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
