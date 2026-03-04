"use client";
import { useEffect, useRef, useState } from "react";
import { Container, Grid, RevealOnScroll, WarmCard } from "@temi/ui";

const NUMERIC_STATS = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 20, suffix: "+", label: "Projects Delivered" },
] as const;

export function HomeStatsRow() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState<number[]>([0, 0]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let rafId = 0;
    const duration = 1200;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCounts(NUMERIC_STATS.map((stat) => Math.floor(stat.value * progress)));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="bg-(--bg) py-16 sm:py-20 lg:py-28"
    >
      <Container>
        <Grid cols={1} md={3} gap="gap-6 md:gap-8">
          <RevealOnScroll>
            <WarmCard className="rounded-2xl">
              <div className="text-5xl font-(family-name:--font-fraunces) font-semibold text-(--accent)">
                {counts[0]}
                {NUMERIC_STATS[0].suffix}
              </div>
              <div className="mt-1 text-sm text-(--muted)">
                {NUMERIC_STATS[0].label}
              </div>
            </WarmCard>
          </RevealOnScroll>
          <RevealOnScroll>
            <WarmCard className="rounded-2xl">
              <div className="text-5xl font-(family-name:--font-fraunces) font-semibold text-(--accent)">
                {counts[1]}
                {NUMERIC_STATS[1].suffix}
              </div>
              <div className="mt-1 text-sm text-(--muted)">
                {NUMERIC_STATS[1].label}
              </div>
            </WarmCard>
          </RevealOnScroll>
          <RevealOnScroll>
            <WarmCard className="rounded-2xl">
              <div className="text-5xl font-(family-name:--font-fraunces) font-semibold text-(--accent)">
                AI-First
              </div>
              <div className="mt-1 text-sm text-(--muted)">
                Development Approach
              </div>
            </WarmCard>
          </RevealOnScroll>
        </Grid>
      </Container>
    </section>
  );
}
