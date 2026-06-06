"use client";
import { useRef, useLayoutEffect } from "react";
import { gsap } from "../../lib/gsap";

interface Props {
  text?: string;
}

export function MarqueeSlider({
  text = "TypeScript · Next.js · NestJS · PostgreSQL · REST APIs · Full-Stack Engineering · React · Docker · CI/CD · ",
}: Props) {
  const firstText = useRef<HTMLParagraphElement>(null);
  const secondText = useRef<HTMLParagraphElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const xPercent = useRef(0);
  const speed = useRef(-0.06); // Starts at base speed moving left
  const targetSpeed = useRef(-0.06);
  const rafId = useRef(0);

  // Repeat text to ensure it covers wide screens
  const content = text.repeat(4);

  useLayoutEffect(() => {
    const baseSpeed = -0.06; // moves left by default
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;

    // Extremely reliable native scroll listener to capture exact scroll delta
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // diff > 0 (scrolling down) -> move left faster (negative speed)
      // diff < 0 (scrolling up) -> reverse direction and move right (positive speed)
      if (diff > 0) {
        // Scrolling down: Use a very gentle multiplier (0.006) and a softer speed cap (-0.35)
        const rawTarget = baseSpeed - (diff * 0.006);
        targetSpeed.current = Math.max(-0.35, rawTarget);
      } else if (diff < 0) {
        // Scrolling up: Use a stronger multiplier (0.028) to easily overcome baseSpeed and a higher speed cap (0.55)
        const rawTarget = baseSpeed - (diff * 0.028);
        targetSpeed.current = Math.min(0.55, rawTarget);
      }

      // Smoothly decay back to normal base speed when scrolling stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        targetSpeed.current = baseSpeed;
      }, 100);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const animate = () => {
      // Lerp current speed towards the target speed for buttery-smooth transitions
      speed.current += (targetSpeed.current - speed.current) * 0.08;

      xPercent.current += speed.current;

      if (xPercent.current < -100) {
        xPercent.current = 0;
      } else if (xPercent.current > 0) {
        xPercent.current = -100;
      }

      gsap.set(firstText.current, { xPercent: xPercent.current });
      gsap.set(secondText.current, { xPercent: xPercent.current });

      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId.current);
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="relative overflow-hidden py-8 sm:py-14 border-y border-(--border) bg-(--surface-tint)">
      <div
        ref={slider}
        className="relative flex whitespace-nowrap will-change-transform"
      >
        <p
          ref={firstText}
          style={{ fontFamily: "var(--font-syne)" }}
          className="shrink-0 text-[clamp(1.8rem,5vw,4.5rem)] font-bold pr-6 sm:pr-12 text-transparent [-webkit-text-stroke:1px_var(--muted)] opacity-40"
        >
          {content}
        </p>
        <p
          ref={secondText}
          style={{ fontFamily: "var(--font-syne)" }}
          className="shrink-0 text-[clamp(1.8rem,5vw,4.5rem)] font-bold pr-6 sm:pr-12 text-transparent [-webkit-text-stroke:1px_var(--muted)] opacity-40"
        >
          {content}
        </p>
      </div>
    </div>
  );
}
