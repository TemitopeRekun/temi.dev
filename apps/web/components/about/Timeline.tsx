"use client";
import { useEffect, useRef } from "react";
import { gsap, registerGSAP } from "../../lib/gsap";
import { RevealOnScroll } from "@temi/ui";
import { motion, useScroll, useTransform } from "framer-motion";

const TIMELINE = [
  {
    year: "2019",
    title: "The Spark",
    role: "Freelance Developer",
    description:
      "Started my journey building custom WordPress themes and static sites for local businesses. This taught me the fundamentals of the web, client communication, and the importance of shipping.",
    tech: ["HTML/CSS", "JavaScript", "PHP", "WordPress"],
  },
  {
    year: "2020",
    title: "Deep Dive into Systems",
    role: "Junior Full-Stack Engineer",
    description:
      "Joined a fintech startup where I transitioned to TypeScript and Node.js. Built my first microservices and learned about database design, caching strategies, and API security.",
    tech: ["TypeScript", "Node.js", "PostgreSQL", "Redis"],
  },
  {
    year: "2022",
    title: "Scaling Up",
    role: "Senior Frontend Engineer",
    description:
      "Led the migration of a monolithic frontend to a Next.js architecture. Focused on performance optimization, design systems, and improving developer experience for a team of 10.",
    tech: ["Next.js", "React", "Tailwind CSS", "Storybook"],
  },
  {
    year: "2024",
    title: "The AI Revolution",
    role: "AI Engineer & Consultant",
    description:
      "Shifted focus to integrating LLMs into production workflows. Building RAG pipelines, autonomous agents, and AI-powered interfaces that solve real business problems.",
    tech: ["Python", "LangChain", "OpenAI", "Vector DBs"],
  },
  {
    year: "Now",
    title: "Building the Future",
    role: "Independent Consultant",
    description:
      "Helping companies build AI-native products. Combining deep technical expertise with product thinking to deliver scalable, high-impact solutions.",
    tech: ["AI Agents", "System Design", "Product Strategy"],
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
