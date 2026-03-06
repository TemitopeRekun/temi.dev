"use client";

import { Container, RevealOnScroll, Section } from "@temi/ui";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TextReveal } from "../common/TextReveal";

export function CTASection() {
  return (
    <Section className="relative overflow-hidden bg-(--accent) py-24 md:py-32">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.1))]" />
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white opacity-10 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-black opacity-10 blur-3xl" />

      <Container className="relative z-10 text-center">
        <RevealOnScroll>
          <h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-[var(--accent-fg,white)] sm:text-5xl">
            <TextReveal text="Ready to build something extraordinary?" type="chars" delay={0.2} />
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--accent-fg,white)]/80">
            Whether you need a full-stack overhaul, an AI integration, or a mobile app—let's discuss how I can help you achieve your goals.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--bg)] px-8 py-4 text-base font-medium text-[var(--text)] shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-fg,white)]/30 bg-transparent px-8 py-4 text-base font-medium text-[var(--accent-fg,white)] transition-colors hover:bg-[var(--accent-fg,white)]/10"
            >
              View Services
            </Link>
          </div>
        </RevealOnScroll>
      </Container>
    </Section>
  );
}
