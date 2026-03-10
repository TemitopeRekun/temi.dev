"use client";
import { useRef, useLayoutEffect } from "react";
import { gsap } from "../../lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Props {
  text?: string;
}

export function MarqueeSlider({
  text = "Full-Stack Development · AI Automation · Mobile Engineering · NestJS · Next.js · React Native · ",
}: Props) {
  const firstText = useRef<HTMLParagraphElement>(null);
  const secondText = useRef<HTMLParagraphElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const xPercent = useRef(0);
  const direction = useRef(-1);
  const rafId = useRef(0);

  // Repeat text to ensure it covers wide screens
  const content = text.repeat(4);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
      },
      x: "-500px",
    });

    ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        direction.current = self.direction * -1;
      },
    });

    const animate = () => {
      if (xPercent.current < -100) xPercent.current = 0;
      else if (xPercent.current > 0) xPercent.current = -100;
      gsap.set(firstText.current, { xPercent: xPercent.current });
      gsap.set(secondText.current, { xPercent: xPercent.current });
      xPercent.current += 0.05 * direction.current;
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId.current);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative overflow-hidden py-10 sm:py-16 border-y border-(--border)/50 bg-(--surface)/30 backdrop-blur-sm">
      <div
        ref={slider}
        className="relative flex whitespace-nowrap will-change-transform"
      >
        <p
          ref={firstText}
          style={{ fontFamily: "var(--font-syne)" }}
          className="shrink-0 text-[clamp(2.5rem,6vw,5rem)] font-bold pr-12 text-transparent [-webkit-text-stroke:1px_var(--muted)] opacity-40"
        >
          {content}
        </p>
        <p
          ref={secondText}
          style={{ fontFamily: "var(--font-syne)" }}
          className="shrink-0 text-[clamp(2.5rem,6vw,5rem)] font-bold pr-12 text-transparent [-webkit-text-stroke:1px_var(--muted)] opacity-40"
        >
          {content}
        </p>
      </div>
    </div>
  );
}
