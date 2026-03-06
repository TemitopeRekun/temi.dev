"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, registerGSAP } from "../../lib/gsap";
import type { Route } from "next";
import { MagneticWrapper } from "@temi/ui";
import { HeroBackground } from "./HeroBackground";
import { TextReveal } from "../common/TextReveal";
import { usePreloader } from "../../providers/PreloaderWrapper";

export function Hero() {
  const isLoading = usePreloader();
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const overlineRef = useRef<HTMLDivElement | null>(null);
  const overlineWrapperRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const headlinePart1Ref = useRef<HTMLSpanElement | null>(null);
  const headlinePart2Ref = useRef<HTMLSpanElement | null>(null);
  const sublineRef = useRef<HTMLParagraphElement | null>(null);
  const sublineWrapperRef = useRef<HTMLDivElement | null>(null);
  const chipsRef = useRef<HTMLDivElement | null>(null);
  const chipsWrapperRef = useRef<HTMLDivElement | null>(null);
  const ctasRef = useRef<HTMLDivElement | null>(null);
  const ctasWrapperRef = useRef<HTMLDivElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let latestProgress = 0;
    let mounted = true;

    const run = async () => {
      await registerGSAP();
      if (!mounted || isLoading) return;

      const section = sectionRef.current;
      const content = contentRef.current;
      const overline = overlineRef.current;
      const overlineWrapper = overlineWrapperRef.current;
      const headline = headlineRef.current;
      const headlinePart1 = headlinePart1Ref.current;
      const headlinePart2 = headlinePart2Ref.current;
      const subline = sublineRef.current;
      const sublineWrapper = sublineWrapperRef.current;
      const chips = chipsRef.current;
      const chipsWrapper = chipsWrapperRef.current;
      const ctas = ctasRef.current;
      const ctasWrapper = ctasWrapperRef.current;
      const scrollHint = scrollHintRef.current;

      if (
        !section ||
        !content ||
        !overline ||
        !overlineWrapper ||
        !headline ||
        !subline ||
        !sublineWrapper ||
        !chips ||
        !chipsWrapper ||
        !ctas ||
        !ctasWrapper ||
        !scrollHint ||
        !headlinePart1 ||
        !headlinePart2
      )
        return;

      const ctx = gsap.context(() => {
        const introTl = gsap.timeline({
          defaults: { ease: "power2.out", duration: 0.75 },
        });

        introTl
          .fromTo(
            overlineWrapper,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, delay: 0.3 },
          )
          // Headline is handled by TextReveal components
          .fromTo(
            sublineWrapper,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0 },
            "<0.8",
          )
          .fromTo(
            chipsWrapper,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0 },
            "<0.1",
          )
          .fromTo(
            ctasWrapper,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0 },
            "<0.1",
          );

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=240%",
            pin: true,
            scrub: 1.15,
            anticipatePin: 1,
            onUpdate: (self) => {
              const nextProgress = Number(self.progress.toFixed(3));
              if (Math.abs(nextProgress - latestProgress) < 0.01) return;
              latestProgress = nextProgress;
              setScrollProgress(nextProgress);
            },
          },
        });

        scrollTl
          .to(headlinePart1, { xPercent: -18, autoAlpha: 0 }, 0.1)
          .to(
            headlinePart2,
            { xPercent: 28, scale: 1.22, yPercent: -6, autoAlpha: 0 },
            0.1,
          )
          .to(subline, { scale: 1.1, yPercent: -8, autoAlpha: 0 }, 0.15)
          .to(
            chips,
            { scale: 1.15, xPercent: 3, yPercent: -10, autoAlpha: 0 },
            0.18,
          )
          .to(ctas, { yPercent: 96, autoAlpha: 0 }, 0.22)
          .to(scrollHint, { autoAlpha: 0 }, 0.12)
          .to(overline, { autoAlpha: 0 }, 0.1);
      });
      cleanup = () => ctx.revert();
    };
    run();
    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, [isLoading]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-dvh flex items-center justify-center text-(--text)"
      aria-label="Hero"
    >
      <HeroBackground scrollProgress={scrollProgress} />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6 lg:px-8"
      >
        <div ref={overlineWrapperRef} className="mb-6">
          <div
            ref={overlineRef}
            className="text-xs uppercase tracking-[0.3em] text-(--muted) hero-muted-contrast"
          >
            <span className="mr-3 inline-block h-2 w-2 animate-[glowPulse_2s_ease-in-out_infinite] rounded-full bg-(--accent)" />
            Full-Stack · AI · Mobile
          </div>
        </div>

        <h1
          ref={headlineRef}
          className="font-(family-name:--font-fraunces) text-[min(13vw,6.5rem)] leading-[0.9] tracking-[-0.02em] lg:text-[min(10vw,8.5rem)] hero-text-contrast"
        >
          <span ref={headlinePart1Ref} className="inline-block">
            <TextReveal
              text="Temitope"
              type="chars"
              delay={0.4}
              stagger={0.03}
              enabled={!isLoading}
            />
          </span>
          <span
            ref={headlinePart2Ref}
            className="italic text-(--accent) inline-block ml-2 sm:ml-4"
          >
            <TextReveal
              text="Ogunrekun"
              type="chars"
              delay={0.6}
              stagger={0.03}
              enabled={!isLoading}
            />
          </span>
        </h1>

        <div ref={sublineWrapperRef} className="mt-8">
          <p
            ref={sublineRef}
            className="max-w-2xl text-lg sm:text-xl text-(--muted) font-light hero-muted-contrast"
          >
            Software Engineer & AI Automation Expert
          </p>
        </div>

        <div ref={chipsWrapperRef} className="mt-8">
          <div
            ref={chipsRef}
            className="flex max-w-3xl flex-wrap justify-center gap-3 text-[0.65rem] uppercase tracking-[0.18em] text-(--muted)"
          >
            {["AI Systems", "Next.js", "NestJS", "R3F", "Automation"].map(
              (chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-(--border) bg-(--surface2)/50 backdrop-blur-sm px-4 py-2"
                >
                  {chip}
                </span>
              ),
            )}
          </div>
        </div>

        <div ref={ctasWrapperRef} className="mt-10">
          <div
            ref={ctasRef}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticWrapper>
              <Link
                href={{ pathname: "/" as Route, hash: "work" }}
                className={[
                  "inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-medium text-white",
                  "bg-linear-to-br from-(--accent) to-(--accent2) shadow-[0_0_20px_var(--accent-glow)]",
                  "hover:-translate-y-0.5 hover:shadow-[0_0_28px_var(--accent-glow-strong)] transition-all duration-250",
                ].join(" ")}
              >
                View Work
              </Link>
            </MagneticWrapper>
            <MagneticWrapper>
              <Link
                href={{ pathname: "/" as Route, hash: "contact" }}
                className={[
                  "inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-medium",
                  "border border-(--border) hover:border-(--border-hover) hover:bg-(--surface2) backdrop-blur-sm transition-all duration-250",
                ].join(" ")}
              >
                Let&apos;s Talk
              </Link>
            </MagneticWrapper>
          </div>
        </div>
      </div>

      <div
        ref={scrollHintRef}
        aria-hidden
        className="pointer-events-none absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-(--muted) opacity-60">
          scroll
        </span>
        <div className="h-14 w-px animate-[bounceY_1.5s_ease-in-out_infinite] bg-linear-to-b from-(--accent)/60 to-transparent" />
      </div>

      <style jsx global>{`
        .hero-text-contrast {
          text-shadow: 0 2px 18px
            color-mix(in oklab, var(--hero-ink-strong) 70%, transparent);
        }

        .hero-muted-contrast {
          text-shadow: 0 1px 12px
            color-mix(in oklab, var(--hero-ink) 60%, transparent);
        }

        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.25);
          }
        }

        @keyframes bounceY {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(6px);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
