"use client";
import Link from "next/link";
import type { Route } from "next";
import { RevealOnScroll, MagneticWrapper } from "@temi/ui";
import { ArrowUpRight } from "lucide-react";

export function HomeStackIntro() {
  return (
    <section className="relative z-10 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <blockquote className="border-l-[3px] border-(--accent) pl-6 sm:pl-8 py-1">
            <p className="text-xl sm:text-2xl font-light leading-relaxed text-(--muted) italic max-w-3xl">
              Every engineering conversation eventually gets to: what&apos;s
              your stack? I used to just answer with a list. But a list
              doesn&apos;t tell you why I reach for{" "}
              <span className="not-italic font-medium text-(--accent)">
                NestJS over Express
              </span>
              , or why{" "}
              <span className="not-italic font-medium text-(--accent)">
                Zod
              </span>{" "}
              became non-negotiable after a bad API response nearly broke a{" "}
              <span className="not-italic font-medium text-(--accent)">
                payments flow mid-trip
              </span>
              . And lately the question&apos;s shifted too — people want to know
              about the AI side: not just which tools, but how to actually split
              the reasoning from the execution without torching your token budget
              on the wrong model. So I wrote about all of it, honestly.
            </p>
          </blockquote>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <div className="mt-8">
            <MagneticWrapper>
              <Link
                href={"/stack" as Route}
                className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-(--text) hover:text-(--accent) transition-colors group"
              >
                See my full stack
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </MagneticWrapper>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
