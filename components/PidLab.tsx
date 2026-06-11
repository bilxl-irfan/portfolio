"use client";
import { useEffect, useRef, useState } from "react";
import { Wind, Play, RotateCcw, Sliders } from "lucide-react";

type PresetType = "perfect" | "under" | "over" | "unstable";

export default function PidLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // PID Gains State
  const [kp, setKp] = useState(3.5);
  const [ki, setKi] = useState(0.5);
  const [kd, setKd] = useState(2.0);

  // Simulation State
  const [isRunning, setIsRunning] = useState(true);
  const [activePreset, setActivePreset] = useState<PresetType>("perfect");

  // Metrics
  const [overshoot, setOvershoot] = useState<string>("0.0");
  const [settlingTime, setSettlingTime] = useState<string>("0.0");
  const [steadyStateError, setSteadyStateError] = useState<string>("0.00");

  // Presets configuration
  const presets = {
    perfect: { kp: 3.5, ki: 0.5, kd: 2.0 },
    under: { kp: 6.0, ki: 0.0, kd: 0.2 },
    over: { kp: 1.0, ki: 0.05, kd: 4.0 },
    unstable: { kp: 9.0, ki: 0.0, kd: 0.0 },
  };

  const applyPreset = (type: PresetType) => {
    setActivePreset(type);
    setKp(presets[type].kp);
    setKi(presets[type].ki);
    setKd(presets[type].kd);
  };

  // Keep a ref of state values for the 60fps requestAnimationFrame loop
  const pidRef = useRef({ kp, ki, kd, isRunning });
  useEffect(() => {
    pidRef.current = { kp, ki, kd, isRunning };
  }, [kp, ki, kd, isRunning]);

  // Wind Disturbance Ref
  const windTriggerRef = useRef(false);
  const triggerWind = () => {
    windTriggerRef.current = true;
  };

  // Reset Trigger Ref
  const resetTriggerRef = useRef(false);
  const resetSimulation = () => {
    resetTriggerRef.current = true;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    // Simulation variables
    let y = 140; // Drone height (y coordinates, screen range 0 to 180)
    const targetY = 70; // Setpoint height (closer to top screen)
    
    let vel = 0;
    let accel = 0;
    
    // PID accumulators
    let errorSum = 0;
    let lastError = 0;

    // History for plotting (time series)
    const history: number[] = Array(150).fill(140);
    let timeStep = 0;

    // Metric accumulators
    let maxOvershootHeight = 0;
    let stepsInTargetRange = 0;
    let settlingStepIndex = -1;

    const tick = () => {
      const { kp: KP, ki: KI, kd: KD, isRunning: RUN } = pidRef.current;
      const w = canvas.width;
      const h = canvas.height;
      
      const splitY = 160; // Coordinate separating animation and plot

      // Handle Reset trigger
      if (resetTriggerRef.current) {
        y = 140;
        vel = 0;
        accel = 0;
        errorSum = 0;
        lastError = 0;
        history.fill(140);
        timeStep = 0;
        maxOvershootHeight = 0;
        stepsInTargetRange = 0;
        settlingStepIndex = -1;
        resetTriggerRef.current = false;
        setOvershoot("0.0");
        setSettlingTime("---");
        setSteadyStateError("0.00");
      }

      // Physics loop (only runs when active)
      if (RUN) {
        // Handle Wind disturbance (thrust displacement downwards)
        if (windTriggerRef.current) {
          y += 55;
          if (y > splitY - 15) y = splitY - 15; // cap at ground
          windTriggerRef.current = false;
          maxOvershootHeight = 0; // reset overshoot tracking to catch new overshoot
          settlingStepIndex = -1;
          stepsInTargetRange = 0;
        }

        // PID Math
        // Note: Canvas coordinates are inverted (y = 0 is top).
        // Therefore, error = target - current is equivalent to current_y - target_y!
        const error = y - targetY;
        errorSum += error * 0.016;
        
        // Anti-windup (clamp integral)
        const maxInt = 200;
        if (errorSum > maxInt) errorSum = maxInt;
        if (errorSum < -maxInt) errorSum = -maxInt;

        const dError = (error - lastError) / 0.016;
        lastError = error;

        // Control output (calculating virtual motor lift thrust)
        const controlOutput = KP * error + KI * errorSum + KD * dError;

        // Quadcopter vertical acceleration:
        // Gravity pulls down (+y), Lift thrust pushes up (-y), Damping opposes motion
        const gravity = 4.2;
        const damping = 1.8;
        accel = gravity - controlOutput * 0.08 - damping * vel;

        vel += accel * 0.016;
        y += vel;

        // Hard collision limits (ceiling and floor separating graph)
        if (y < 15) {
          y = 15;
          vel = 0;
        }
        if (y > splitY - 15) {
          y = splitY - 15;
          vel = 0;
        }

        // --- Calculate metrics in real-time ---
        // Overshoot calculation (height higher than target on canvas is smaller y value)
        if (y < targetY) {
          const delta = targetY - y;
          if (delta > maxOvershootHeight) {
            maxOvershootHeight = delta;
          }
        }
        const pctOvershoot = ((maxOvershootHeight / (140 - targetY)) * 100).toFixed(1);
        setOvershoot(pctOvershoot);

        // Steady-state error
        const sse = Math.abs((y - targetY) * 0.05).toFixed(2); // scaled representation
        setSteadyStateError(sse);

        // Settling time within +/-3% threshold of height delta
        const threshold = (140 - targetY) * 0.04;
        const inRange = Math.abs(y - targetY) < threshold;

        if (inRange) {
          stepsInTargetRange++;
          // Must stay in target range for 60 consecutive frames (1 second) to be settled
          if (stepsInTargetRange > 60 && settlingStepIndex === -1) {
            settlingStepIndex = timeStep - 60;
          }
        } else {
          stepsInTargetRange = 0;
          settlingStepIndex = -1;
        }

        const secSettled = settlingStepIndex !== -1 ? (settlingStepIndex * 0.016).toFixed(1) + "s" : "ACQUIRING...";
        setSettlingTime(secSettled);

        // Update history array
        history.shift();
        history.push(y);
        timeStep++;
      }

      // --- RENDERING CANVAS ---
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#070707";
      ctx.fillRect(0, 0, w, h);

      // 1. ANIMATION SCREEN PART (Upper half)
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, w, splitY);
      
      // Horizontal reference lines (Setpoint/Target)
      ctx.strokeStyle = "rgba(0, 242, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, targetY);
      ctx.lineTo(w, targetY);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Target Label
      ctx.fillStyle = "#00f2ff";
      ctx.font = "8.5px monospace";
      ctx.fillText("SETPOINT TARGET (70m)", w - 110, targetY - 6);

      // Render Drone Body (simplified vector graphics)
      const droneX = w / 2;
      ctx.save();
      ctx.translate(droneX, y);

      // Thruster particles (animated glowing fires)
      if (RUN) {
        ctx.fillStyle = Math.random() > 0.4 ? "#ff5722" : "#ffcc00";
        const thrusterPower = Math.min(25, Math.max(3, 10 - vel * 2));
        
        // Left thruster flame
        ctx.beginPath();
        ctx.ellipse(-24, 6, 4, thrusterPower, 0, 0, Math.PI * 2);
        ctx.fill();

        // Right thruster flame
        ctx.beginPath();
        ctx.ellipse(24, 6, 4, thrusterPower, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Chassis Frame
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-24, 0);
      ctx.lineTo(24, 0);
      ctx.stroke();

      // Core pod
      ctx.fillStyle = "#111111";
      ctx.strokeStyle = "#00f2ff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -2, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Left prop bracket
      ctx.fillStyle = "#333333";
      ctx.fillRect(-26, -5, 4, 10);
      ctx.fillStyle = "#888888";
      ctx.fillRect(-32, -6, 16, 2); // left wing propeller

      // Right prop bracket
      ctx.fillStyle = "#333333";
      ctx.fillRect(22, -5, 4, 10);
      ctx.fillStyle = "#888888";
      ctx.fillRect(16, -6, 16, 2); // right wing propeller

      ctx.restore();

      // Divider Line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, splitY);
      ctx.lineTo(w, splitY);
      ctx.stroke();

      // 2. CHART GRAPH PLOT PART (Lower half)
      const graphH = h - splitY;
      ctx.fillStyle = "#070707";
      ctx.fillRect(0, splitY, w, graphH);

      // Graph grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 6; i++) {
        const xPos = (w / 6) * i;
        ctx.beginPath();
        ctx.moveTo(xPos, splitY);
        ctx.lineTo(xPos, h);
        ctx.stroke();
      }

      // Plot Setpoint Target in graph
      const chartTargetY = splitY + (targetY / splitY) * (graphH - 20) + 10;
      ctx.strokeStyle = "rgba(0, 242, 255, 0.25)";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, chartTargetY);
      ctx.lineTo(w, chartTargetY);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Plot Height Curve
      ctx.strokeStyle = "#00f2ff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      history.forEach((histY, idx) => {
        // Map history y-coordinate (0-160) to graph coordinate range
        const pct = (histY / splitY);
        const plotX = (w / (history.length - 1)) * idx;
        const plotY = splitY + pct * (graphH - 20) + 10;
        
        if (idx === 0) {
          ctx.moveTo(plotX, plotY);
        } else {
          ctx.lineTo(plotX, plotY);
        }
      });
      ctx.stroke();

      // Text status overlay on graph
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.font = "8px monospace";
      ctx.fillText("STEP RESPONSE GRAPH [H(t) vs TIME]", 12, splitY + 16);

      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section id="pid-lab" className="bg-[#080808] py-24 px-6 md:px-16 border-b border-white/10 relative overflow-hidden">
      <div className="mb-16">
        <p className="text-xs font-mono text-white/30 tracking-[0.3em] mb-3">{"// SYSTEM_TUNING_LAB"}</p>
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase">
          Control<br/><span className="italic text-white/20">Systems</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left column: Controllers and Presets */}
        <div className="lg:col-span-5 space-y-8 font-mono">
          <div className="p-6 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-6 text-[#00f2ff]">
              <Sliders size={16} />
              <h3 className="text-sm font-black uppercase tracking-widest text-white">PID Parameter Tuning</h3>
            </div>

            {/* Presets List */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {(["perfect", "under", "over", "unstable"] as PresetType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => applyPreset(type)}
                  className={`py-2 text-[10px] uppercase font-bold tracking-wider border rounded-lg transition-all ${
                    activePreset === type
                      ? "border-[#00f2ff] text-[#00f2ff] bg-[#00f2ff]/5"
                      : "border-white/10 text-white/40 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {type === "perfect" ? "PERFECT_TUNING" : type + "_DAMPED"}
                </button>
              ))}
            </div>

            {/* Gain Sliders */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">Proportional Gain (Kp)</span>
                  <span className="text-[#00f2ff] font-bold">{kp.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={kp}
                  onChange={(e) => {
                    setKp(parseFloat(e.target.value));
                    setActivePreset("perfect"); // customized
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f2ff]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">Integral Gain (Ki)</span>
                  <span className="text-[#00f2ff] font-bold">{ki.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.01"
                  value={ki}
                  onChange={(e) => {
                    setKi(parseFloat(e.target.value));
                    setActivePreset("perfect");
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f2ff]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">Derivative Gain (Kd)</span>
                  <span className="text-[#00f2ff] font-bold">{kd.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={kd}
                  onChange={(e) => {
                    setKd(parseFloat(e.target.value));
                    setActivePreset("perfect");
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f2ff]"
                />
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl border text-xs uppercase font-bold tracking-widest transition-all cursor-pointer ${
                  isRunning
                    ? "border-[#ff5722] text-[#ff5722] hover:bg-[#ff5722]/5"
                    : "border-[#00f2ff] text-[#00f2ff] hover:bg-[#00f2ff]/5"
                }`}
              >
                {isRunning ? (
                  <>
                    <RotateCcw size={12} /> PAUSE_ENGINE
                  </>
                ) : (
                  <>
                    <Play size={12} /> RUN_ENGINE
                  </>
                )}
              </button>
              <button
                onClick={resetSimulation}
                className="flex-1 flex justify-center items-center gap-2 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-xs uppercase font-bold tracking-widest transition-all cursor-pointer"
              >
                <RotateCcw size={12} />
                RESET_SIM
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Sandbox Canvas */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative group border border-white/10 rounded-2xl overflow-hidden bg-black/60 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            {/* Wind disturbance button inside canvas */}
            <button
              onClick={triggerWind}
              disabled={!isRunning}
              className={`absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 border rounded-xl text-[10px] font-mono tracking-wider uppercase transition-all cursor-pointer ${
                isRunning
                  ? "border-[#ff5722]/40 text-[#ff5722] hover:bg-[#ff5722]/5 bg-black/80"
                  : "border-white/5 text-white/20 pointer-events-none"
              }`}
            >
              <Wind size={10} />
              Inject Wind Gust
            </button>

            {/* Interactive Canvas */}
            <canvas
              ref={canvasRef}
              width={500}
              height={300}
              className="block w-full h-[320px]"
            />
          </div>

          {/* Real-time Response Metrics Grid */}
          <div className="grid grid-cols-3 gap-px bg-white/10 font-mono rounded-xl overflow-hidden border border-white/10">
            <div className="bg-[#080808]/60 p-4 text-center">
              <span className="text-[9px] text-white/30 block tracking-widest mb-1">OVERSHOOT:</span>
              <span className={`text-lg font-black ${parseFloat(overshoot) > 15 ? "text-[#ff5722]" : "text-[#00f2ff]"}`}>
                {overshoot}%
              </span>
            </div>
            <div className="bg-[#080808]/60 p-4 text-center">
              <span className="text-[9px] text-white/30 block tracking-widest mb-1">SETTLING_TIME:</span>
              <span className="text-lg font-black text-white">
                {settlingTime}
              </span>
            </div>
            <div className="bg-[#080808]/60 p-4 text-center">
              <span className="text-[9px] text-white/30 block tracking-widest mb-1">SSE (STEADY_ERROR):</span>
              <span className={`text-lg font-black ${parseFloat(steadyStateError) > 0.05 ? "text-[#ff5722]" : "text-[#22c55e]"}`}>
                {steadyStateError}V
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
