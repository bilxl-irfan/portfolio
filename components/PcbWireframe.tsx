"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Individual components on the PCB
function BoardComponents() {
  const groupRef = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Mouse parallax interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 0.6,
        y: (e.clientY / window.innerHeight - 0.5) * 0.6,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Slow rotation + mouse parallax damping
      const elapsed = state.clock.getElapsedTime();
      groupRef.current.rotation.y = elapsed * 0.12 + mouse.x;
      groupRef.current.rotation.x = Math.sin(elapsed * 0.04) * 0.1 + mouse.y;
    }
  });

  // Helper arrays to build grid elements without repeating code
  const pins = [];
  for (let i = -4; i <= 4; i++) {
    if (i === 0) continue;
    pins.push({ x: i * 0.25, z: 0.95 });
    pins.push({ x: i * 0.25, z: -0.95 });
    pins.push({ x: 0.95, z: i * 0.25 });
    pins.push({ x: -0.95, z: i * 0.25 });
  }

  // Pre-generate particles inside useState initializer to preserve render purity in React 19
  const [particles] = useState<{
    theta: number;
    radius: number;
    y: number;
    scale: number;
    color: string;
    opacity: number;
  }[]>(() => {
    return Array.from({ length: 40 }).map(() => {
      const theta = Math.random() * Math.PI * 2;
      const radius = 2.4 + Math.random() * 1.5;
      const y = (Math.random() - 0.5) * 1.6;
      const scale = 0.015 + Math.random() * 0.02;
      const color = Math.random() > 0.4 ? "#00f2ff" : "#ff5722";
      const opacity = 0.4 + Math.random() * 0.5;
      return { theta, radius, y, scale, color, opacity };
    });
  });

  // Pre-configured coordinates for capacitor blocks on the board
  const capacitors = [
    { x: -1.5, z: -1.4, color: "#00f2ff", w: 0.3, h: 0.15, d: 0.2 },
    { x: -1.1, z: -1.4, color: "#a855f7", w: 0.2, h: 0.15, d: 0.2 },
    { x: 1.4, z: 1.2, color: "#ff5722", w: 0.4, h: 0.2, d: 0.2 },
    { x: 1.4, z: 0.7, color: "#22c55e", w: 0.2, h: 0.15, d: 0.2 },
  ];

  return (
    <group ref={groupRef}>
      {/* 1. Main PCB Board Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.06, 4.2]} />
        <meshStandardMaterial
          color="#060f0c"
          roughness={0.6}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>
      
      {/* PCB Board Edge Wireframe */}
      <mesh>
        <boxGeometry args={[4.22, 0.08, 4.22]} />
        <meshBasicMaterial color="#00f2ff" wireframe opacity={0.15} transparent />
      </mesh>

      {/* 2. Central Microprocessor */}
      <group position={[0, 0.1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.14, 1.6]} />
          <meshStandardMaterial color="#121212" roughness={0.4} metalness={0.9} />
        </mesh>
        {/* Core silicon die (glowing center) */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.9, 0.02, 0.9]} />
          <meshStandardMaterial
            color="#00f2ff"
            emissive="#00f2ff"
            emissiveIntensity={1.2}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* 3. IC Silver Contact Pins */}
      {pins.map((pin, index) => (
        <mesh key={index} position={[pin.x, 0.04, pin.z]}>
          <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* 4. Transistors / Capacitors */}
      {capacitors.map((cap, idx) => (
        <mesh key={idx} position={[cap.x, 0.1, cap.z]}>
          <boxGeometry args={[cap.w, cap.h, cap.d]} />
          <meshStandardMaterial
            color={cap.color}
            emissive={cap.color}
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.5}
          />
        </mesh>
      ))}

      {/* 5. Glowing Copper Traces (conductive lines) */}
      {/* Horizontal traces */}
      <mesh position={[0, 0.035, 1.4]}>
        <boxGeometry args={[3.2, 0.01, 0.02]} />
        <meshBasicMaterial color="#00f2ff" opacity={0.4} transparent />
      </mesh>
      <mesh position={[-1.2, 0.035, -0.6]}>
        <boxGeometry args={[0.02, 0.01, 1.2]} />
        <meshBasicMaterial color="#ff5722" opacity={0.35} transparent />
      </mesh>
      <mesh position={[1.2, 0.035, -0.8]}>
        <boxGeometry args={[0.02, 0.01, 0.8]} />
        <meshBasicMaterial color="#00f2ff" opacity={0.3} transparent />
      </mesh>

      {/* 6. Surrounding Data Particles */}
      <group>
        {particles.map((p, idx) => (
          <mesh
            key={idx}
            position={[p.radius * Math.cos(p.theta), p.y, p.radius * Math.sin(p.theta)]}
          >
            <sphereGeometry args={[p.scale, 8, 8]} />
            <meshBasicMaterial
              color={p.color}
              transparent
              opacity={p.opacity}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function PcbWireframe() {
  return (
    <div className="w-full h-72 md:h-[400px] relative select-none">
      {/* Ambient background glow behind canvas */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.06)_0%,transparent_60%)] pointer-events-none" />
      
      <Canvas
        camera={{ position: [0, 3.2, 4.5], fov: 50 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <directionalLight position={[0, 5, 0]} intensity={1.2} />
        
        <BoardComponents />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
