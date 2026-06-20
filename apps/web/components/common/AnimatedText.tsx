"use client";
import { Fragment, useRef } from "react";
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
  /**
   * Skip the built-in screen-reader copy. Use on pages that already render an
   * accessible heading (e.g. an `sr-only <h1>`) with the same text, to avoid
   * the phrase being announced twice.
   */
  decorative?: boolean;
}

export function AnimatedText({
  phrase,
  subText,
  className = "",
  once = false,
  decorative = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "0px 0px -80px 0px" });
  const words = phrase.split(" ");

  return (
    <div ref={ref} className={className}>
      {/*
        The animation splits the phrase into per-word masks. Real space
        elements sit between the words (not a CSS gap) so the rendered text
        keeps its spaces — copy/paste, SEO and text extraction all read it
        correctly. The visual layer is aria-hidden; assistive tech uses the
        sr-only copy (or the page's own heading when `decorative`).
      */}
      <p aria-hidden="true" className="flex flex-wrap">
        {words.map((word, i) => (
          <Fragment key={i}>
            <span className="overflow-hidden inline-block">
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
            {i < words.length - 1 && (
              <span className="whitespace-pre"> </span>
            )}
          </Fragment>
        ))}
      </p>
      {!decorative && <span className="sr-only">{phrase}</span>}
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
