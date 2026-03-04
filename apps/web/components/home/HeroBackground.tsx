"use client";

import { useEffect, useState } from "react";

export function HeroBackground() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
      if (!event.matches) {
        setVideoReady(false);
      }
    };

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);

    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 15% 40%, var(--accent-glow-strong), transparent 60%),
          radial-gradient(ellipse 60% 50% at 85% 65%, rgba(196,91,60,0.18), transparent 55%),
          var(--bg)`,
        }}
      />
      <div className="hidden lg:block">
        <div
          className="absolute left-[-10%] top-[-15%] h-[500px] w-[500px] animate-[floatY_8s_ease-in-out_infinite] blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--accent-glow-strong) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-[300px] w-[300px] animate-[floatY_10s_ease-in-out_infinite_reverse] blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(196,91,60,0.22) 0%, transparent 70%)",
            animationDelay: "2s",
          }}
        />
      </div>
      {isDesktop ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          src="/hero.mp4"
          onCanPlayThrough={() => setVideoReady(true)}
          className={[
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1200",
            videoReady ? "opacity-[0.15]" : "opacity-0",
          ].join(" ")}
        />
      ) : null}
      <div className="hero-video-overlay absolute inset-0" />
      <div
        className="absolute inset-x-0 bottom-0 h-48"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--bg))",
        }}
      />
      <style jsx global>{`
        .hero-video-overlay {
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

        @keyframes floatY {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
