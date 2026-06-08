"use client";
import { useEffect, useRef } from "react";
import { registerGSAP } from "../../lib/gsap";
import { RevealOnScroll } from "@temi/ui";
import { motion, useScroll, useTransform } from "framer-motion";

const TIMELINE = [
  {
    year: "2020",
    period: "2020",
    title: "Lagos, the beginning",
    role: "Self-taught Developer",
    description:
      "Started with tutorials, moved to documentation, then just started building things. Some worked. Most didn't. That gap between 'I understand this' and 'I can actually ship this' — closing it took about two years of building things nobody asked for.",
    tech: ["HTML", "CSS", "JavaScript"],
  },
  {
    year: "2022",
    period: "Jan 2022 – May 2024",
    title: "First product, first real stakes",
    role: "Web Developer · Talent Group Services · Remote (Bedford, UK)",
    description:
      "Hired as the only developer at a cleaning agency in Bedford. I built their booking platform from scratch — it scaled to 300 monthly active users and eliminated 40% of their manual scheduling overhead. First time I owned a product end to end: the architecture decisions, the 2am incidents, the performance bottlenecks nobody warned you about. Bedford taught me that there's a version of 'it works' that's actually just 'it hasn't broken yet.'",
    tech: ["TypeScript", "Node.js", "PostgreSQL", "REST APIs"],
  },
  {
    year: "2024",
    period: "Jun 2024 – Dec 2024",
    title: "Crossing into Europe",
    role: "Full-Stack Developer · Martínez & Company · Remote (Spain)",
    description:
      "Built a GDPR-compliant platform for a European grant consultancy — analytics, lead capture, the full stack. Delivered it. Then the CTO referred me directly to a SaaS engineering team in Palma. That referral said more about the work than I could.",
    tech: ["Next.js", "TypeScript", "GDPR compliance", "Analytics"],
  },
  {
    year: "2025",
    period: "Jan 2025 – Present",
    title: "Production-grade complexity",
    role: "Full-Stack Developer · ADP Digitek (AINVID Coding S.L.) · Remote (Palma, Spain)",
    description:
      "Engineering team for Multifactu — a fiscal-compliance invoicing platform for Spanish SMEs. TypeScript monorepo, NestJS, PostgreSQL, Docker, Playwright. I work on the signed XML generation that has to satisfy Spanish tax authority standards, and the OpenAPI contracts that keep the whole stack honest. This is software that processes legally binding documents for real businesses. The bar isn't 'does it work.' The bar is 'can you prove it.'",
    tech: ["TypeScript", "Next.js", "NestJS", "PostgreSQL", "Docker", "Playwright"],
  },
  {
    year: "2026",
    period: "2026 – Present",
    title: "Bica Driver",
    role: "Frontend Engineer · Bica Driver",
    description:
      "Alongside ADP Digitek, I joined the team building Bica Driver — a real-time ride-sharing PWA with native mobile via Capacitor. I own the real-time layer: namespaced Socket.io for driver, owner, and admin roles, the payment state machine, the offline-first connectivity, Firebase push notifications. The interesting problem here isn't the features — it's that everything has to work when the network doesn't.",
    tech: ["React", "TypeScript", "Socket.io", "Capacitor", "Zustand"],
  },
  {
    year: "Now",
    period: "",
    title: "Looking for what's next",
    role: "Open to remote mid-level roles",
    description:
      "I'm looking for a remote full-stack or backend role at a company that ships real software to real users — ideally somewhere the engineering culture has opinions about how things should be built, not just whether they ship. If that sounds like where you work, I'd like to talk.",
    tech: ["TypeScript", "Next.js", "NestJS", "PostgreSQL", "Docker"],
  },
];

function TimelineItem({
  item,
  index,
}: {
  item: (typeof TIMELINE)[0];
  index: number;
}) {
  const isEven = index % 2 === 0;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const activeOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1]);
  const activeScale = useTransform(scrollYProgress, [0.6, 1], [0.8, 1.2]);

  return (
    <div
      ref={ref}
      className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${
        isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Year Marker (Center on Desktop, Left on Mobile) */}
      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 z-10 top-0">
        {/* Base Circle (Default State) */}
        <div className="absolute inset-0 rounded-full bg-(--surface) border border-(--border) shadow-sm flex items-center justify-center transition-opacity duration-300">
          <span className="text-xs font-bold text-(--accent)">{item.year}</span>
        </div>

        {/* Active Glow Overlay (Animated) */}
        <motion.div
          style={{ opacity: activeOpacity, scale: activeScale }}
          className="absolute inset-0 rounded-full bg-(--accent) flex items-center justify-center border border-(--accent)"
        >
          {/* Glow Effect Layer */}
          <div className="absolute inset-0 rounded-full bg-(--accent) blur-md opacity-50" />
          <span className="relative z-10 text-xs font-bold text-black">
            {item.year}
          </span>
        </motion.div>
      </div>

      {/* Content Side */}
      <div className="pl-20 md:px-12 md:w-1/2 pt-1 md:pt-0">
        <RevealOnScroll>
          <div className={`relative ${!isEven ? "md:text-right" : ""}`}>
            <span className="text-sm font-medium text-(--accent) uppercase tracking-wider mb-1 block">
              {item.role}
            </span>
            {item.period && (
              <span className="text-xs text-(--muted) tracking-wide mb-3 block">
                {item.period}
              </span>
            )}
            <h3 className="text-xl sm:text-2xl font-semibold text-(--text) mb-4">
              {item.title}
            </h3>
            <p className="text-(--muted) leading-relaxed mb-6">
              {item.description}
            </p>
            <div className={`flex flex-wrap gap-2 ${!isEven ? "md:justify-end" : ""}`}>
              {item.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-xs rounded-full bg-(--surface) border border-(--border) text-(--muted)"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>

      {/* Empty Side for Balance */}
      <div className="hidden md:block md:w-1/2" />
    </div>
  );
}

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const run = async () => {
      await registerGSAP();
    };
    run();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative max-w-4xl mx-auto px-4 sm:px-6 md:px-0"
    >
      {/* Central Line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-(--border) -translate-x-1/2" />

      <div className="space-y-16 md:space-y-24">
        {TIMELINE.map((item, index) => (
          <TimelineItem key={item.year} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
