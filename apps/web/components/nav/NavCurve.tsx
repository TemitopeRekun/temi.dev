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

  const curveOut = `M200 0 L200 ${h} Q0 ${h / 2} 200 0 Z`;
  const curveStraight = `M200 0 L200 ${h} Q200 ${h / 2} 200 0 Z`;

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
      className="absolute -left-[200px] top-0 w-[200px] fill-(--bg) stroke-none"
      viewBox={`0 0 200 ${h}`}
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
