"use client";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

export function NavCurve() {
  const [h, setH] = useState(0);
  const easing = [0.76, 0, 0.24, 1] as const;

  useEffect(() => {
    setH(window.innerHeight);
  }, []);

  if (!h) return null;

  const curveOut = `M100 0 L100 ${h} Q0 ${h / 2} 100 0 Z`;
  const curveStraight = `M100 0 L100 ${h} Q100 ${h / 2} 100 0 Z`;

  const curve: Variants = {
    initial: { d: curveOut },
    enter: {
      d: curveStraight,
      transition: { duration: 1, ease: easing },
    },
    exit: {
      d: curveOut,
      transition: { duration: 0.8, ease: easing },
    },
  };

  return (
    <svg
      className="absolute -left-[100px] top-0 w-[100px] fill-(--bg) stroke-none"
      viewBox={`0 0 100 ${h}`}
      preserveAspectRatio="none"
      style={{ height: `${h}px` }}
    >
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  );
}
