"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { registerGSAP, gsap } from "../../lib/gsap";
import type { Route } from "next";
import { MagneticWrapper } from "@temi/ui";

const Scene = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="relative h-64 w-full animate-pulse sm:h-96 md:h-full">
      <div className="absolute inset-0 rounded-2xl border border-(--border) bg-(--surface)" />
    </div>
  ),
});

export function Hero() {
  const overlineRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const sublineRef = useRef<HTMLParagraphElement | null>(null);
  const ctasRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let tl: gsap.core.Timeline | null = null;
    let cleanup: (() => void) | null = null;
    let split: unknown = null;
    let chars: HTMLElement[] | null = null;

    const run = async () => {
      await registerGSAP();
      const overline = overlineRef.current;
      const headline = headlineRef.current;
      const subline = sublineRef.current;
      const ctas = ctasRef.current;
      const canvas = canvasRef.current;
      if (!overline || !headline || !subline || !ctas || !canvas) return;

      const ctx = gsap.context(() => {
        gsap.set([overline, subline, ctas, canvas], {
          opacity: 0,
          y: 16,
        });
        {
          const plugins = (
            gsap as unknown as {
              plugins?: Record<string, unknown>;
            }
          ).plugins;
          type SplitTextCtor = new (
            el: HTMLElement,
            opts: Record<string, unknown>,
          ) => { chars?: HTMLElement[]; revert?: () => void };
          const SplitText = plugins?.SplitText as unknown as
            | SplitTextCtor
            | undefined;
          if (SplitText) {
            const inst = new SplitText(headline, { type: "chars" });
            split = inst;
            const c = (inst as { chars?: HTMLElement[] }).chars ?? null;
            if (c && c.length > 0) {
              chars = c as HTMLElement[];
              gsap.set(chars, { opacity: 0, yPercent: 100, rotateX: -20 });
              chars.forEach(
                (el) => (el.style.willChange = "transform, opacity"),
              );
            }
          } else {
            gsap.set(headline, { opacity: 0, y: 24 });
            headline.style.willChange = "transform, opacity";
          }
        }
        tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(overline, { opacity: 1, y: 0, duration: 0.6, delay: 0.3 });
        if (chars && chars.length > 0) {
          tl.to(chars, {
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.02,
          });
        } else {
          tl.to(headline, { opacity: 1, y: 0, duration: 0.8 }, "<");
        }
        tl.to(subline, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2");
        tl.to(ctas, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
        tl.to(canvas, { opacity: 1, y: 0, duration: 0.8 }, "-=0.2");
        tl.eventCallback("onComplete", () => {
          [overline, subline, ctas, canvas].forEach(
            (el) => (el.style.willChange = ""),
          );
          if (chars && chars.length > 0) {
            chars.forEach((c) => (c.style.willChange = ""));
          } else {
            headline.style.willChange = "";
          }
        });
      });
      cleanup = () => ctx.revert();
    };
    run();
    return () => {
      if (tl) {
        tl.kill();
        tl = null;
      }
      if (typeof (split as { revert?: () => void })?.revert === "function") {
        (split as { revert: () => void }).revert();
      }
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <section
      className={[
        "relative min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-4rem)]",
        "bg-(--bg) text-(--text)",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Hero"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-14">
        <div className="flex flex-col justify-center">
          <div
            ref={overlineRef}
            className="mb-4 text-xs uppercase tracking-[0.3em] text-(--muted)"
          >
            Full-Stack · AI · Mobile
          </div>
          <h1
            ref={headlineRef}
            className="font-(--font-syne) text-[min(14vw,7rem)] leading-[0.9] tracking-[-0.02em]"
          >
            Temitope Ogunrekun
          </h1>
          <p ref={sublineRef} className="mt-4 max-w-xl text-(--muted)">
            Software Engineer & AI Automation Expert
          </p>
          <div ref={ctasRef} className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticWrapper>
              <Link
                href={{ pathname: "/" as Route, hash: "work" }}
                className={[
                  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                  "bg-(--accent) text-(--bg) border border-transparent hover:opacity-95 active:opacity-90",
                ].join(" ")}
              >
                View Work
              </Link>
            </MagneticWrapper>
            <MagneticWrapper>
              <Link
                href={{ pathname: "/" as Route, hash: "contact" }}
                className={[
                  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                  "bg-transparent text-(--text) border border-transparent hover:bg-(--surface)/50 active:bg-(--surface)/70",
                ].join(" ")}
              >
                Let&apos;s Talk
              </Link>
            </MagneticWrapper>
          </div>
        </div>
        <div
          ref={canvasRef}
          className="relative flex items-center justify-center"
        >
          <Scene />
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-center"
      >
        <div className="h-10 w-px animate-[bounceY_1.3s_infinite] bg-(--text)/40" />
      </div>
      <style jsx global>{`
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
