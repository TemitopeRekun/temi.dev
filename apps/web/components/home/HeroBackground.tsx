"use client";

import type { RefObject } from "react";
import dynamic from "next/dynamic";

function GradientFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 animate-pulse"
      style={{
        background: `
          radial-gradient(ellipse 70% 55% at 15% 40%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 60%),
          radial-gradient(ellipse 55% 50% at 85% 65%, color-mix(in oklab, var(--accent2) 18%, transparent), transparent 55%),
          radial-gradient(ellipse 45% 40% at 60% 20%, color-mix(in oklab, var(--accent) 10%, transparent), transparent 50%),
          var(--bg)
        `,
      }}
    />
  );
}

const Scene = dynamic<{ scrollProgressRef: RefObject<number> }>(
  () => import("./Hero3D"),
  {
    ssr: false,
    loading: () => <GradientFallback />,
  },
);

type HeroBackgroundProps = {
  scrollProgressRef: RefObject<number>;
};

export function HeroBackground({ scrollProgressRef }: HeroBackgroundProps) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Base Gradient Layer (shows through the transparent 3D canvas) */}
      <div
        className="absolute inset-0 z-[-2]"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 15% 40%, var(--accent-glow-strong), transparent 60%),
          radial-gradient(ellipse 65% 55% at 85% 65%, color-mix(in oklab, var(--accent2) 28%, transparent), transparent 58%),
          var(--bg)`,
        }}
      />

      {/* 3D Scene Layer - The "Interactive Video" */}
      <div className="absolute inset-0 z-0">
        <Scene scrollProgressRef={scrollProgressRef} />
      </div>

      {/* Cinematic Overlays */}
      <div className="hero-contrast-veil absolute inset-0 z-1 pointer-events-none" />
      <div className="hero-cinematic-overlay absolute inset-0 z-1 pointer-events-none" />
      <div
        className="absolute inset-x-0 bottom-0 h-48 z-1 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--bg))",
        }}
      />

      <style jsx global>{`
        .hero-contrast-veil {
          background:
            radial-gradient(
              ellipse 60% 42% at 50% 35%,
              color-mix(in oklab, var(--hero-ink-strong) 60%, transparent),
              transparent 62%
            ),
            linear-gradient(
              180deg,
              color-mix(in oklab, var(--hero-ink) 75%, transparent) 0%,
              transparent 40%,
              color-mix(in oklab, var(--hero-ink-strong) 80%, transparent) 100%
            );
        }

        .hero-cinematic-overlay {
          background:
            linear-gradient(
              to bottom,
              color-mix(in oklab, var(--bg) 10%, transparent),
              color-mix(in oklab, var(--bg) 45%, transparent) 45%,
              color-mix(in oklab, var(--bg) 70%, transparent)
            ),
            linear-gradient(
              to right,
              color-mix(in oklab, var(--bg) 28%, transparent),
              transparent 35%,
              color-mix(in oklab, var(--bg) 35%, transparent)
            );
        }
      `}</style>
    </div>
  );
}
