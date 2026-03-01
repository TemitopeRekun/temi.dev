import { Container, RevealOnScroll, Section, StaggerReveal } from "@temi/ui";
import { AboutHero } from "../../../components/about/AboutHero";
import { ParallaxImage } from "../../../components/about/ParallaxImage";
import { DownloadCvButton } from "../../../components/common/DownloadCvButton";
import { buildMetadata } from "../../../lib/metadata";

export const metadata = buildMetadata({
  title: "About — Temitope Ogunrekun",
  description:
    "Full-Stack & AI engineer. Timeline, story, and tech stack behind the work.",
  path: "/about",
  image: "https://picsum.photos/1200/630?seed=about-og",
});

const TIMELINE: Array<{ year: string; title: string; text: string }> = [
  { year: "2019", title: "Getting Started", text: "Front-end foundations and early React work." },
  { year: "2020", title: "Full-Stack", text: "Built Node/NestJS backends and deployed first SaaS." },
  { year: "2022", title: "AI Shift", text: "Productionizing AI features and workflow automation." },
  { year: "2024", title: "Mobile + R3F", text: "React Native apps and 3D experiences with Three.js." },
  { year: "Now", title: "AI-First Systems", text: "Designing reliable AI pipelines and products." },
];

const STACK: Array<{ key: string; label: string }> = [
  { key: "ts", label: "TypeScript" },
  { key: "next", label: "Next.js" },
  { key: "nest", label: "NestJS" },
  { key: "react", label: "React" },
  { key: "rn", label: "React Native" },
  { key: "gsap", label: "GSAP" },
  { key: "prisma", label: "Prisma" },
  { key: "pg", label: "PostgreSQL" },
  { key: "tailwind", label: "Tailwind" },
  { key: "three", label: "Three.js" },
];

export default function AboutPage() {
  return (
    <main>
      <AboutHero />

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <RevealOnScroll>
              <div>
                <h2 className="text-2xl font-semibold text-(--text)">My Story</h2>
                <p className="mt-4 text-(--muted)">
                  I value pragmatic engineering: reliable systems, clean APIs, and a strong UX.
                  My work spans full-stack web, AI automation, and mobile, with a focus on
                  measurable impact and maintainability.
                </p>
                <p className="mt-3 text-(--muted)">
                  I approach projects with AI-native thinking—tooling, data, and feedback loops
                  built in from day one.
                </p>
                <div className="mt-6">
                  <DownloadCvButton />
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll>
              <ParallaxImage
                src="https://picsum.photos/1200/1500?grayscale&blur=0"
                alt="Workspace"
                aspect="aspect-4/5"
              />
            </RevealOnScroll>
          </div>
        </Container>
      </Section>

      <Section className="bg-(--surface)">
        <Container>
          <div className="mb-8">
            <RevealOnScroll>
              <h2 className="text-2xl font-semibold text-(--text)">Timeline</h2>
            </RevealOnScroll>
          </div>
          <ul className="relative grid grid-cols-1 gap-6">
            {TIMELINE.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <li
                  key={item.year}
                  className={[
                    "md:grid md:grid-cols-2 md:items-start",
                    isEven ? "md:text-right" : "md:text-left",
                  ].join(" ")}
                >
                  <div className={[isEven ? "md:pr-8" : "md:order-2 md:pl-8"].join(" ")}>
                    <RevealOnScroll>
                      <div className="inline-flex items-baseline gap-3 rounded-2xl border border-(--border,rgba(0,0,0,0.08)) bg-(--bg) p-5">
                        <span className="text-sm text-(--muted)">{item.year}</span>
                        <div>
                          <div className="text-lg font-semibold text-(--text)">{item.title}</div>
                          <p className="mt-1 max-w-prose text-(--muted)">{item.text}</p>
                        </div>
                      </div>
                    </RevealOnScroll>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-6">
            <RevealOnScroll>
              <h2 className="text-2xl font-semibold text-(--text)">Tech Stack</h2>
            </RevealOnScroll>
          </div>
          <StaggerReveal className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {STACK.map((s) => (
              <div
                key={s.key}
                className="flex items-center gap-3 rounded-2xl border border-(--border,rgba(0,0,0,0.08)) bg-(--surface) p-4"
              >
                <span
                  aria-hidden
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-(--bg) text-xs text-(--text)"
                >
                  {s.label.slice(0, 2)}
                </span>
                <span className="text-sm text-(--text)">{s.label}</span>
              </div>
            ))}
          </StaggerReveal>
        </Container>
      </Section>
    </main>
  );
}
