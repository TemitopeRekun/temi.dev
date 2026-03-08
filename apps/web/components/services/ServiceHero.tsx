"use client";

import { Container, Section, RevealOnScroll } from "@temi/ui";
import { AnimatedText } from "../common/AnimatedText";

export function ServiceHero() {
  return (
    <Section className="pt-32 pb-16 md:pt-48 md:pb-24">
      <Container>
        <div className="max-w-4xl">
          <RevealOnScroll>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-(--accent)" />
              <span className="text-sm font-medium uppercase tracking-widest text-(--accent)">
                Services
              </span>
            </div>
            <h1 className="sr-only">
              Engineering scalable systems & AI-first products
            </h1>
            <AnimatedText
              phrase="Engineering scalable systems & AI-first products"
              className="text-4xl font-bold tracking-tight text-(--text) sm:text-5xl md:text-6xl lg:text-7xl"
            />
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-(--muted) md:text-xl">
              I help founders and companies build production-grade software.
              From MVP to scale, I provide end-to-end engineering with a focus
              on performance, security, and AI automation.
            </p>
          </RevealOnScroll>
        </div>
      </Container>
    </Section>
  );
}
