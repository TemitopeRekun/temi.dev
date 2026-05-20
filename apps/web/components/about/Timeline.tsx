"use client";
import { useEffect, useRef } from "react";
import { gsap, registerGSAP } from "../../lib/gsap";
import { RevealOnScroll } from "@temi/ui";
import { motion, useScroll, useTransform } from "framer-motion";

const TIMELINE = [
  {
    year: "2019",
    title: "Lagos, the beginning",
    role: "Self-taught Developer",
    description:
      "Pieced it together from whatever was available online. Started with tutorials, then documentation, then building things just to see if I could. Turns out I could.",
    tech: ["HTML", "CSS", "JavaScript"],
  },
  {
    year: "2021",
    title: "First product, first real stakes",
    role: "Sole Developer — Talent Group Services, UK",
    description:
      "Hired as the only developer at a cleaning agency in Bedford. Built their booking platform from scratch — it scaled to 300 monthly active users and cut 40% of the team's manual scheduling work. That's where I learned what it means to own a product end to end: architecture decisions, production incidents, performance bottlenecks, all of it.",
    tech: ["TypeScript", "Node.js", "PostgreSQL", "REST APIs"],
  },
  {
    year: "2022",
    title: "Crossing into Europe",
    role: "Developer — Martínez & Company, Spain",
    description:
      "Built a GDPR-compliant website for a European grant consultancy, then wired up analytics and lead capture tooling that actually moved numbers. The quality of the work got me a direct referral to a SaaS company.",
    tech: ["Next.js", "TypeScript", "GDPR compliance", "Analytics"],
  },
  {
    year: "2023",
    title: "Production-grade complexity",
    role: "Full-Stack Engineer — ADP Digitek, Spain",
    description:
      "Joined the engineering team on Multifactu — a fiscal-compliance invoicing platform for Spanish SMEs. TypeScript monorepo: Next.js 14, NestJS, PostgreSQL. Worked on signed XML generation that satisfies Spanish tax authority standards, OpenAPI documentation, Docker-based CI/CD, and Playwright test suites.",
    tech: ["TypeScript", "Next.js 14", "NestJS", "PostgreSQL", "Docker", "Playwright"],
  },
  {
    year: "2026",
    title: "Building in real-time",
    role: "Frontend Engineer — Bica Driver",
    description:
      "Working on a real-time ride-sharing PWA with native mobile capabilities via Capacitor. Namespaced Socket.io for driver, owner, and admin roles. Built the payment state machine, car verification flow, offline-first connectivity layer, and Firebase push notifications.",
    tech: ["React", "TypeScript", "Socket.io", "Capacitor", "Zustand"],
  },
  {
    year: "Now",
    title: "Looking for what's next",
    role: "Open to remote mid-level roles",
    description:
      "I'm looking for a remote full-stack or backend role — somewhere with a strong engineering culture where the work is real and the expectations are high. If that sounds like where you work, I'd like to hear about it.",
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
            <span className="text-sm font-medium text-(--accent) uppercase tracking-wider mb-2 block">
              {item.role}
            </span>
            <h3 className="text-2xl font-semibold text-(--text) mb-4">
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
