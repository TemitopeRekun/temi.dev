"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Float, Stars, Sparkles, PerspectiveCamera } from "@react-three/drei";
import { Mesh, Group, MathUtils } from "three";
import { useTheme } from "next-themes";

type SceneContentProps = {
  scrollProgress: number;
};

function FloatingShape({
  position,
  scale = 1,
  color,
  delay = 0,
}: {
  position: [number, number, number];
  scale?: number;
  color: string;
  delay?: number;
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
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>
    </Float>
  );
}

function SceneContent({ scrollProgress }: SceneContentProps) {
  const groupRef = useRef<Group | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const primaryColor = isDark ? "#C8F557" : "#F07C3A";
  const secondaryColor = isDark ? "#ffffff" : "#8A3B1B";
  const sparkleCount = isDark ? 110 : 70;
  const sparkleOpacity = isDark ? 0.5 : 0.28;
  const sparkleSize = isDark ? 2 : 1.4;

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
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.6}
      />
      <Sparkles
        count={sparkleCount}
        scale={12}
        size={sparkleSize}
        speed={0.4}
        opacity={sparkleOpacity}
        color={primaryColor}
      />

      {/* Floating Shapes distributed in 3D space */}
      <FloatingShape position={[0, 0, 0]} scale={1.5} color={primaryColor} />
      <FloatingShape
        position={[-4, 2, -5]}
        scale={1}
        color={secondaryColor}
        delay={1}
      />
      <FloatingShape
        position={[4, -2, -4]}
        scale={1.2}
        color={primaryColor}
        delay={2}
      />
      <FloatingShape
        position={[-3, -3, -2]}
        scale={0.8}
        color={secondaryColor}
        delay={3}
      />
      <FloatingShape
        position={[3, 3, -6]}
        scale={0.9}
        color={primaryColor}
        delay={4}
      />
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
