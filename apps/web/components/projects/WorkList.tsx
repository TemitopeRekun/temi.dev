"use client";
import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { useQuery } from "@tanstack/react-query";
import { gsap } from "../../lib/gsap";
import { motion } from "framer-motion";

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

import type { Project, RawProject } from "../../lib/projects";

export function WorkList({ initialProjects }: { initialProjects?: Project[] }) {
  const { data: dbProjects = [] } = useQuery({
    queryKey: ["public-projects"],
    queryFn: async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
      const res = await fetch(`${baseUrl}/api/projects`);
      if (!res.ok) return [];
      return await res.json();
    },
    initialData: initialProjects,
    staleTime: 60 * 1000,
  });

  const projects = useMemo<Project[]>(() => {
    return (dbProjects as RawProject[])
      .map(
        (p): Project => ({
          id: p.id,
          slug: p.slug || p.id,
          title: p.title,
          year:
            p.year ||
            (p.createdAt
              ? new Date(p.createdAt).getFullYear()
              : new Date().getFullYear()),
          category: p.category || "Other",
          tags: p.techStack || [],
          description: p.description || "",
          body: p.body || "",
          image: p.coverImage || (p as unknown as { image?: string }).image || "",
          liveUrl: p.liveUrl || "",
          repoUrl: p.repoUrl || "",
          featured: p.featured || false,
          order: p.order || 0,
        }),
      )
      .sort((a, b) => a.order - b.order);
  }, [dbProjects]);

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
      className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
      onMouseMove={(e) => moveAll(e.clientX, e.clientY)}
    >
      <div className="divide-y divide-(--border)">
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}` as Route}
            prefetch={true}
            onMouseEnter={(e) => manage(true, i, e.clientX, e.clientY)}
            onMouseLeave={(e) => manage(false, i, e.clientX, e.clientY)}
            className="group flex items-center justify-between gap-6 py-6 sm:py-8 md:cursor-none"
          >
            <div className="flex items-baseline gap-6">
              <span className="text-sm tabular-nums text-(--muted) min-w-[2rem]">
                0{i + 1}
              </span>
              <h2 className="text-2xl font-medium transition-colors group-hover:text-(--muted) sm:text-3xl lg:text-4xl">
                {p.title}
              </h2>
            </div>
            <span className="text-sm tabular-nums text-(--muted)">
              {p.year}
            </span>
          </Link>
        ))}
      </div>

      <motion.div
        ref={modalEl}
        variants={scaleAnim}
        initial="initial"
        animate={modal.active ? "enter" : "closed"}
        className="pointer-events-none fixed left-0 top-0 z-[50] hidden h-[300px] w-[400px] overflow-hidden rounded-2xl bg-(--surface) md:block"
      >
        <div
          style={{ top: modal.index * -100 + "%" }}
          className="relative h-full w-full transition-[top] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
        >
          {projects.map((p, index) => (
            <div
              key={`modal_${index}`}
              className="flex h-full w-full items-center justify-center bg-(--surface)"
            >
              <Image
                src={p.image || `/work/${p.slug}/og`}
                width={400}
                height={300}
                alt={p.title}
                className="h-auto w-full object-cover"
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
        className="pointer-events-none fixed left-0 top-0 z-[50] hidden h-20 w-20 items-center justify-center rounded-full bg-(--accent) text-white md:flex"
      />
      <motion.div
        ref={cursorLblEl}
        variants={scaleAnim}
        initial="initial"
        animate={modal.active ? "enter" : "closed"}
        className="pointer-events-none fixed left-0 top-0 z-50 hidden h-20 w-20 items-center justify-center bg-transparent text-sm font-medium text-white md:flex"
      >
        View
      </motion.div>
    </section>
  );
}
