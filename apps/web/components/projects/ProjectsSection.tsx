"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { useQuery } from "@tanstack/react-query";
import { Container, RevealOnScroll, Section, StaggerReveal } from "@temi/ui";
import { type Project, type ProjectCategory } from "../../lib/projects";
import { gsap, registerGSAP } from "../../lib/gsap";
import { TextReveal } from "../common/TextReveal";

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

function ProjectCard({ project }: { project: Project }) {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const hoverTl = useRef<gsap.core.Timeline | null>(null);
  const init = useRef(false);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    const run = async () => {
      await registerGSAP();
      const img = imgRef.current;
      const ov = overlayRef.current;
      if (!img || !ov) return;
      const ctx = gsap.context(() => {
        gsap.set(img, { scale: 1 });
        gsap.set(ov, { opacity: 0 });
        img.style.willChange = "transform";
        ov.style.willChange = "opacity";
        hoverTl.current = gsap
          .timeline({
            paused: true,
            defaults: { duration: 0.4, ease: "power3.out" },
          })
          .to(img, { scale: 1.06 }, 0)
          .to(ov, { opacity: 1 }, 0);
        init.current = true;
      });
      cleanup = () => ctx.revert();
    };
    run();
    return () => {
      hoverTl.current?.kill();
      hoverTl.current = null;
      cleanup?.();
    };
  }, []);

  const onEnter = () => {
    if (!init.current) return;
    hoverTl.current?.play();
  };
  const onLeave = () => {
    if (!init.current) return;
    hoverTl.current?.reverse();
  };

  return (
    <div
      className="group overflow-hidden rounded-2xl border border-(--border,rgba(0,0,0,0.08)) bg-(--surface)"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <div ref={imgRef} className="h-full w-full">
          <Image
            src={
              project.image ||
              `https://picsum.photos/seed/${project.slug}/1200/800`
            }
            alt={project.title}
            width={1200}
            height={800}
            className="h-full w-full object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        </div>
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 flex items-end bg-(--glass-bg)/0 p-4 transition-colors"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)",
          }}
        >
          <p className="line-clamp-3 text-sm text-(--text)/90">
            {project.description}
          </p>
        </div>
      </div>
      <div className="flex items-start justify-between gap-4 p-4">
        <div>
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.tags.map((t: string) => (
              <span
                key={t}
                className="rounded-full border border-(--border,rgba(0,0,0,0.08)) bg-(--surface) px-2.5 py-1 text-xs text-(--muted)"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {project.liveUrl && (
            <Link
              href={project.liveUrl as never}
              className="text-sm text-(--text) underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Live
            </Link>
          )}
          {project.liveUrl && project.repoUrl && (
            <span className="text-(--muted)">·</span>
          )}
          {project.repoUrl && (
            <Link
              href={project.repoUrl as never}
              className="text-sm text-(--text) underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Repo
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const [active, setActive] = useState<Filter>("All");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);
  const { setIndicatorRef, update } = useSlidingIndicator(
    containerRef,
    activeBtnRef,
  );

  const { data: dbProjects = [] } = useQuery({
    queryKey: ["public-projects"],
    queryFn: async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
      try {
        const res = await fetch(`${baseUrl}/api/projects`);
        if (!res.ok) return [];
        return await res.json();
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        return [];
      }
    },
  });

  const displayProjects = useMemo(() => {
    return dbProjects.map((p: any) => ({
      id: p.id,
      slug: p.slug || p.id,
      title: p.title,
      year: p.year || new Date(p.createdAt).getFullYear(),
      category: p.category || "Other",
      tags: p.techStack || [],
      description: p.description,
      image: p.coverImage || "",
      liveUrl: p.liveUrl || "",
      repoUrl: p.repoUrl || "",
      featured: p.featured,
      order: p.order,
    }));
  }, [dbProjects]);

  const filtered: Project[] = useMemo(() => {
    if (active === "All") return displayProjects;
    return displayProjects.filter((p: Project) => p.category === active);
  }, [active, displayProjects]);

  useEffect(() => {
    void registerGSAP();
    update();
  }, [active, update]);

  return (
    <Section id="work" className="relative bg-(--bg) py-24 lg:py-32">
      {/* Distinct background for projects section */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.05] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] dark:opacity-[0.03]" />
      <Container className="relative z-10">
        <RevealOnScroll>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-(--accent)">
                <TextReveal text="Selected Works" type="chars" />
              </div>
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                <TextReveal text="Recent Projects" type="chars" delay={0.2} />
              </h2>
            </div>
            <Link
              href={"/work" as Route}
              className="hidden text-sm font-medium text-(--text) underline-offset-4 hover:underline sm:block"
            >
              View all work →
            </Link>
          </div>
        </RevealOnScroll>

        <div className="mb-12">
          <div
            ref={containerRef}
            className="relative inline-flex rounded-full border border-(--border,rgba(0,0,0,0.08)) bg-(--surface) p-1"
          >
            <span
              ref={setIndicatorRef}
              className="pointer-events-none absolute inset-y-1 left-0 z-0 rounded-full bg-(--bg)"
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

        <StaggerReveal className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </StaggerReveal>

        <div className="mt-6 flex justify-end">
          <Link
            href={"/work" as Route}
            className="text-sm text-(--text) underline-offset-4 hover:underline"
          >
            View all work →
          </Link>
        </div>
      </Container>
    </Section>
  );
}
