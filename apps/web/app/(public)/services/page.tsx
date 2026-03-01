import type { Route } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Container, RevealOnScroll, Section, StaggerReveal } from "@temi/ui";
import { TiltCard } from "../../../components/services/TiltCard";
import { buildMetadata } from "../../../lib/metadata";

export const metadata = buildMetadata({
  title: "Services — Temitope Ogunrekun",
  description:
    "Full-Stack Development, AI Automation, Mobile Engineering, and Consulting services.",
  path: "/services",
  image: "https://picsum.photos/1200/630?seed=services-og",
});

type Service = {
  key: string;
  title: string;
  description: string;
  price: string;
  icon: ReactNode;
};

const SERVICES: Service[] = [
  {
    key: "fullstack",
    title: "Full-Stack Development",
    description:
      "Production-grade web apps with Next.js, NestJS, PostgreSQL, and modern CI/CD.",
    price: "$4k–$20k+",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M3 7l9-4 9 4-9 4-9-4Zm0 6l9-4 9 4-9 4-9-4Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    key: "ai",
    title: "AI Automation",
    description:
      "Integrations, agents, and embeddings with robust monitoring and safety.",
    price: "$3k–$15k+",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.2" />
        <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: "mobile",
    title: "Mobile Engineering",
    description:
      "React Native apps, shared design systems, and efficient release pipelines.",
    price: "$5k–$30k+",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <rect x="7" y="2" width="10" height="20" rx="2" fill="currentColor" />
        <circle cx="12" cy="18" r="1.5" fill="var(--bg)" />
      </svg>
    ),
  },
  {
    key: "consult",
    title: "Freelance/Consulting",
    description:
      "Architecture reviews, performance tuning, and scoped feature delivery.",
    price: "$120–$180/hr",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M4 4h16v4H4zM4 10h10v10H4zM16 14h4v6h-4z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export default function ServicesPage() {
  return (
    <main>
      <Section>
        <Container>
          <RevealOnScroll>
            <h1 className="text-3xl font-semibold text-(--text)">Services</h1>
          </RevealOnScroll>
          <StaggerReveal className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {SERVICES.map((s) => (
              <TiltCard key={s.key}>
                <div className="group rounded-2xl border border-(--border,rgba(0,0,0,0.08)) bg-(--surface) p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--bg) text-(--text)">
                        {s.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-(--text)">
                        {s.title}
                      </h3>
                    </div>
                    <span className="text-sm text-(--muted)">{s.price}</span>
                  </div>
                  <p className="mt-3 text-(--muted)">{s.description}</p>
                  <div className="mt-5">
                    <Link
                      href={
                        `/contact?service=${encodeURIComponent(s.title)}` as Route
                      }
                      className="inline-flex rounded-full border border-current px-4 py-2 text-sm text-(--text) hover:bg-(--surface)/60 transition-colors"
                    >
                      Book Now →
                    </Link>
                  </div>
                </div>
              </TiltCard>
            ))}
          </StaggerReveal>
        </Container>
      </Section>
    </main>
  );
}
