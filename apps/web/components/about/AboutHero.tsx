"use client";
import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { registerGSAP } from "../../lib/gsap";

import { MagneticWrapper } from "@temi/ui";
import Link from "next/link";
import type { Route } from "next";
import { TextReveal } from "../common/TextReveal";

export function AboutHero() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const clipRef = useRef<HTMLHeadingElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let tl: gsap.core.Timeline | null = null;
    const run = async () => {
      await registerGSAP();
      const wrap = wrapperRef.current;
      const clip = clipRef.current;
      const content = contentRef.current;

      if (!wrap || !clip || !content) return;

      const ctx = gsap.context(() => {
        gsap.set(clip, {
          // start fully hidden with clip-path from the right
          clipPath: "inset(0 100% 0 0)",
        });

        // Initial reveal animation
        gsap.fromTo(
          content,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: wrap,
              start: "top 80%",
            },
          },
        );

        clip.style.willChange = "clip-path";
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top center",
            end: "bottom center",
            scrub: 1,
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
      className="relative isolate bg-(--bg) py-24 sm:py-32"
      aria-label="About — Intro"
    >
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, var(--text) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Accent gradient blob */}
      <div
        className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-(--accent) opacity-5 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.3em] text-(--accent)">
              <TextReveal text="Who I Am" type="chars" />
            </div>
            <div className="relative mt-6">
              <h1 className="font-(--font-syne) text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em] text-(--text)/10">
                Temitope
                <br />
                Ogunrekun
              </h1>
              <h1
                ref={clipRef}
                className="pointer-events-none absolute inset-0 font-(--font-syne) text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em] text-(--text)"
                aria-hidden="true"
              >
                Temitope
                <br />
                Ogunrekun
              </h1>
            </div>
          </div>

          <div ref={contentRef} className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-light leading-tight">
              A{" "}
              <span className="font-serif italic text-(--accent)">
                software engineer
              </span>{" "}
              blending creative design with robust systems architecture.
            </h2>
            <div className="text-lg text-(--muted) leading-relaxed">
              <TextReveal
                text="I specialize in building high-performance web and mobile applications that feel alive. My approach combines technical precision with a deep appreciation for motion and aesthetics, ensuring every interaction serves a purpose."
                delay={0.2}
              />
            </div>
            <div className="text-lg text-(--muted) leading-relaxed">
              <TextReveal
                text="Currently focused on AI-driven automation and 3D web experiences that push the boundaries of what's possible in the browser."
                delay={0.4}
              />
            </div>

            <div className="pt-4">
              <MagneticWrapper>
                <Link
                  href={"/about" as Route}
                  className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-(--text) hover:text-(--accent) transition-colors"
                >
                  More about my journey
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </MagneticWrapper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
