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
        onUpdate: (e) => {
          direction.current = e.direction * -1;
        },
      },
      x: "-500px",
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
    <div className="relative overflow-hidden py-4 border-y border-(--border)">
      <div
        ref={slider}
        className="relative flex whitespace-nowrap will-change-transform"
      >
        <p
          ref={firstText}
          className="font-(--font-syne) text-[clamp(1.5rem,5vw,4rem)] font-light pr-8 text-(--text)/30"
        >
          {content}
        </p>
        <p
          ref={secondText}
          className="absolute left-full font-(--font-syne) text-[clamp(1.5rem,5vw,4rem)] font-light pr-8 text-(--text)/30"
        >
          {content}
        </p>
      </div>
    </div>
  );
}
