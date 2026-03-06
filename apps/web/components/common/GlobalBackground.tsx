"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      t += 0.002;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create a subtle moving gradient
      const isDark = resolvedTheme === "dark";
      // Using theme variables but computed in JS for canvas
      // These are approximations of the theme colors for the background effect
      const color1 = isDark ? "rgba(200, 245, 87, 0.03)" : "rgba(240, 124, 58, 0.03)"; // accent
      const color2 = isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(138, 59, 27, 0.02)"; // secondary

      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5 + Math.sin(t) * 200,
        canvas.height * 0.5 + Math.cos(t * 0.8) * 200,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.8
      );

      gradient.addColorStop(0, color1);
      gradient.addColorStop(0.5, color2);
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add a second moving blob
      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.8 + Math.cos(t * 1.2) * 150,
        canvas.height * 0.2 + Math.sin(t * 0.9) * 150,
        0,
        canvas.width * 0.8,
        canvas.height * 0.2,
        canvas.width * 0.6
      );

      gradient2.addColorStop(0, color2);
      gradient2.addColorStop(1, "transparent");

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[-1] h-full w-full opacity-60"
      aria-hidden="true"
    />
  );
}
