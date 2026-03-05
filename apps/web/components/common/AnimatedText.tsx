"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const slideUp = {
  initial: { y: "100%" },
  open: (i: number) => ({
    y: "0%",
    transition: { duration: 0.5, delay: 0.01 * i },
  }),
  closed: { y: "100%", transition: { duration: 0.5 } },
};

const fade = {
  initial: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.6 } },
  closed: { opacity: 0, transition: { duration: 0.4 } },
};

interface Props {
  phrase: string;
  subText?: string;
  className?: string;
  once?: boolean;
}

export function AnimatedText({ phrase, subText, className = "", once = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "0px 0px -80px 0px" });

  return (
    <div ref={ref} className={className}>
      <p className="flex flex-wrap gap-x-[0.35em]">
        {phrase.split(" ").map((word, i) => (
          <span key={i} className="overflow-hidden inline-block">
            <motion.span
              className="inline-block"
              variants={slideUp}
              custom={i}
              initial="initial"
              animate={isInView ? "open" : "closed"}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </p>
      {subText && (
        <motion.p
          variants={fade}
          initial="initial"
          animate={isInView ? "open" : "closed"}
          className="mt-4 text-sm text-(--muted)"
        >
          {subText}
        </motion.p>
      )}
    </div>
  );
}
