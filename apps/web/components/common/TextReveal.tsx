"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Props = {
  text: string;
  className?: string;
  type?: "chars" | "words";
  delay?: number;
  duration?: number;
  stagger?: number;
  trigger?: string; // Kept for compatibility
  enabled?: boolean;
};

export function TextReveal({
  text,
  className = "",
  type = "words",
  delay = 0,
  duration = 0.5,
  stagger = 0.02,
  enabled = true,
}: Props) {
  const container = useRef(null);
  const isInView = useInView(container, { once: true, margin: "-10%" });

  // The ref must be attached in this branch too. useInView's effect deps are
  // [root, ref, margin, once, amount] — all stable — so it runs once on mount
  // and bails permanently when ref.current is null. Rendering an unref'd span
  // here meant no IntersectionObserver was ever created, and when `enabled`
  // later flipped, isInView stayed false, leaving the text parked at y:"100%"
  // inside an overflow-hidden mask — permanently invisible.
  if (!enabled)
    return (
      <span ref={container} className={className}>
        {text}
      </span>
    );

  const slideUp = {
    initial: {
      y: "100%",
    },
    open: (i: number) => ({
      y: "0%",
      transition: {
        duration,
        delay: delay + (type === "chars" ? stagger * i : stagger * i),
      },
    }),
    closed: {
      y: "100%",
      transition: { duration },
    },
  };

  // If type is words, we split by space and animate each word
  if (type === "words") {
    const words = text.split(" ");
    return (
      <span
        ref={container}
        className={`flex flex-wrap gap-x-[0.25em] ${className}`}
      >
        <span className="sr-only">{text}</span>
        {/*
          The split layer is aria-hidden so assistive tech reads the sr-only
          copy above once, rather than announcing the phrase and then spelling
          it out through the per-word/per-character spans.
        */}
        {words.map((word, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="inline-flex overflow-hidden relative"
          >
            <motion.span
              variants={slideUp}
              custom={i}
              initial="initial"
              animate={isInView ? "open" : "closed"}
              className="inline-block"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    );
  }

  // If type is chars, we split into words first to preserve word grouping/wrapping,
  // then animate characters within words
  const words = text.split(" ");
  let charIndex = 0;

  return (
    <span ref={container} className={`inline-block ${className}`}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block whitespace-nowrap mr-[0.25em]"
        >
          {word.split("").map((char, j) => {
            const currentDelayIndex = charIndex++;
            return (
              <span
                key={j}
                className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em]"
              >
                <motion.span
                  variants={slideUp}
                  custom={currentDelayIndex}
                  initial="initial"
                  animate={isInView ? "open" : "closed"}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
