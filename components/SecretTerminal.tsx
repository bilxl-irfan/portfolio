"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal as TermIcon, Gamepad2, Sliders } from "lucide-react";
import PidLab from "./PidLab";

// Web Audio API Sound Synthesizer
const playSynthSound = (freq: number, duration: number, type: OscillatorType = "sine", vol = 0.015) => {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Fail silently if audio context is blocked
  }
};

const playClick = () => playSynthSound(Math.random() * 100 + 450, 0.03, "triangle", 0.02);
const playBuzzer = () => playSynthSound(120, 0.35, "sawtooth", 0.03);
const playScoreSound = () => playSynthSound(880, 0.08, "sine", 0.02);
const playBounceSound = () => playSynthSound(440, 0.06, "sine", 0.015);

const safeEval = (exprStr: string, aVal: number, bVal: number): number => {
  const clean = exprStr
    .toLowerCase()
    .replace(/and/g, "&&")
    .replace(/or/g, "||")
    .replace(/not/g, "!")
    .replace(/xor/g, "!==")
    .replace(/a/g, aVal ? "1" : "0")
    .replace(/b/g, bVal ? "1" : "0");
  
  // Strip all characters except digits, spaces, parentheses, and boolean operators
  const allowedChars = /^[01\s&|!=()]+$/;
  if (!allowedChars.test(clean)) {
    return -1;
  }
  
  try {
    const func = new Function(`return (${clean})`);
    return func() ? 1 : 0;
  } catch {
    return -1;
  }
};

