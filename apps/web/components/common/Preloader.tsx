"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const words = ["Hello", "Temitope", "Builder", "Developer", "Creator", "Welcome"];

const slideUp = {
  initial: { y: 0 },
  exit: {
    y: "-100%",
    transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 1.2 },
  },
};

const opacity = {
  initial: { opacity: 0 },
  enter: { opacity: 0.75, transition: { duration: 1, delay: 0.2 } },
};

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [dim, setDim] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setDim({ w: window.innerWidth, h: window.innerHeight });
  }, []);

  useEffect(() => {
    if (index === words.length - 1) {
      const t = setTimeout(onComplete, 3700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setIndex((i) => i + 1),
      index === 0 ? 2500 : 2200,
    );
    return () => clearTimeout(t);
  }, [index, onComplete]);

  const initialPath = `M0 0 L${dim.w} 0 L${dim.w} ${dim.h} Q${dim.w / 2} ${
    dim.h + 300
  } 0 ${dim.h} L0 0`;
  const targetPath = `M0 0 L${dim.w} 0 L${dim.w} ${dim.h} Q${dim.w / 2} ${
    dim.h
  } 0 ${dim.h} L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center bg-(--bg)"
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
