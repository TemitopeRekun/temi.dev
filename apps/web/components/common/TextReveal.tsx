"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  text: string;
  className?: string;
  type?: "chars" | "words";
  delay?: number;
  duration?: number;
  stagger?: number;
  trigger?: string;
  enabled?: boolean;
};

export function TextReveal({
  text,
  className = "",
  type = "words",
  delay = 0,
  duration = 0.8,
  stagger = 0.02,
  trigger,
  enabled = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    gsap.registerPlugin(ScrollTrigger);
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const elements = container.querySelectorAll(".reveal-unit");

      gsap.set(elements, {
        y: "120%",
        opacity: 0,
        rotateX: 45,
        transformOrigin: "top left",
        visibility: "visible", // Make visible for GSAP to handle
      });

      ScrollTrigger.create({
        trigger: trigger || container,
        start: "top 85%", // Start a bit earlier to ensure visibility
        onEnter: () => {
          gsap.to(elements, {
            y: "0%",
            opacity: 1,
            rotateX: 0,
            duration,
            stagger: type === "chars" ? stagger : stagger * 2,
            ease: "power3.out",
            delay,
            overwrite: "auto",
          });
        },
        once: true,
      });
    }, container);

    return () => ctx.revert();
  }, [text, delay, duration, stagger, trigger, type]);

  const words = text.split(" ");

  if (type === "words") {
    return (
      <div
        ref={containerRef}
        className={`flex flex-wrap gap-x-[0.25em] ${className}`}
      >
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em]"
          >
            <span
              className="reveal-unit inline-block will-change-transform opacity-0"
              style={{ visibility: "hidden" }} // Hide initially to prevent FOUC
            >
              {word}
            </span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split("").map((char, j) => (
            <span
              key={j}
              className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em]"
            >
              <span
                className="reveal-unit inline-block will-change-transform opacity-0"
                style={{ visibility: "hidden" }} // Hide initially to prevent FOUC
              >
                {char}
              </span>
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
