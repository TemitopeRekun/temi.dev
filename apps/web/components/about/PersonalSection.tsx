"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Camera, Bike, BookOpen } from "lucide-react";
import { RevealOnScroll } from "@temi/ui";

const HOBBIES = [
  {
    title: "Photography",
    description:
      "Street scenes and architecture, mostly. I like noticing the light other people walk past.",
    icon: Camera,
    rotation: -2,
  },
  {
    title: "Cycling",
    description:
      "Long rides around Lagos. It's where I do my best thinking — most of my hardest problems get solved away from the keyboard.",
    icon: Bike,
    rotation: 3,
  },
  {
    title: "Reading",
    description:
      "Sci-fi, philosophy, and technical deep dives. Constant input keeps the output sharp.",
    icon: BookOpen,
    rotation: -1,
  },
];

export function PersonalSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div ref={containerRef} className="relative py-24 overflow-hidden">
      <div className="mb-16 max-w-2xl">
        <RevealOnScroll>
          <h2 className="text-2xl sm:text-3xl font-semibold text-(--text) mb-6">
            Beyond the Code
          </h2>
          <p className="text-base sm:text-lg text-(--muted) leading-relaxed">
            When I'm not writing code, I'm usually cycling around Lagos, reading
            sci-fi, or taking photos of things that catch my eye — mostly
            architecture and street scenes. The cycling especially. Long rides
            are where I do my best thinking.
          </p>
        </RevealOnScroll>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {HOBBIES.map((hobby, index) => {
          const Icon = hobby.icon;
          return (
            <motion.div
              key={hobby.title}
              style={{
                rotate: hobby.rotation,
                y: index % 2 === 0 ? y : 0, // Parallax effect on alternating items
              }}
              className="group relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-(--border) bg-(--surface) shadow-lg transition-transform duration-500 group-hover:scale-[1.02]">
                {/* Accent gradient wash */}
                <div className="absolute inset-0 bg-linear-to-br from-(--accent)/10 via-transparent to-(--accent2)/10" />
                {/* Soft accent glow */}
                <div
                  className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-(--accent) opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
                  aria-hidden="true"
                />
                {/* Dot pattern */}
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, var(--text) 1px, transparent 0)",
                    backgroundSize: "28px 28px",
                  }}
                  aria-hidden="true"
                />

                <div className="relative flex h-full flex-col justify-between p-8">
                  <Icon
                    className="h-12 w-12 text-(--accent)"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-(--text) mb-2">
                      {hobby.title}
                    </h3>
                    <p className="text-sm text-(--muted) leading-relaxed">
                      {hobby.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
