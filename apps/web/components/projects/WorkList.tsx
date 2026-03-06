"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Route } from "next";
import { projects, type Project } from "../../lib/projects";
import { gsap } from "../../lib/gsap";
import { motion } from "framer-motion";

const scaleAnim = {
  initial: { scale: 0, x: "-50%", y: "-50%" },
  enter: {
    scale: 1,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    scale: 0,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] },
  },
};

export function WorkList() {
  const [modal, setModal] = useState({ active: false, index: 0 });

  const modalEl = useRef<HTMLDivElement>(null);
  const cursorEl = useRef<HTMLDivElement>(null);
  const cursorLblEl = useRef<HTMLDivElement>(null);

  const xModal = useRef<gsap.QuickToFunc | null>(null);
  const yModal = useRef<gsap.QuickToFunc | null>(null);
  const xCur = useRef<gsap.QuickToFunc | null>(null);
  const yCur = useRef<gsap.QuickToFunc | null>(null);
  const xLbl = useRef<gsap.QuickToFunc | null>(null);
  const yLbl = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    xModal.current = gsap.quickTo(modalEl.current, "left", {
      duration: 0.8,
      ease: "power3",
    });
    yModal.current = gsap.quickTo(modalEl.current, "top", {
      duration: 0.8,
      ease: "power3",
    });
    xCur.current = gsap.quickTo(cursorEl.current, "left", {
      duration: 0.5,
      ease: "power3",
    });
    yCur.current = gsap.quickTo(cursorEl.current, "top", {
      duration: 0.5,
      ease: "power3",
    });
    xLbl.current = gsap.quickTo(cursorLblEl.current, "left", {
      duration: 0.45,
      ease: "power3",
    });
    yLbl.current = gsap.quickTo(cursorLblEl.current, "top", {
      duration: 0.45,
      ease: "power3",
    });
  }, []);

  const moveAll = (x: number, y: number) => {
    xModal.current?.(x);
    yModal.current?.(y);
    xCur.current?.(x);
    yCur.current?.(y);
    xLbl.current?.(x);
    yLbl.current?.(y);
  };

  const manage = (active: boolean, index: number, x: number, y: number) => {
    moveAll(x, y);
    setModal({ active, index });
  };

  return (
    <section
      className="relative px-4 sm:px-6 lg:px-8"
      onMouseMove={(e) => moveAll(e.clientX, e.clientY)}
    >
      <div className="mx-auto max-w-7xl divide-y divide-(--border)">
        {projects.map((p: Project, i: number) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}` as Route}
            onMouseEnter={(e) => manage(true, i, e.clientX, e.clientY)}
            onMouseLeave={(e) => manage(false, i, e.clientX, e.clientY)}
            className="group flex items-center justify-between gap-6 py-6 sm:py-8 md:cursor-none"
          >
            <div className="flex items-baseline gap-6">
              <span className="text-sm tabular-nums text-(--muted) min-w-[2rem]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-(--font-syne) text-2xl sm:text-3xl font-light tracking-tight group-hover:-translate-x-2 group-hover:opacity-50 transition-all duration-500">
                  {p.title}
                </h3>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs text-(--muted) border border-(--border) rounded-full px-2 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-sm text-(--muted) group-hover:translate-x-2 group-hover:opacity-50 transition-all duration-500 shrink-0">
              {p.year}
            </div>
          </Link>
        ))}
      </div>

      <motion.div
        ref={modalEl}
        variants={scaleAnim}
        initial="initial"
        animate={modal.active ? "enter" : "closed"}
        className="hidden md:block fixed z-50 pointer-events-none w-[340px] h-[230px] overflow-hidden rounded-2xl border border-(--border) bg-(--surface)/20 backdrop-blur-md shadow-2xl"
        style={{ top: "50%", left: "50%" }}
      >
        <div className="absolute inset-0 bg-white/10" />
        <div
          className="relative w-full transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{
            top: `${modal.index * -100}%`,
            height: `${projects.length * 100}%`,
          }}
        >
          {projects.map((p, i) => (
            <div
              key={i}
              className="relative w-full"
              style={{ height: `${100 / projects.length}%` }}
            >
              <Image
                fill
                alt={p.title}
                src={p.image}
                className="object-cover"
                sizes="340px"
              />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        ref={cursorEl}
        variants={scaleAnim}
        initial="initial"
        animate={modal.active ? "enter" : "closed"}
        className="hidden md:block fixed z-50 pointer-events-none w-16 h-16 rounded-full bg-(--accent)"
        style={{ top: "50%", left: "50%" }}
      />

      <motion.div
        ref={cursorLblEl}
        variants={scaleAnim}
        initial="initial"
        animate={modal.active ? "enter" : "closed"}
        className="hidden md:flex fixed z-50 pointer-events-none w-16 h-16 rounded-full items-center justify-center text-white text-xs font-medium"
        style={{ top: "50%", left: "50%" }}
      >
        View
      </motion.div>
    </section>
  );
}
