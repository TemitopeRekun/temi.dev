"use client";
import { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useQuery } from "@tanstack/react-query";
import { Container, MagneticWrapper, RevealOnScroll, WarmCard } from "@temi/ui";
import { type Project } from "../../lib/projects";
import { gsap, registerGSAP } from "../../lib/gsap";

export function FeaturedCarousel() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { data: dbProjects = [] } = useQuery({
    queryKey: ["public-projects"],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
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

  const featuredProjects = useMemo(() => {
    return dbProjects
      .map((p: any) => ({
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
      }))
      .filter((p: Project) => p.featured);
  }, [dbProjects]);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    const run = async () => {
      await registerGSAP();
      const section = sectionRef.current;
      if (!section) return;
      
      // Wait for projects to load
      if (featuredProjects.length === 0) return;

      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".featured-work-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
            },
          },
        );
      }, section);
      cleanup = () => ctx.revert();
    };
    void run();
    return () => cleanup?.();
  }, [featuredProjects.length]);

  if (featuredProjects.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="work"
      className="bg-(--bg) py-16 sm:py-20 lg:py-28"
    >
      <Container>
        <RevealOnScroll>
          <div className="mb-8 md:mb-10">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-(--accent)">
              Selected Work
            </p>
            <h2 className="font-(family-name:--font-fraunces) text-4xl font-semibold md:text-5xl">
              Things I&apos;ve Built
            </h2>
          </div>
        </RevealOnScroll>

        <div className="-mx-4 overflow-x-auto px-4 pb-3 md:-mx-6 md:px-6">
          <ul className="flex snap-x snap-mandatory gap-5">
            {featuredProjects.map((project: Project) => (
              <li
                key={project.slug}
                className="featured-work-card w-[86%] shrink-0 snap-start md:w-[52%] lg:w-[38%]"
              >
                <WarmCard
                  as="article"
                  padding="p-4 md:p-5"
                  className="rounded-3xl"
                >
                  <div className="relative mb-4 aspect-16/10 overflow-hidden rounded-2xl border border-(--border)">
                    <Image
                      src={project.image || `https://picsum.photos/seed/${project.slug}/800/600`}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 86vw, (max-width: 1024px) 52vw, 38vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-[0.2em] text-(--muted)">
                      {project.category}
                    </span>
                    <span className="text-xs text-(--muted)">
                      {project.year}
                    </span>
                  </div>
                  <h3 className="mt-2 font-(family-name:--font-fraunces) text-2xl font-semibold">
                    {project.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-(--muted)">
                    {project.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <MagneticWrapper>
                      <Link
                        href={`/work/${project.slug}` as Route}
                        className="inline-flex rounded-full border border-(--border) px-4 py-2 text-xs uppercase tracking-[0.12em] text-(--text) hover:border-(--border-hover) hover:bg-(--surface2) transition-colors"
                      >
                        View Case Study
                      </Link>
                    </MagneticWrapper>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs uppercase tracking-[0.12em] text-(--accent)"
                      >
                        Live
                      </a>
                    )}
                  </div>
                </WarmCard>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
