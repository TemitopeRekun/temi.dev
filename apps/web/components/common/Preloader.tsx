"use client";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Intro overlay timings.
 *
 * These are load-blocking: the overlay is an opaque full-viewport panel, and the
 * hero's headline and GSAP intro are both gated on it finishing. The previous
 * values — six words at 1s each plus a 2s exit — kept the homepage covered for
 * roughly seven seconds on every fresh session, which is what Lighthouse and
 * every first-time visitor measure (the skip flag lives in sessionStorage).
 *
 * Total is now WORD_MS * words.length + EXIT_MS, so keep the budget in mind when
 * adding words back.
 */
const WORD_MS = 400;
const EXIT_MS = 0.6;
/** Hard ceiling in case a timer is dropped (backgrounded tab, throttling). */
export const PRELOADER_SAFETY_MS = 2500;

const words = ["Hello", "Temitope", "Welcome"];
const easing: [number, number, number, number] = [0.76, 0, 0.24, 1];

const slideUp: Variants = {
  initial: { y: 0 },
  exit: {
    y: "-100%",
    transition: { duration: EXIT_MS, ease: easing },
  },
};

const opacity: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 0.75, transition: { duration: 0.3 } },
};

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [dim, setDim] = useState({ w: 0, h: 0 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setDim({ w: window.innerWidth, h: window.innerHeight });
  }, []);

  // Reduced-motion: complete immediately rather than cycling through words.
  useEffect(() => {
    if (reducedMotion) onComplete();
  }, [reducedMotion, onComplete]);

  useEffect(() => {
    if (reducedMotion) return;
    if (index === words.length - 1) {
      const t = setTimeout(onComplete, WORD_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIndex((i) => i + 1), WORD_MS);
    return () => clearTimeout(t);
  }, [index, onComplete, reducedMotion]);

  const initialPath = `M0 0 L${dim.w} 0 L${dim.w} ${dim.h} Q${dim.w / 2} ${
    dim.h + 300
  } 0 ${dim.h} L0 0`;
  const curve: Variants = {
    initial: {
      d: initialPath,
      transition: { duration: 0.5, ease: easing },
    },
    exit: {
      d: initialPath,
      transition: { duration: EXIT_MS, ease: easing },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-9999 overflow-hidden flex items-center justify-center bg-(--bg)"
    >
      {dim.w > 0 && (
        <>
          <motion.p
            variants={opacity}
            initial="initial"
            animate="enter"
            className="absolute z-10 flex items-center gap-4 font-(--font-syne) text-5xl text-(--text)"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-(--accent) block" />
            {words[index]}
          </motion.p>
          <svg
            className="absolute top-0 left-0 w-full pointer-events-none"
            style={{ height: `${dim.h + 300}px` }}
          >
            <motion.path
              variants={curve}
              initial="initial"
              exit="exit"
              className="fill-(--bg)"
            />
          </svg>
        </>
      )}
    </motion.div>
  );
}
