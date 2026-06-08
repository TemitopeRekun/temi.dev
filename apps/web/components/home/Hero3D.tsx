"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Float, Stars, Sparkles, PerspectiveCamera } from "@react-three/drei";
import { Mesh, Group, MathUtils, Color, CanvasTexture } from "three";
import { useMemo } from "react";

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
  scrollProgress: number;
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
}: {
  position: [number, number, number];
  scale?: number;
  color: string;
  delay?: number;
  wireframeOpacity?: number;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.2 + delay;
    meshRef.current.rotation.y = t * 0.15 + delay;
  });

  return (
    <Float
      speed={1.2}
      rotationIntensity={1}
      floatIntensity={2}
      floatingRange={[-0.2, 0.2]}
    >
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={wireframeOpacity} />
      </mesh>
    </Float>
  );
}

function SceneContent({ scrollProgress }: SceneContentProps) {
  const groupRef = useRef<Group | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const primaryColor = isDark ? "#C8F557" : "#F07C3A";
  const secondaryColor = isDark ? "#ffffff" : "#1a1a1a";
  const sparkleCount = isDark ? 110 : 120;
  const sparkleOpacity = isDark ? 0.5 : 0.75;
  const sparkleSize = isDark ? 2 : 2.5;
  const wireframeOpacity = isDark ? 0.3 : 0.6;

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    // Smooth scroll interaction
    const progression = Math.max(0, Math.min(1, scrollProgress));

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
        <Stars radius={80} depth={50} count={5000} factor={8} saturation={0} fade speed={0.6} />
      ) : (
        <CustomStars count={5000} rainbow />
      )}
      <Sparkles
        count={sparkleCount}
        scale={12}
        size={sparkleSize}
        speed={0.4}
        opacity={sparkleOpacity}
        color={primaryColor}
      />

      {/* Floating Shapes distributed in 3D space */}
      <FloatingShape position={[0, 0, 0]} scale={1.5} color={primaryColor} wireframeOpacity={wireframeOpacity} />
      <FloatingShape position={[-4, 2, -5]} scale={1} color={secondaryColor} delay={1} wireframeOpacity={wireframeOpacity} />
      <FloatingShape position={[4, -2, -4]} scale={1.2} color={primaryColor} delay={2} wireframeOpacity={wireframeOpacity} />
      <FloatingShape position={[-3, -3, -2]} scale={0.8} color={secondaryColor} delay={3} wireframeOpacity={wireframeOpacity} />
      <FloatingShape position={[3, 3, -6]} scale={0.9} color={primaryColor} delay={4} wireframeOpacity={wireframeOpacity} />
    </group>
  );
}

type Hero3DProps = {
  scrollProgress: number;
};

export default function Hero3D({ scrollProgress }: Hero3DProps) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        className="h-full w-full"
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        <SceneContent scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
