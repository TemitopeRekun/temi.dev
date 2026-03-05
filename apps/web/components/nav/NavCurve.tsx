"use client";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

export function NavCurve() {
  const [h, setH] = useState(0);
  const easing: [number, number, number, number] = [0.76, 0, 0.24, 1];

  useEffect(() => {
    setH(window.innerHeight);
  }, []);

  if (!h) return null;

  const edge = 180;
  const curveOut = `M${edge} 0 L${edge} ${h} Q-340 ${h / 2} ${edge} 0 Z`;
  const curveStraight = `M${edge} 0 L${edge} ${h} Q${edge} ${h / 2} ${edge} 0 Z`;
  const curveIn = `M${edge} 0 L${edge} ${h} Q340 ${h / 2} ${edge} 0 Z`;

  const curve: Variants = {
    initial: { d: curveOut },
    enter: {
      d: [curveOut, curveStraight],
      transition: { duration: 1, ease: easing },
    },
    exit: {
      d: [curveStraight, curveIn],
      transition: { duration: 1.1, ease: easing, delay: 0.05 },
    },
  };

  return (
    <svg
      className="absolute -left-[310px] top-0 w-[440px] fill-(--bg)"
      viewBox={`-440 0 880 ${h}`}
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
