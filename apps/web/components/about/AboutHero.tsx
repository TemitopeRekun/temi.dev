"use client";
import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { registerGSAP } from "../../lib/gsap";

export function AboutHero() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const clipRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let tl: gsap.core.Timeline | null = null;
    const run = async () => {
      await registerGSAP();
      const wrap = wrapperRef.current;
      const clip = clipRef.current;
      if (!wrap || !clip) return;
      const ctx = gsap.context(() => {
        gsap.set(clip, {
          // start fully hidden with clip-path from the right
          clipPath: "inset(0 100% 0 0)",
        });
        clip.style.willChange = "clip-path";
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top top+=40",
            end: "bottom top+=120",
            scrub: true,
          },
        });
        tl.to(clip, {
          clipPath: "inset(0 0% 0 0)",
          duration: 1,
          ease: "power2.out",
        });
        tl.eventCallback("onComplete", () => {
          clip.style.willChange = "";
        });
      }, wrap);
      cleanup = () => ctx.revert();
    };
    void run();
    return () => {
      tl?.kill();
      cleanup?.();
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="relative isolate bg-(--bg) py-16 sm:py-20 lg:py-28"
      aria-label="About — Intro"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-(--muted)">
          About Me
        </p>
        <div className="relative mt-3">
          <h1 className="font-(--font-syne) text-[min(12vw,5rem)] leading-[0.95] tracking-[-0.01em] text-(--text)/40">
            Temitope Ogunrekun
          </h1>
          <h1
            ref={clipRef}
            className="pointer-events-none absolute inset-0 font-(--font-syne) text-[min(12vw,5rem)] leading-[0.95] tracking-[-0.01em] text-(--text)"
            aria-hidden="true"
          >
            Temitope Ogunrekun
          </h1>
        </div>
        <p className="mt-4 max-w-2xl text-(--muted)">
          Full-Stack Engineer focused on AI-first products across web and
          mobile. I build reliable systems with Next.js, NestJS, and thoughtful
          UX.
        </p>
      </div>
    </section>
  );
}

