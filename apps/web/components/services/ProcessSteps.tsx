"use client";

import { Container, Section, StaggerReveal, RevealOnScroll } from "@temi/ui";
import { AnimatedText } from "../common/AnimatedText";

const STEPS = [
  {
    id: "01",
    title: "Discovery",
    description:
      "We start by understanding your goals, user needs, and technical requirements. I dig deep to find the most efficient path to value.",
  },
  {
    id: "02",
    title: "Strategy & Design",
    description:
      "I architect the system, choose the right stack, and design the data flow. We define milestones to ensure steady progress.",
  },
  {
    id: "03",
    title: "Development",
    description:
      "I build with production standards from day one—clean code, type safety, and automated tests. You get regular updates and preview links.",
  },
  {
    id: "04",
    title: "Launch & Scale",
    description:
      "Deployment is just the beginning. I set up monitoring, analytics, and CI/CD pipelines to ensure your product scales smoothly.",
  },
];

export function ProcessSteps() {
  return (
    <Section className="bg-(--surface)">
      <Container>
        <div className="mb-16 md:mb-24">
          <RevealOnScroll>
            <h2 className="sr-only">How I Work</h2>
            <AnimatedText
              phrase="How I Work"
              className="text-3xl font-semibold tracking-tight text-(--text) sm:text-4xl"
            />
            <p className="mt-4 max-w-2xl text-lg text-(--muted)">
              A transparent, iterative process designed to deliver high-quality
              results without the surprise.
            </p>
          </RevealOnScroll>
        </div>

        <StaggerReveal className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="group relative flex flex-col border-l border-(--border)/30 pl-6 transition-colors hover:border-(--accent)"
            >
              <span className="mb-4 text-xs font-bold uppercase tracking-widest text-(--muted) group-hover:text-(--accent)">
                Step {step.id}
              </span>
              <h3 className="mb-3 text-xl font-semibold text-(--text)">
                {step.title}
              </h3>
              <p className="leading-relaxed text-(--muted)">
                {step.description}
              </p>
            </div>
          ))}
        </StaggerReveal>
      </Container>
    </Section>
  );
}
