"use client";

import { Container, RevealOnScroll, Section, StaggerReveal } from "@temi/ui";
import { Star } from "lucide-react";
import { TextReveal } from "../common/TextReveal";

const TESTIMONIALS = [
  {
    id: 1,
    content:
      "Temi transformed our messy MVP into a scalable, production-ready platform. His deep knowledge of Next.js and system architecture saved us months of technical debt.",
    author: "Sarah Jenkins",
    role: "CTO @ TechFlow",
    avatar: "SJ",
  },
  {
    id: 2,
    content:
      "An exceptional engineer who understands product. He didn't just build what we asked for—he improved the design and user experience along the way.",
    author: "David Chen",
    role: "Founder, AiStudio",
    avatar: "DC",
  },
  {
    id: 3,
    content:
      "The AI automation pipeline Temi built has cut our manual processing time by 80%. Highly recommended for complex backend integrations.",
    author: "Marcus Johnson",
    role: "Director of Ops, FinCorp",
    avatar: "MJ",
  },
];

export function Testimonials() {
  return (
    <Section className="bg-(--surface)">
      <Container>
        <RevealOnScroll>
          <div className="mb-12 text-center">
            <div className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-(--accent)">
              <TextReveal text="Testimonials" type="chars" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-(--text)">
              <TextReveal
                text="Client Success Stories"
                type="chars"
                delay={0.2}
              />
            </h2>
          </div>
        </RevealOnScroll>

        <StaggerReveal className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="flex flex-col rounded-2xl border border-(--border)/50 bg-(--bg) p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-6 flex gap-1 text-(--accent)">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mb-6 flex-1 text-lg leading-relaxed text-(--text)">
                "{t.content}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--surface) text-sm font-bold text-(--text)">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-(--text)">{t.author}</div>
                  <div className="text-sm text-(--muted)">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </StaggerReveal>
      </Container>
    </Section>
  );
}
