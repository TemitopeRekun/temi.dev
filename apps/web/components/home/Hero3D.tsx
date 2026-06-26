"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { Float, Stars, Sparkles, PerspectiveCamera } from "@react-three/drei";
import { Mesh, Group, MathUtils, Color, CanvasTexture } from "three";
import { useMemo } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/** Read viewport + DPR once on the client to scale scene cost down on small,
 * low-DPR devices. Returns conservative SSR defaults. */
function useDeviceProfile() {
  const [profile, setProfile] = useState({ small: false, lowDpr: false });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const compute = () =>
      setProfile({
        small: window.innerWidth < 768,
        lowDpr: window.devicePixelRatio < 2,
      });
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return profile;
}

function createGlowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0,   "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.2)");
  gradient.addColorStop(1,   "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}
import { useTheme } from "next-themes";

type SceneContentProps = {
  scrollProgressRef: RefObject<number>;
  reduced: boolean;
  small: boolean;
};

const ROYGBIV = [
  "#FF1111", // Red
  "#FF6600", // Orange
  "#FFD700", // Yellow
  "#22CC44", // Green
  "#1166FF", // Blue
  "#4B0082", // Indigo
  "#9400D3", // Violet
];

function CustomStars({ count = 5000, rainbow = false }: { count?: number; rainbow?: boolean }) {
  const glowTexture = useMemo(() => createGlowTexture(), []);
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = rainbow
      ? ROYGBIV.map((hex) => new Color(hex))
      : [new Color("#ffffff"), new Color("#ddddff"), new Color("#aaaacc")];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 50 + Math.random() * 50;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count, rainbow]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.2}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        alphaMap={glowTexture}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingShape({
  position,
  scale = 1,
  color,
  delay = 0,
  wireframeOpacity = 0.3,
  reduced = false,
}: {
  position: [number, number, number];
  scale?: number;
  color: string;
  delay?: number;
  wireframeOpacity?: number;
  reduced?: boolean;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (reduced || !meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.2 + delay;
    meshRef.current.rotation.y = t * 0.15 + delay;
  });

  return (
    <Float
      speed={reduced ? 0 : 1.2}
      rotationIntensity={reduced ? 0 : 1}
      floatIntensity={reduced ? 0 : 2}
      floatingRange={[-0.2, 0.2]}
    >
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={wireframeOpacity} />
      </mesh>
    </Float>
  );
}

function SceneContent({ scrollProgressRef, reduced, small }: SceneContentProps) {
  const groupRef = useRef<Group | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const primaryColor = isDark ? "#C8F557" : "#F07C3A";
  const secondaryColor = isDark ? "#ffffff" : "#1a1a1a";
  // Scale particle counts down on small screens to cut GPU/CPU cost.
  const starCount = small ? 1800 : 5000;
  const baseSparkles = isDark ? 110 : 120;
  const sparkleCount = small ? Math.round(baseSparkles / 2) : baseSparkles;
  const sparkleOpacity = isDark ? 0.5 : 0.75;
  const sparkleSize = isDark ? 2 : 2.5;
  const wireframeOpacity = isDark ? 0.3 : 0.6;

  useFrame((state, delta) => {
    if (reduced) return;
    const g = groupRef.current;
    if (!g) return;

    // Smooth scroll interaction (read from a ref so scroll never re-renders React)
    const progression = Math.max(0, Math.min(1, scrollProgressRef.current));

    // Parallax based on mouse
    const mx = state.pointer.x;
    const my = state.pointer.y;

    // Lerp towards mouse position for subtle parallax
    const targetRotY = mx * 0.12;
    const targetRotX = -my * 0.12;
    g.rotation.y = MathUtils.damp(g.rotation.y, targetRotY, 6, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, targetRotX, 6, delta);

    // Scroll effect: move camera/group forward
    // We move the group towards the camera to simulate flying through
    const targetZ = progression * 4.5;
    g.position.z = MathUtils.damp(g.position.z, targetZ, 4, delta);
  });

  return (
    <group ref={groupRef}>
      {/* Background Elements */}
      {isDark ? (
        <Stars radius={80} depth={50} count={starCount} factor={8} saturation={0} fade speed={reduced ? 0 : 0.6} />
      ) : (
        <CustomStars count={starCount} rainbow />
      )}
      <Sparkles
        count={sparkleCount}
        scale={12}
        size={sparkleSize}
        speed={reduced ? 0 : 0.4}
        opacity={sparkleOpacity}
        color={primaryColor}
      />

      {/* Floating Shapes distributed in 3D space */}
      <FloatingShape position={[0, 0, 0]} scale={1.5} color={primaryColor} wireframeOpacity={wireframeOpacity} reduced={reduced} />
      <FloatingShape position={[-4, 2, -5]} scale={1} color={secondaryColor} delay={1} wireframeOpacity={wireframeOpacity} reduced={reduced} />
      <FloatingShape position={[4, -2, -4]} scale={1.2} color={primaryColor} delay={2} wireframeOpacity={wireframeOpacity} reduced={reduced} />
      <FloatingShape position={[-3, -3, -2]} scale={0.8} color={secondaryColor} delay={3} wireframeOpacity={wireframeOpacity} reduced={reduced} />
      <FloatingShape position={[3, 3, -6]} scale={0.9} color={primaryColor} delay={4} wireframeOpacity={wireframeOpacity} reduced={reduced} />
    </group>
  );
}

type Hero3DProps = {
  scrollProgressRef: RefObject<number>;
};

export default function Hero3D({ scrollProgressRef }: Hero3DProps) {
  const reduced = useReducedMotion();
  const { small, lowDpr } = useDeviceProfile();
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        className="h-full w-full"
        // Reduced-motion users get a single static render (no continuous RAF
        // loop); everyone else gets the live animation.
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: !small, alpha: true }}
        dpr={small || lowDpr ? [1, 1.5] : [1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        <SceneContent scrollProgressRef={scrollProgressRef} reduced={reduced} small={small} />
      </Canvas>
    </div>
  );
}