export default function SecretTerminal() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"terminal" | "arcade" | "pid">("terminal");
  const [terminalInput, setTerminalInput] = useState("");
  const [logs, setLogs] = useState<string[]>([
    "SYSTEM SECURITY TERMINAL V2.0 // DECRYPTOR ACTIVE",
    "GUEST ACCESS LEVEL: ACQUIRED.",
    "--------------------------------------------------",
    "PRESS ` (BACKTICK) OR CTRL+SHIFT+D TO TOGGLE CONSOLE.",
    "TYPE 'help' FOR LIST OF SYSTEM COMMANDS.",
    "--------------------------------------------------",
  ]);

  const [activeGame, setActiveGame] = useState<"none" | "snake" | "brick">("none");
  const [showMatrix, setShowMatrix] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    // Print hint to developer console
    console.log(
      "%c[SYSTEM]%c Press ` (backtick) or Ctrl+Shift+D to open the Secret Cyber Console & Games menu!",
      "color: #00f2ff; font-weight: bold; font-family: monospace;",
      "color: #ffffff; font-family: monospace;"
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      const isBacktick = e.key === "`";
      const isCtrlShiftD = e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d";

      if (isBacktick || isCtrlShiftD) {
        e.preventDefault();
        setOpen((v) => {
          const next = !v;
          if (next) {
            playSynthSound(600, 0.1, "sine");
            setTimeout(() => playSynthSound(900, 0.15, "sine"), 100);
          } else {
            playSynthSound(400, 0.1, "sine");
          }
          return next;
        });
      }

      if (e.key === "Escape" && open) {
        setOpen(false);
        playSynthSound(400, 0.1, "sine");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Autoscroll CLI logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Focus input on console open or click
  useEffect(() => {
    if (open && tab === "terminal") {
      inputRef.current?.focus();
    }
  }, [open, tab]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const rawInput = terminalInput.trim();
    if (!rawInput) return;

    const args = rawInput.split(/\s+/);
    const command = args[0].toLowerCase();
    const restExpr = args.slice(1).join(" ");

    playSynthSound(700, 0.05, "sine");
    setLogs((prev) => [...prev, `guest@bilal-system:~$ ${rawInput}`]);
    setTerminalInput("");

    switch (command) {
      case "help":
        setLogs((prev) => [
          ...prev,
          "AVAILABLE SECURE CHANNELS:",
          "  sysinfo   - Get Bilal's core engineering profile",
          "  decrypt   - Decrypt academic achievements matrix",
          "  matrix    - Toggle full-screen matrix digital rain",
          "  vhdl      - Simulates VHDL timing waveforms on custom logic",
          "  pid       - Open the quadcopter PID simulation lab",
          "  clear     - Wipe console history logs",
          "  play      - Navigate to Retro Arcade Games Room",
          "  exit      - Close the security terminal console",
        ]);
        break;

      case "pid":
      case "lab":
        setTab("pid");
        setLogs((prev) => [...prev, "REDIRECTING TO PID CONTROLLER LAB..."]);
        break;

      case "vhdl":
      case "logic":
        if (!restExpr) {
          setLogs((prev) => [
            ...prev,
            "Usage: vhdl <expression>",
            "Simulates a VHDL logic analyzer for inputs A (fast clock) and B (slow clock).",
            "Supported operators: AND, OR, NOT, XOR",
            "Examples:",
            "  vhdl A AND B",
            "  vhdl A XOR B",
            "  vhdl NOT A OR B",
          ]);
        } else {
          const signalA = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
          const signalB = [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0];
          const signalY: number[] = [];
          
          let hasError = false;
          for (let i = 0; i < 16; i++) {
            const val = safeEval(restExpr, signalA[i], signalB[i]);
            if (val === -1) {
              hasError = true;
              break;
            }
            signalY.push(val);
          }

          if (hasError) {
            playBuzzer();
            setLogs((prev) => [
              ...prev,
              `ERROR: FAILED TO PARSE EXPRESSION '${restExpr}'.`,
              "Ensure you only use inputs A, B and operators: AND, OR, NOT, XOR.",
            ]);
          } else {
            const drawWave = (sig: number[]) => sig.map((v) => (v === 1 ? "██" : "__")).join("");
            
            setLogs((prev) => [
              ...prev,
              `VHDL LOGIC SIMULATION REPORT [EXPR: ${restExpr.toUpperCase()}]`,
              "--------------------------------------------------",
              `  A CLK : ${drawWave(signalA)}`,
              `  B CLK : ${drawWave(signalB)}`,
              "--------------------------------------------------",
              `  Y OUT : ${drawWave(signalY)}`,
              "--------------------------------------------------",
            ]);
            playSynthSound(900, 0.15, "sine");
          }
        }
        break;

      case "clear":
        setLogs([]);
        break;

      case "exit":
        setOpen(false);
        break;

      case "play":
        setTab("arcade");
        setLogs((prev) => [...prev, "REDIRECTING TO ARCADE MODULE..."]);
        break;

      case "sysinfo":
        setLogs((prev) => [
          ...prev,
          "==================================================",
          "USER ACCOUNT: BILAL IRFAN // CLASS_I_ENGINEER",
          "STATUS: TRANSITIONING SYSTEMS",
          "--------------------------------------------------",
          "BASE STATION: TORONTO, CA",
          "ACADEMICS:",
          "  - BACHELORS: COMPUTER ENGINEERING [TMU_GRAD_2026]",
          "  - GRADUATE: M.Eng INCOMING [UW_WATERLOO_SEPT_2026]",
          "EXPERIENCE:",
          "  - INTERN: EMBEDDED SYSTEMS @ MOSTAVIO",
          "CORE FIELDS: AR HUD COMPILERS, EDGE AI, VHDL CORES",
          "==================================================",
        ]);
        break;

      case "decrypt":
        setLogs((prev) => [...prev, "DECRYPTING ACADEMIC RECORDS...", "INITIALIZING QUANTUM SOLVER..."]);
        let decStr = "";
        let count = 0;
        const interval = setInterval(() => {
          decStr = Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join("");
          setLogs((prev) => [
            ...prev,
            `  CRACKING: [0x${decStr}] ${count * 10}% DECRYPTED`,
          ]);
          playClick();
          count++;
          if (count > 10) {
            clearInterval(interval);
            setLogs((prev) => [
              ...prev,
              "DECRYPTION COMPLETED SUCCESSFULLY.",
              "--------------------------------------------------",
              "STATUS: GRADUATED WITH HONOURS - TORONTO METROPOLITAN UNIVERSITY",
              "DESTINATION: GRADUATE STUDIES ADMISSION - UNIVERSITY OF WATERLOO",
              "SYSTEM: INCOMING SEPTEMBER 2026",
              "--------------------------------------------------",
            ]);
            playSynthSound(1000, 0.2, "sine");
          }
        }, 150);
        break;

      case "matrix":
        setShowMatrix((v) => !v);
        setLogs((prev) => [...prev, `MATRIX RAIN EFFECT: ${!showMatrix ? "ENABLED" : "DISABLED"}`]);
        break;

      default:
        playBuzzer();
        setLogs((prev) => [...prev, `ERROR: COMMAND '${command}' NOT RECOGNIZED. TYPE 'help' FOR UTILITIES.`]);
        break;
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="retro-terminal fixed inset-0 z-[10000] bg-[#050505]/95 backdrop-blur-lg flex items-center justify-center p-4 md:p-6"
          >
            {/* Matrix Digital Rain Background Overlay */}
            {showMatrix && <MatrixRain />}

            {/* CRT Glass Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-[10005] opacity-25 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,242,255,0.06),rgba(255,87,34,0.02),rgba(0,242,255,0.06))] bg-[length:100%_4px,3px_100%]" />

            {/* Terminal Chassis */}
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="w-full max-w-4xl h-[85vh] bg-[#0b0b0b]/90 border border-[#00f2ff]/20 rounded-2xl flex flex-col overflow-hidden relative shadow-[0_0_50px_rgba(0,242,255,0.15)] z-[10002]"
              onClick={() => {
                if (tab === "terminal") inputRef.current?.focus();
              }}
            >
              {/* Header Titlebar */}
              <div className="flex justify-between items-center px-4 py-3 bg-black/40 border-b border-white/5 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5722] animate-pulse" />
                  <span className="text-white/40 tracking-wider">SYSTEM_SHELL_DECRYPTOR_v2.0</span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setTab("terminal");
                      playClick();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 border transition-colors ${
                      tab === "terminal"
                        ? "border-[#00f2ff]/40 text-[#00f2ff] bg-[#00f2ff]/5"
                        : "border-transparent text-white/40 hover:text-white"
                    }`}
                  >
                    <TermIcon size={12} />
                    SHELL
                  </button>
                  <button
                    onClick={() => {
                      setTab("arcade");
                      playClick();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 border transition-colors ${
                      tab === "arcade"
                        ? "border-[#00f2ff]/40 text-[#00f2ff] bg-[#00f2ff]/5"
                        : "border-transparent text-white/40 hover:text-white"
                    }`}
                  >
                    <Gamepad2 size={12} />
                    ARCADE
                  </button>
                  <button
                    onClick={() => {
                      setTab("pid");
                      playClick();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 border transition-colors ${
                      tab === "pid"
                        ? "border-[#00f2ff]/40 text-[#00f2ff] bg-[#00f2ff]/5"
                        : "border-transparent text-white/40 hover:text-white"
                    }`}
                  >
                    <Sliders size={12} />
                    PID LAB
                  </button>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    playSynthSound(400, 0.1, "sine");
                  }}
                  className="text-white/40 hover:text-[#ff5722] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-hidden relative flex flex-col">
                {tab === "terminal" ? (
                  // SHELL COMMAND TAB
                  <div className="flex-1 flex flex-col p-4 font-mono text-sm overflow-y-auto">
                    <div className="flex-1 space-y-1.5 text-white/80">
                      {logs.map((log, idx) => (
                        <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                          {log}
                        </div>
                      ))}
                      <div ref={logsEndRef} />
                    </div>

                    {/* CLI Command Line Input */}
                    <form onSubmit={handleCommand} className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                      <span className="text-[#00f2ff] font-bold">guest@bilal-system:~$</span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={terminalInput}
                        onChange={(e) => {
                          setTerminalInput(e.target.value);
                          playClick();
                        }}
                        className="flex-1 bg-transparent border-none outline-none text-[#00f2ff] caret-cyan font-mono text-sm focus:ring-0"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                      />
                    </form>
                  </div>
                ) : tab === "arcade" ? (
                  // ARCADE GAMES TAB
                  <div className="flex-1 p-4 flex flex-col md:flex-row gap-6 overflow-y-auto">
                    {activeGame === "none" ? (
                      // Games Menu
                      <div className="flex-1 flex flex-col justify-center items-center max-w-md mx-auto text-center font-mono">
                        <Gamepad2 className="text-[#00f2ff] mb-4 animate-bounce" size={48} />
                        <h3 className="text-xl font-black text-white tracking-widest uppercase mb-2">ARCADE MODULE</h3>
                        <p className="text-xs text-white/40 mb-8 tracking-wider">SELECT CYBERNETIC PROTOCOL TO BEGIN INTERACTION</p>
                        
                        <div className="w-full flex flex-col gap-4">
                          <button
                            onClick={() => {
                              setActiveGame("snake");
                              playSynthSound(600, 0.2, "sine");
                            }}
                            className="w-full py-4 border border-white/10 hover:border-[#00f2ff] hover:bg-[#00f2ff]/5 text-left px-6 rounded-xl transition-all group relative overflow-hidden"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-xs text-[#00f2ff] block mb-1">{"// PROTOCOL_01"}</span>
                                <h4 className="text-lg font-black text-white group-hover:text-[#00f2ff] transition-colors">HACKER_TRON (SNAKE)</h4>
                                <p className="text-[10px] text-white/40 mt-1 uppercase">COLLECT SYSTEM FILES. DO NOT COLLIDE WITH THE TRON TRACE.</p>
                              </div>
                              <div className="text-[#00f2ff] font-bold">PLAY →</div>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setActiveGame("brick");
                              playSynthSound(600, 0.2, "sine");
                            }}
                            className="w-full py-4 border border-white/10 hover:border-[#ff5722] hover:bg-[#ff5722]/5 text-left px-6 rounded-xl transition-all group relative overflow-hidden"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-xs text-[#ff5722] block mb-1">{"// PROTOCOL_02"}</span>
                                <h4 className="text-lg font-black text-white group-hover:text-[#ff5722] transition-colors">FIREWALL_BREAKER</h4>
                                <p className="text-[10px] text-white/40 mt-1 uppercase">SHATTER NETWORK FIREWALL BLOCKS WITH DATA PACKETS.</p>
                              </div>
                              <div className="text-[#ff5722] font-bold">PLAY →</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    ) : activeGame === "snake" ? (
                      // Render Snake Game
                      <SnakeGame backToMenu={() => setActiveGame("none")} />
                    ) : (
                      // Render Brick Breaker Game
                      <BrickBreakerGame backToMenu={() => setActiveGame("none")} />
                    )}
                  </div>
                ) : (
                  // PID LAB TAB
                  <div className="flex-1 p-4 overflow-y-auto">
                    <PidLab />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// MATRIX RAIN COMPONENT
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cols = Math.floor(canvas.width / 15) + 1;
    const ypos = Array(cols).fill(0);

    const draw = () => {
      ctx.fillStyle = "rgba(5, 5, 5, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00f2ff"; // cyan code rain instead of green to match accent!
      ctx.font = "12px monospace";

      ypos.forEach((y, ind) => {
        const char = String.fromCharCode(Math.floor(Math.random() * 128));
        const x = ind * 15;
        ctx.fillText(char, x, y);
        if (y > 100 + Math.random() * 10000) {
          ypos[ind] = 0;
        } else {
          ypos[ind] = y + 15;
        }
      });
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-[10001]" />;
}

// SNAKE RETRO GAME
function SnakeGame({ backToMenu }: { backToMenu: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gridSize = 16;
    const tileCountX = canvas.width / gridSize;
    const tileCountY = canvas.height / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let dx = 1;
    let dy = 0;
    let scoreVal = 0;
    let isGameOver = false;
    let activePause = false;

    const generateFood = () => {
      food = {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY),
      };
      // Check if food spawns inside snake
      if (snake.some((s) => s.x === food.x && s.y === food.y)) {
        generateFood();
      }
    };

    const resetGame = () => {
      snake = [{ x: 10, y: 10 }];
      dx = 1;
      dy = 0;
      scoreVal = 0;
      setScore(0);
      isGameOver = false;
      setGameOver(false);
      activePause = false;
      setIsPaused(false);
      generateFood();
    };

    resetGame();

    const gameLoop = () => {
      if (isGameOver || activePause) return;

      // Update snake position
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Wall collisions
      if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        isGameOver = true;
        setGameOver(true);
        playBuzzer();
        return;
      }

      // Self collisions
      if (snake.some((s) => s.x === head.x && s.y === head.y)) {
        isGameOver = true;
        setGameOver(true);
        playBuzzer();
        return;
      }

      // Add new head
      snake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        scoreVal += 10;
        setScore(scoreVal);
        playScoreSound();
        generateFood();
      } else {
        snake.pop(); // remove tail
      }

      // Draw game frame
      ctx.fillStyle = "#070707";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Food
      ctx.fillStyle = "#00f2ff";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00f2ff";
      ctx.fillRect(food.x * gridSize + 1, food.y * gridSize + 1, gridSize - 2, gridSize - 2);

      // Draw Snake
      ctx.fillStyle = "#22c55e";
      ctx.shadowColor = "#22c55e";
      snake.forEach((segment, idx) => {
        ctx.fillStyle = idx === 0 ? "#4ade80" : "#22c55e";
        ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
      });

      ctx.shadowBlur = 0; // reset
    };

    const handleInput = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (dy !== 1) { dx = 0; dy = -1; playClick(); }
          break;
        case "ArrowDown":
          if (dy !== -1) { dx = 0; dy = 1; playClick(); }
          break;
        case "ArrowLeft":
          if (dx !== 1) { dx = -1; dy = 0; playClick(); }
          break;
        case "ArrowRight":
          if (dx !== -1) { dx = 1; dy = 0; playClick(); }
          break;
        case " ":
          e.preventDefault();
          if (isGameOver) {
            resetGame();
          } else {
            activePause = !activePause;
            setIsPaused(activePause);
            playClick();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleInput);
    const interval = setInterval(gameLoop, 90);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleInput);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 font-mono max-w-3xl mx-auto w-full">
      {/* Game board */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          className="border-2 border-[#22c55e]/30 bg-black rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.1)]"
        />
        <div className="text-[10px] text-white/30 mt-3 text-center uppercase tracking-wider">
          USE ARROWS TO NAVIGATE // SPACEBAR TO PAUSE/REPLAY
        </div>
      </div>
      {/* Side HUD */}
      <div className="w-full md:w-48 flex flex-col justify-between border border-white/10 p-4 rounded-xl bg-black/20">
        <div>
          <span className="text-[10px] text-[#22c55e] block mb-1 tracking-widest">{"// PROTOCOL_01"}</span>
          <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">HACKER_TRON</h4>
          
          <div className="mb-4">
            <span className="text-[9px] text-white/30 block tracking-widest">SCORE:</span>
            <span className="text-2xl font-black text-white">{score}</span>
          </div>

          {gameOver && (
            <div className="p-3 border border-[#ff5722]/30 bg-[#ff5722]/5 text-[#ff5722] text-[10px] uppercase font-bold tracking-wider rounded">
              SYSTEM_CRASH // HALTED
              <div className="text-[8px] text-white/40 mt-1 font-mono">PRESS SPACEBAR TO REBOOT</div>
            </div>
          )}
          
          {isPaused && !gameOver && (
            <div className="p-3 border border-[#00f2ff]/30 bg-[#00f2ff]/5 text-[#00f2ff] text-[10px] uppercase font-bold tracking-wider rounded">
              EXECUTION_PAUSED
            </div>
          )}
        </div>

        <button
          onClick={backToMenu}
          className="w-full mt-6 py-2 border border-white/10 text-white/50 hover:text-white hover:border-white text-xs tracking-wider uppercase transition-colors"
        >
          ← EXIT PROTOCOL
        </button>
      </div>
    </div>
  );
}

// BRICK BREAKER FIREWALL GAME
function BrickBreakerGame({ backToMenu }: { backToMenu: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Game variables
    const paddleH = 8;
    const paddleW = 55;
    let paddleX = (canvas.width - paddleW) / 2;

    const ballRadius = 4;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 1.5;
    let dy = -1.5;

    // Bricks parameters
    const brickRows = 3;
    const brickCols = 5;
    const brickW = 50;
    const brickH = 10;
    const brickPadding = 6;
    const brickOffsetTop = 20;
    const brickOffsetLeft = 25;

    let bricks: { x: number; y: number; status: number }[][] = [];
    const buildBricks = () => {
      bricks = [];
      for (let c = 0; c < brickCols; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRows; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
      }
    };
    buildBricks();

    let scoreVal = 0;
    let livesVal = 3;
    let isGameOver = false;
    let isVictory = false;

    let rightPressed = false;
    let leftPressed = false;

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#ff5722";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#ff5722";
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleH - 5, paddleW, paddleH);
      ctx.fillStyle = "#00f2ff";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#00f2ff";
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawBricks = () => {
      for (let c = 0; c < brickCols; c++) {
        for (let r = 0; r < brickRows; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickW + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickH + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickW, brickH);
            
            // Choose color based on row for cool vector HUD styling
            if (r === 0) ctx.fillStyle = "#ff5722";
            else if (r === 1) ctx.fillStyle = "#a855f7";
            else ctx.fillStyle = "#22c55e";
            
            ctx.fill();
          }
        }
      }
    };

    const collisionDetection = () => {
      for (let c = 0; c < brickCols; c++) {
        for (let r = 0; r < brickRows; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (x > b.x && x < b.x + brickW && y > b.y && y < b.y + brickH) {
              dy = -dy;
              b.status = 0;
              scoreVal += 10;
              setScore(scoreVal);
              playScoreSound();
              
              // Check victory
              if (scoreVal === brickRows * brickCols * 10) {
                isVictory = true;
                setVictory(true);
                playSynthSound(700, 0.1, "sine");
                setTimeout(() => playSynthSound(1000, 0.3, "sine"), 100);
              }
            }
          }
        }
      }
    };

    const draw = () => {
      if (isGameOver || isVictory) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#070707";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      // Bounce left/right boundaries
      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        playBounceSound();
      }

      // Bounce top boundary
      if (y + dy < ballRadius) {
        dy = -dy;
        playBounceSound();
      } else if (y + dy > canvas.height - ballRadius - 5 - paddleH) {
        // Hit paddle?
        if (x > paddleX && x < paddleX + paddleW) {
          // Adjust deflection angle based on where ball hits the paddle
          const hitPos = (x - (paddleX + paddleW / 2)) / (paddleW / 2);
          dx = hitPos * 2;
          dy = -Math.abs(dy); // force moving up
          playBounceSound();
        } else if (y + dy > canvas.height - ballRadius) {
          // Drop below bottom boundary
          livesVal--;
          setLives(livesVal);
          playBuzzer();
          if (livesVal <= 0) {
            isGameOver = true;
            setGameOver(true);
          } else {
            // Reset ball position
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 1.5;
            dy = -1.5;
            paddleX = (canvas.width - paddleW) / 2;
          }
        }
      }

      // Paddle movement
      if (rightPressed && paddleX < canvas.width - paddleW) {
        paddleX += 3.5;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= 3.5;
      }

      x += dx;
      y += dy;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const interval = setInterval(draw, 14);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 font-mono max-w-3xl mx-auto w-full">
      <div className="flex-1 flex flex-col items-center justify-center">
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          className="border-2 border-[#00f2ff]/30 bg-black rounded-lg shadow-[0_0_20px_rgba(0,242,255,0.1)]"
        />
        <div className="text-[10px] text-white/30 mt-3 text-center uppercase tracking-wider">
          USE LEFT/RIGHT ARROWS TO MOVE PADDLE
        </div>
      </div>
      <div className="w-full md:w-48 flex flex-col justify-between border border-white/10 p-4 rounded-xl bg-black/20">
        <div>
          <span className="text-[10px] text-[#00f2ff] block mb-1 tracking-widest">{"// PROTOCOL_02"}</span>
          <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">FIREWALL_CRACK</h4>
          
          <div className="mb-3">
            <span className="text-[9px] text-white/30 block tracking-widest">BREAKS:</span>
            <span className="text-2xl font-black text-white">{score}</span>
          </div>

          <div className="mb-4">
            <span className="text-[9px] text-white/30 block tracking-widest">DATA PACKETS:</span>
            <span className="text-sm font-black text-[#ff5722]">
              {Array.from({ length: lives }).map(() => "◆ ").join("")}
            </span>
          </div>

          {gameOver && (
            <div className="p-3 border border-[#ff5722]/30 bg-[#ff5722]/5 text-[#ff5722] text-[10px] uppercase font-bold tracking-wider rounded">
              FIREWALL_LOCKED // BLOCKED
              <div className="text-[8px] text-white/40 mt-1 font-mono">RELOAD SYSTEM TO RETRY</div>
            </div>
          )}

          {victory && (
            <div className="p-3 border border-[#22c55e]/30 bg-[#22c55e]/5 text-[#22c55e] text-[10px] uppercase font-bold tracking-wider rounded">
              CRACKED // PORT_DECRYPTED
            </div>
          )}
        </div>

        <button
          onClick={backToMenu}
          className="w-full mt-6 py-2 border border-white/10 text-white/50 hover:text-white hover:border-white text-xs tracking-wider uppercase transition-colors"
        >
          ← EXIT PROTOCOL
        </button>
      </div>
    </div>
  );
}
