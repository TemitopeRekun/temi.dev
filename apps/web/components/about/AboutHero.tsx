"use client";
import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { registerGSAP } from "../../lib/gsap";

import { MagneticWrapper } from "@temi/ui";
import Link from "next/link";
import type { Route } from "next";
import { TextReveal } from "../common/TextReveal";
import { motion, useScroll, useTransform } from "framer-motion";

export function AboutHero({ hideLink = false }: { hideLink?: boolean }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const clipRef = useRef<HTMLHeadingElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Parallax effect for the button
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start end", "end start"],
  });
  
  const buttonY = useTransform(scrollYProgress, [0, 1], [0, -50]);

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

        // NOTE: We removed the fade-in animation for content to let TextReveal handle it
        
        clip.style.willChange = "clip-path";
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top center",
            end: "bottom center",
            scrub: 1,
            // markers: true,
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
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.3em] text-(--accent)">
              <TextReveal text="Who I Am" type="chars" />
            </div>
            <div className="relative mt-6">
              <h1 className="font-(--font-syne) text-[clamp(2rem,8vw,6rem)] tracking-[-0.02em] text-(--text)/10" style={{ lineHeight: 1 }}>
                Temitope
                <br />
                Ogunrekun
              </h1>
              <h1
                ref={clipRef}
                className="pointer-events-none absolute inset-0 font-(--font-syne) text-[clamp(2rem,8vw,6rem)] tracking-[-0.02em] text-(--text)"
                style={{ lineHeight: 1 }}
                aria-hidden="true"
              >
                Temitope
                <br />
                Ogunrekun
              </h1>
            </div>
          </div>

          <div ref={contentRef} className="space-y-8 relative">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light leading-tight">
              I grew up in Lagos, picking up{" "}
              <span className="font-serif italic text-(--accent)">
                programming
              </span>{" "}
              the way most people here do — piecing it together from whatever was available online.
            </h2>
            <div className="text-base sm:text-lg text-(--muted) leading-relaxed">
              <TextReveal
                text="My first real job was the sole developer at a cleaning agency in Bedford, UK. I built their booking platform from scratch — architecture decisions, production incidents, all of it. It eventually cut 40% of their manual scheduling work. That's where I learned what it actually means to own a product end to end."
                delay={0.2}
              />
            </div>
            <div className="text-base sm:text-lg text-(--muted) leading-relaxed">
              <TextReveal
                text="From there, Spain — a GDPR project for a European grant consultancy, then a direct referral to ADP Digitek, where I'm now part of the team on Multifactu, fiscal-compliance invoicing software for Spanish SMEs. When your software processes legally binding documents for real businesses, you stop treating 'it works' as the finish line."
                delay={0.4}
              />
            </div>

            {!hideLink && (
              <motion.div style={{ y: buttonY }} className="pt-4">
                <MagneticWrapper>
                  <Link
                    href={"/about" as Route}
                    className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-(--text) hover:text-(--accent) transition-colors"
                  >
                    Read the full story →
                    <span className="inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </MagneticWrapper>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
