import { Hero } from "../../components/home/Hero";
import { ProjectsSection } from "../../components/projects/ProjectsSection";
import { Container, Grid, RevealOnScroll, Section } from "@temi/ui";
import { buildMetadata } from "../../lib/metadata";

export const metadata = buildMetadata({
  title: "Temitope Ogunrekun — Full-Stack · AI · Mobile",
  description:
    "Software Engineer & AI Automation Expert. Building AI-first web and mobile products with Next.js, NestJS, and R3F.",
  path: "/",
  image: "https://picsum.photos/1200/630?seed=home-og",
  type: "website",
});

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Temitope Ogunrekun",
            url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://temi.dev") + "/",
            jobTitle: "Software Engineer & AI Automation Expert",
            sameAs: [
              "https://github.com/temitopeog",
              "https://www.linkedin.com/in/temitopeogunrekun",
              "https://x.com/temitopeog",
            ],
            worksFor: {
              "@type": "Organization",
              name: "Independent Consultant",
            },
            knowsAbout: [
              "Next.js",
              "NestJS",
              "TypeScript",
              "React Native",
              "AI Automation",
              "RAG",
            ],
          }),
        }}
      />
      <Hero />

      <section
        aria-label="Expertise Marquee"
        className="relative isolate overflow-hidden border-y border-(--border,rgba(0,0,0,0.08)) bg-(--surface)"
      >
        <div className="whitespace-nowrap">
          <p className="inline-block animate-[marquee_22s_linear_infinite] py-3 text-sm tracking-wide text-(--text)/70 will-change-transform">
            <span className="mx-6">
              Full-Stack Development · AI Automation · Mobile Engineering ·
              NestJS · Next.js · React Native ·
            </span>
            <span className="mx-6">
              Full-Stack Development · AI Automation · Mobile Engineering ·
              NestJS · Next.js · React Native ·
            </span>
            <span className="mx-6">
              Full-Stack Development · AI Automation · Mobile Engineering ·
              NestJS · Next.js · React Native ·
            </span>
          </p>
        </div>
      </section>

      <Section id="work" className="bg-(--bg)">
        <Container>
          <Grid cols={1} md={3} gap="gap-6 md:gap-8">
            <RevealOnScroll>
              <div className="rounded-2xl border border-(--border,rgba(0,0,0,0.08)) bg-(--surface) p-6">
                <div className="text-3xl font-semibold text-(--text)">
                  5+ Years
                </div>
                <div className="mt-1 text-sm text-(--muted)">Experience</div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll>
              <div className="rounded-2xl border border-(--border,rgba(0,0,0,0.08)) bg-(--surface) p-6">
                <div className="text-3xl font-semibold text-(--text)">
                  20+ Projects
                </div>
                <div className="mt-1 text-sm text-(--muted)">Delivered</div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll>
              <div className="rounded-2xl border border-(--border,rgba(0,0,0,0.08)) bg-(--surface) p-6">
                <div className="text-3xl font-semibold text-(--text)">
                  AI-First
                </div>
                <div className="mt-1 text-sm text-(--muted)">Development</div>
              </div>
            </RevealOnScroll>
          </Grid>
        </Container>
      </Section>

      <ProjectsSection />

      <Section id="contact" className="bg-(--bg)">
        <Container>
          <RevealOnScroll>
            <div className="rounded-2xl border border-(--border,rgba(0,0,0,0.08)) bg-(--surface) p-6 text-center">
              <div className="text-lg text-(--muted)">
                Ready to collaborate? Let’s build something remarkable.
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>
    </main>
  );
}
