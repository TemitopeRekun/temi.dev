"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { slide, scale } from "./animations";
import type { Route } from "next";

interface Props {
  data: { title: string; href: string; index: number };
  isActive: boolean;
  setSelectedIndicator: (href: string) => void;
}

export function NavLink({ data, isActive, setSelectedIndicator }: Props) {
  const { title, href, index } = data;

  return (
    <motion.div
      className="group relative flex items-center pl-8"
      onMouseEnter={() => setSelectedIndicator(href)}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.div
        variants={scale}
        animate={isActive ? "open" : "closed"}
        className={[
          "absolute left-0 w-2.5 h-2.5 rounded-full",
          isActive ? "bg-(--accent)" : "bg-(--text)",
          "transition-colors duration-200 group-hover:bg-(--accent)",
        ].join(" ")}
      />
      <Link
        href={href as Route}
        className="text-[clamp(2rem,4vw,3.5rem)] font-light text-(--text) hover:text-(--accent) transition-colors duration-300"
      >
        {title}
      </Link>
    </motion.div>
  );
}
