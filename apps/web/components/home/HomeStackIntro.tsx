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
          <p className="text-xl sm:text-2xl font-light leading-relaxed text-(--muted) max-w-3xl">
            People ask what I use to build things — and more recently, how I
            actually use AI while building. I used to just list the tools. But a
            list doesn{`'`}t tell you why I reach for NestJS over Express, or why
            Zod became non-negotiable after a bad API response nearly broke a
            payments flow mid-trip. So instead I wrote about each one — where it
            showed up, what I learned, and how AI fits into the day-to-day
            honestly.
          </p>
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
