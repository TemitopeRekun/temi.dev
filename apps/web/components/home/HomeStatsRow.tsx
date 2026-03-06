"use client";
import { useEffect, useRef, useState } from "react";
import { Container, Grid, RevealOnScroll, WarmCard } from "@temi/ui";
import { Briefcase, Code2, Cpu } from "lucide-react";
import { TextReveal } from "../common/TextReveal";

const NUMERIC_STATS = [
  { value: 5, suffix: "+", label: "Years Experience", icon: Briefcase },
  { value: 20, suffix: "+", label: "Projects Delivered", icon: Code2 },
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
      className="relative z-10 py-16 sm:py-24 border-y border-(--border)/50 bg-(--surface)/30 backdrop-blur-sm"
    >
      <Container>
        <Grid cols={1} md={3} gap="gap-8 md:gap-12" className="divide-y md:divide-y-0 md:divide-x divide-(--border)/50">
          <RevealOnScroll>
            <div className="flex flex-col items-center justify-center p-6 text-center md:items-start md:text-left">
              <Briefcase className="mb-6 h-10 w-10 text-(--accent) opacity-80" />
              <div className="text-6xl font-(family-name:--font-fraunces) font-bold tracking-tight text-(--text)">
                {counts[0]}
                <span className="text-(--accent)">{NUMERIC_STATS[0].suffix}</span>
              </div>
              <div className="mt-3 text-sm font-medium uppercase tracking-[0.15em] text-(--muted)">
                <TextReveal text={NUMERIC_STATS[0].label} type="chars" delay={0.3} />
              </div>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="flex flex-col items-center justify-center p-6 text-center md:items-start md:text-left">
              <Code2 className="mb-6 h-10 w-10 text-(--accent) opacity-80" />
              <div className="text-6xl font-(family-name:--font-fraunces) font-bold tracking-tight text-(--text)">
                {counts[1]}
                <span className="text-(--accent)">{NUMERIC_STATS[1].suffix}</span>
              </div>
              <div className="mt-3 text-sm font-medium uppercase tracking-[0.15em] text-(--muted)">
                <TextReveal text={NUMERIC_STATS[1].label} type="chars" delay={0.4} />
              </div>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <div className="flex flex-col items-center justify-center p-6 text-center md:items-start md:text-left">
              <Cpu className="mb-6 h-10 w-10 text-(--accent) opacity-80" />
              <div className="text-6xl font-(family-name:--font-fraunces) font-bold tracking-tight text-(--text)">
                <TextReveal text="AI" type="chars" delay={0.4} />
              </div>
              <div className="mt-3 text-sm font-medium uppercase tracking-[0.15em] text-(--muted)">
                <TextReveal text="First Approach" type="chars" delay={0.5} />
              </div>
            </div>
          </RevealOnScroll>
        </Grid>
      </Container>
    </section>
  );
}
