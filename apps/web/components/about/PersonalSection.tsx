"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { RevealOnScroll } from "@temi/ui";

const HOBBIES = [
  {
    title: "Photography",
    description:
      "Capturing moments and light. Exploring street photography and architecture.",
    image: "https://picsum.photos/seed/photo/600/800",
    rotation: -2,
  },
  {
    title: "Cycling",
    description:
      "Clearing the mind on long rides. Exploring new routes and pushing endurance.",
    image: "https://picsum.photos/seed/cycle/600/800",
    rotation: 3,
  },
  {
    title: "Reading",
    description:
      "Constant learning. Sci-fi, philosophy, and technical deep dives.",
    image: "https://picsum.photos/seed/read/600/800",
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
          <h2 className="text-3xl font-semibold text-(--text) mb-6">
            Beyond the Code
          </h2>
          <p className="text-lg text-(--muted) leading-relaxed">
            While I love building systems, I believe that great engineering
            comes from a balanced life. Stepping away from the screen helps me
            recharge and brings fresh perspectives to my work.
          </p>
        </RevealOnScroll>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {HOBBIES.map((hobby, index) => (
          <motion.div
            key={hobby.title}
            style={{
              rotate: hobby.rotation,
              y: index % 2 === 0 ? y : 0, // Parallax effect on odd items
            }}
            className="group relative"
          >
            <div className="relative aspect-[4/3] md:aspect-[3/4] overflow-hidden rounded-2xl border border-(--border) bg-(--surface) shadow-lg transition-transform duration-500 group-hover:scale-[1.02]">
              <Image
                src={hobby.image}
                alt={hobby.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{hobby.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  {hobby.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
