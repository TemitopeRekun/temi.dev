"use client";

import { Container, RevealOnScroll, Section, StaggerReveal } from "@temi/ui";
import { TextReveal } from "../common/TextReveal";

const TESTIMONIALS = [
  {
    id: 1,
    content: "Across our collaborations, Temitope showed strong programming fundamentals, the ability to navigate complex codebases and documentation, and a rare mix of curiosity, communication, and growth mindset—making him a developer we would confidently recommend to any team looking for motivated, technically capable talent.",
    author: "Salem Etohokpan",
    role: "Owner, Talent Group Services",
    avatar: "SE",
  },
  {
    id: 2,
    content: "Temitope contributed to the engineering of our fiscal‑compliant invoicing platform, Multifactu, working inside a modern TypeScript monorepo across compliant invoicing flows, XML export pipelines, PDF rendering, and AEAT‑compliant QR verification—adapting quickly to a complex, production environment." ,
    author: "Pedro Martínez Dopico",
    role: "Managing Director, ADP Digitek",
    avatar: "PD",
  },
  {
    id: 3,
    content: "What stood out most about Temitope was his ambition to continuously improve and expand his skills. He approaches problems with a pragmatic engineering mindset, explores new technologies, and shows a genuine commitment to growing as a developer—an invaluable mindset in a fast-moving industry like software engineering.",  
    author: "Aina Maria Perelló Company",
    role: "CTO, Martínez & Company - Management & Intermediation",
    avatar: "AM",
  },
];

export function Testimonials() {
  return (
    <Section className="bg-(--surface-tint)">
      <Container>
        <RevealOnScroll>
          <div className="mb-12 text-center">
            <div className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-(--accent)">
              <TextReveal text="References" type="chars" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-(--text)">
              <TextReveal
                text="What colleagues say"
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
              className="flex flex-col rounded-2xl border border-(--border) bg-(--surface) p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <blockquote className="mb-6 flex-1 text-base sm:text-lg leading-relaxed text-(--text)">
                "{t.content}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--accent) text-sm font-bold text-white">
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
