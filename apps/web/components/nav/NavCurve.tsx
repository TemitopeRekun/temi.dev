"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function NavCurve() {
  const [h, setH] = useState(0);

  useEffect(() => {
    setH(window.innerHeight);
  }, []);

  if (!h) return null;

  const edge = 180;
  const curveOut = `M${edge} 0 L${edge} ${h} Q-340 ${h / 2} ${edge} 0 Z`;
  const curveStraight = `M${edge} 0 L${edge} ${h} Q${edge} ${h / 2} ${edge} 0 Z`;
  const curveIn = `M${edge} 0 L${edge} ${h} Q340 ${h / 2} ${edge} 0 Z`;

  const curve = {
    initial: { d: curveOut },
    enter: {
      d: [curveOut, curveStraight],
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: [curveStraight, curveIn],
      transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
    },
  };

  return (
    <svg
      className="absolute -left-[310px] top-0 w-[440px] fill-[var(--bg)]"
      viewBox={`-440 0 880 ${h}`}
      preserveAspectRatio="none"
      style={{ height: `${h}px` }}
    >
      <motion.path variants={curve} initial="initial" animate="enter" exit="exit" />
    </svg>
  );
}
