"use client";

import { Container, RevealOnScroll, Section, StaggerReveal } from "@temi/ui";
import Link from "next/link";
import { SERVICES } from "../../lib/services-data";
import { TextReveal } from "../common/TextReveal";

export function HomeServices() {
  return (
    <Section className="bg-(--surface)">
      <Container>
        <RevealOnScroll>
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-(--accent)">
                <TextReveal text="What I Do" type="chars" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-(--text)">
                <TextReveal
                  text="Services & Expertise"
                  type="chars"
                  delay={0.2}
                />
              </h2>
            </div>
            <Link
              href="/services"
              className="text-sm font-medium text-(--text) underline-offset-4 hover:underline"
            >
              View all services →
            </Link>
          </div>
        </RevealOnScroll>

        <StaggerReveal className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <div
              key={service.key}
              className="group relative flex flex-col justify-between rounded-2xl border border-(--border)/50 bg-(--bg) p-6 transition-colors hover:border-(--accent)/30"
            >
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-(--surface) text-(--accent) group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-(--text)">
                  {service.title}
                </h3>
                <p className="text-sm text-(--muted) leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </StaggerReveal>
      </Container>
    </Section>
  );
}
