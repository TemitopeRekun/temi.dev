"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Mesh, TorusKnotGeometry, MeshBasicMaterial, Group } from "three";
import { useTheme } from "next-themes";

function Knot() {
  const ref = useRef<Group | null>(null);
  const { resolvedTheme } = useTheme();
  const color = resolvedTheme === "dark" ? "#C8F557" : "#1A1A1A";

  const geometry = useMemo(
    () => new TorusKnotGeometry(1, 0.32, 180, 12),
    [],
  );
  const material = useMemo(
    () => new MeshBasicMaterial({ color, wireframe: true }),
    [color],
  );

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.getElapsedTime();
    g.rotation.x = t * 0.12;
    g.rotation.y = t * 0.18;
    const mx = state.pointer.x;
    const my = state.pointer.y;
    g.position.x = mx * 0.4;
    g.position.y = my * 0.3;
  });

  return (
    <group ref={ref}>
      <mesh geometry={geometry} material={material as Mesh["material"]} />
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="relative h-64 w-full sm:h-96 md:h-full">
      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true }}
      >
        <Knot />
      </Canvas>
    </div>
  );
}

