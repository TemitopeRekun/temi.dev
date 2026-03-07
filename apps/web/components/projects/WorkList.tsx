"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import {
  projects,
  type Project,
  type ProjectCategory,
} from "../../lib/projects";
import { gsap } from "../../lib/gsap";
import { motion } from "framer-motion";

type Filter = "All" | ProjectCategory;
const FILTERS: Filter[] = ["All", "Frontend", "Backend", "AI", "Mobile"];

function useSlidingIndicator(
  containerRef: React.RefObject<HTMLDivElement | null>,
  activeBtnRef: React.RefObject<HTMLButtonElement | null>,
) {
  const xTo = useRef<((v: number) => void) | null>(null);
  const wTo = useRef<((v: number) => void) | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);

  const setIndicatorRef = useCallback((el: HTMLSpanElement | null) => {
    indicatorRef.current = el;
  }, []);

  const update = useCallback(() => {
    const container = containerRef.current;
    const btn = activeBtnRef.current;
    const indicator = indicatorRef.current;
    if (!container || !btn || !indicator) return;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    const left = bRect.left - cRect.left;
    const width = bRect.width;
    if (!xTo.current || !wTo.current) {
      xTo.current = gsap.quickTo(indicator, "x", {
        duration: 0.4,
        ease: "power3.out",
      });
      wTo.current = gsap.quickTo(indicator, "width", {
        duration: 0.4,
        ease: "power3.out",
      });
    }
    xTo.current?.(left);
    wTo.current?.(width);
  }, [activeBtnRef, containerRef]);

  useEffect(() => {
    const onResize = () => update();
    window.addEventListener("resize", onResize);
    update();
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [update]);

  return { setIndicatorRef, update };
}

const scaleAnim = {
  initial: { scale: 0, x: "-50%", y: "-50%" },
  enter: {
    scale: 1,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] as const },
  },
  closed: {
    scale: 0,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] as const },
  },
};

export function WorkList() {
  const [active, setActive] = useState<Filter>("All");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);
  const { setIndicatorRef, update } = useSlidingIndicator(
    containerRef,
    activeBtnRef,
  );

  const filtered = useMemo(() => {
    if (active === "All") return projects;
    return projects.filter((p) => p.category === active);
  }, [active]);

  useEffect(() => {
    update();
  }, [active, update]);

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
      <div className="mb-12 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
        <div
          ref={containerRef}
          className="relative inline-flex rounded-full border border-(--border,rgba(0,0,0,0.08)) bg-(--surface) p-1 min-w-max"
        >
          <span
            ref={setIndicatorRef}
            className="pointer-events-none absolute inset-y-1 left-0 z-0 rounded-full bg-(--bg) shadow-sm"
            style={{ width: 0, transform: "translateX(0px)" }}
          />
          {FILTERS.map((f) => {
            const isActive = active === f;
            const setRef = (el: HTMLButtonElement | null) => {
              if (isActive) activeBtnRef.current = el;
            };
            return (
              <button
                key={f}
                ref={setRef}
                type="button"
                onClick={() => setActive(f)}
                className={[
                  "relative z-10 rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  isActive ? "text-(--text)" : "text-(--muted)",
                ].join(" ")}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl divide-y divide-(--border)">
        {filtered.map((p: Project, i: number) => (
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
