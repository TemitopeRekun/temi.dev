"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { registerGSAP, gsap } from "../../lib/gsap";

const Scene = dynamic<{ scrollProgress: number }>(() => import("./Hero3D"), {
  ssr: false,
  loading: () => null,
});

type HeroBackgroundProps = {
  scrollProgress?: number;
};

export function HeroBackground({ scrollProgress = 0 }: HeroBackgroundProps) {
  const [videoReady, setVideoReady] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? "/hero.mp4";

  useEffect(() => {
    if (!videoEnabled || !videoReady) return;

    let cleanup: (() => void) | null = null;
    const run = async () => {
      await registerGSAP();
      const video = videoRef.current;
      if (!video) return;

      const initScrollScrub = () => {
        const ctx = gsap.context(() => {
          gsap.to(video, {
            currentTime: video.duration,
            ease: "none",
            scrollTrigger: {
              trigger: "section[aria-label='Hero']",
              start: "top top",
              end: "+=240%",
              scrub: 1.15,
            },
          });
        });
        cleanup = () => ctx.revert();
      };

      if (video.readyState >= 1) {
        initScrollScrub();
        return;
      }

      const onLoadedMetadata = () => initScrollScrub();
      video.addEventListener("loadedmetadata", onLoadedMetadata);
      cleanup = () => {
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
      };
    };
    void run();
    return () => cleanup?.();
  }, [videoEnabled, videoReady]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Base Gradient Layer */}
      <div
        className="absolute inset-0 z-[-2]"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 15% 40%, var(--accent-glow-strong), transparent 60%),
          radial-gradient(ellipse 65% 55% at 85% 65%, color-mix(in oklab, var(--accent2) 28%, transparent), transparent 58%),
          var(--bg)`,
        }}
      />

      {/* Video Layer (Optional) */}
      {videoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src={videoSrc}
          onCanPlayThrough={() => setVideoReady(true)}
          onError={() => {
            setVideoReady(false);
            setVideoEnabled(false);
            setVideoError(true);
          }}
          className={[
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1200 z-[-1]",
            videoReady ? "opacity-30 sm:opacity-35" : "opacity-0",
          ].join(" ")}
        />
      ) : null}

      {/* 3D Scene Layer - The "Interactive Video" */}
      <div className="absolute inset-0 z-0">
        <Scene scrollProgress={scrollProgress} />
      </div>

      {/* Fallback Message for Video (Only if explicitly errored and scene might be loading) */}
      {videoError && (
        <div className="absolute inset-x-0 bottom-10 mx-auto w-fit rounded-full border border-(--border) bg-(--surface)/80 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-(--muted) backdrop-blur-md z-10 hidden">
          Add /public/hero.mp4 (Optional)
        </div>
      )}

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
