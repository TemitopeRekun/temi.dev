"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import type { Route } from "next";
import { projects, type Project } from "../../lib/projects";
import { gsap, registerGSAP } from "../../lib/gsap";

export function WorkList() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);
  const oTo = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    void registerGSAP();
    const overlay = overlayRef.current;
    if (!overlay) return;
    overlay.style.willChange = "transform, opacity";
    xTo.current = gsap.quickTo(overlay, "x", {
      duration: 0.24,
      ease: "power3.out",
    });
    yTo.current = gsap.quickTo(overlay, "y", {
      duration: 0.24,
      ease: "power3.out",
    });
    oTo.current = gsap.quickTo(overlay, "opacity", {
      duration: 0.18,
      ease: "power2.out",
    });
    return () => {
      overlay.style.willChange = "";
    };
  }, []);

  const rows = useMemo<Array<Project & { index: number }>>(() => {
    return projects.map((p: Project, i: number) => ({ ...p, index: i + 1 }));
  }, []);

  const handleEnter = (src: string) => {
    const overlay = overlayRef.current;
    const img = imgRef.current;
    if (!overlay || !img) return;
    img.src = src;
    oTo.current?.(1);
  };
  const handleMove = (e: React.MouseEvent) => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const x = e.clientX + 12;
    const y = e.clientY + 12;
    xTo.current?.(x);
    yTo.current?.(y);
  };
  const handleLeave = () => {
    oTo.current?.(0);
  };

  return (
    <div className="relative">
      <div
        ref={overlayRef}
        className="pointer-events-none fixed left-0 top-0 z-30 -translate-x-1/2 -translate-y-1/2 opacity-0"
        aria-hidden
      >
        <div className="overflow-hidden rounded-xl border border-(--border,rgba(0,0,0,0.08)) shadow-sm">
          <Image
            ref={imgRef}
            src={rows[0]?.image ?? "https://picsum.photos/seed/preview/800/600"}
            alt=""
            width={320}
            height={220}
            className="h-[220px] w-[320px] object-cover"
            sizes="320px"
            priority={false}
          />
        </div>
      </div>

      <div className="divide-y divide-(--border,rgba(0,0,0,0.08))">
        {rows.map((p) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}` as Route}
            className="group flex items-center justify-between gap-6 py-5 transition-colors hover:bg-(--surface)/40"
            onMouseEnter={() => handleEnter(p.image)}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
          >
            <div className="flex items-baseline gap-6">
              <div className="min-w-14 text-sm tabular-nums text-(--muted)">
                {String(p.index).padStart(2, "0")}
              </div>
              <div>
                <div className="text-xl font-semibold tracking-tight group-hover:underline">
                  {p.title}
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {p.tags.map((t: string) => (
                    <span
                      key={t}
                      className="rounded-full border border-(--border,rgba(0,0,0,0.08)) bg-(--surface) px-2 py-0.5 text-xs text-(--muted)"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-sm text-(--muted)">{p.year}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
