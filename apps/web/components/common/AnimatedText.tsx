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

/**
 * Elements this can render as. Headings are included so a page can have a real
 * `<h1>`/`<h2>` that is also the animated, visible headline — rather than an
 * `sr-only` heading sitting beside an `aria-hidden` paragraph.
 */
type As = "div" | "p" | "h1" | "h2" | "h3" | "h4";

interface Props {
  phrase: string;
  className?: string;
  once?: boolean;
  /**
   * Skip the built-in screen-reader copy. Use only when a sibling element
   * already exposes the same text. Never combine with a heading `as` — the
   * heading would then have no accessible name.
   */
  decorative?: boolean;
  /** Defaults to `div`. Pass a heading tag to make this the page's heading. */
  as?: As;
}

export function AnimatedText({
  phrase,
  className = "",
  once = false,
  decorative = false,
  as: Tag = "div",
}: Props) {
  // The ref sits on the inner visual layer rather than the outer tag: it needs
  // to be an element for in-view detection, and this keeps `Tag` free of the
  // ref-type gymnastics a polymorphic outer ref would require.
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: "0px 0px -80px 0px" });
  const words = phrase.split(" ");

  return (
    <Tag className={className}>
      {/*
        The animation splits the phrase into per-word masks. Real space elements
        sit between the words (not a CSS gap) so the rendered text keeps its
        spaces — copy/paste and text extraction read it correctly. This layer is
        aria-hidden; assistive tech uses the sr-only copy below (or a sibling
        element's text when `decorative`).

        A span, not a paragraph: this component can render as a heading, and a
        <p> inside an <h2> is invalid markup.
      */}
      <span ref={ref} aria-hidden="true" className="flex flex-wrap">
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
            {i < words.length - 1 && <span className="whitespace-pre"> </span>}
          </Fragment>
        ))}
      </span>
      {!decorative && <span className="sr-only">{phrase}</span>}
    </Tag>
  );
}
