import Link from "next/link";
import { Container, RevealOnScroll, Section } from "@temi/ui";
import { AnimatedText } from "../../components/common/AnimatedText";
import { AboutHero } from "../../components/about/AboutHero";
import {
  ContactForm,
  type LeadState,
} from "../../components/contact/ContactForm";
import { Hero } from "../../components/home/Hero";
import { HomeStatsRow } from "../../components/home/HomeStatsRow";
import { ProjectsSection } from "../../components/projects/ProjectsSection";
import { buildMetadata } from "../../lib/metadata";

export const metadata = buildMetadata({
  title: "Temitope Ogunrekun — Full-Stack · AI · Mobile",
  description:
    "Software Engineer & AI Automation Expert. Building AI-first web and mobile products with Next.js, NestJS, and R3F.",
  path: "/",
  image: "https://picsum.photos/1200/630?seed=home-og",
  type: "website",
});

async function createLeadAction(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const service = formData.get("service")
    ? String(formData.get("service"))
    : null;

  if (!name || !email || !message) {
    return { ok: false, error: "Please complete all required fields." };
  }

  try {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:4000";
    const res = await fetch(`${base}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, service }),
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, error: "Failed to submit. Please try again." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again later." };
  }
}

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
        className="relative isolate overflow-hidden border-y border-(--border) bg-(--surface2)"
      >
        <div
          className="relative whitespace-nowrap before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-16 before:bg-linear-to-r before:from-(--surface2) before:to-transparent after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-16 after:bg-linear-to-l after:from-(--surface2) after:to-transparent"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <p className="inline-block animate-[marquee_22s_linear_infinite] py-4 text-sm uppercase tracking-[0.2em] text-(--muted) will-change-transform">
            <span className="mx-6">
              Full-Stack Development <span className="text-(--accent)">·</span>{" "}
              AI Automation <span className="text-(--accent)">·</span> Mobile
              Engineering <span className="text-(--accent)">·</span> NestJS{" "}
              <span className="text-(--accent)">·</span> Next.js{" "}
              <span className="text-(--accent)">·</span> React Native{" "}
              <span className="text-(--accent)">·</span>
            </span>
            <span className="mx-6">
              Full-Stack Development <span className="text-(--accent)">·</span>{" "}
              AI Automation <span className="text-(--accent)">·</span> Mobile
              Engineering <span className="text-(--accent)">·</span> NestJS{" "}
              <span className="text-(--accent)">·</span> Next.js{" "}
              <span className="text-(--accent)">·</span> React Native{" "}
              <span className="text-(--accent)">·</span>
            </span>
            <span className="mx-6">
              Full-Stack Development <span className="text-(--accent)">·</span>{" "}
              AI Automation <span className="text-(--accent)">·</span> Mobile
              Engineering <span className="text-(--accent)">·</span> NestJS{" "}
              <span className="text-(--accent)">·</span> Next.js{" "}
              <span className="text-(--accent)">·</span> React Native{" "}
              <span className="text-(--accent)">·</span>
            </span>
          </p>
        </div>
      </section>

      <HomeStatsRow />
      <AboutHero />
      <ProjectsSection />

      <Section id="contact" className="bg-(--bg)">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <RevealOnScroll>
              <div>
                <h2 className="sr-only">Let’s talk</h2>
                <AnimatedText
                  phrase="Let’s talk"
                  className="text-3xl font-semibold text-(--text)"
                />
                <p className="mt-3 text-(--muted)">
                  Share a bit about your goals. I’ll reply within 1–2 business
                  days.
                </p>
                <div className="mt-6 space-y-2 text-sm">
                  <div className="text-(--text)">email@temi.dev</div>
                  <Link
                    href="/contact"
                    className="text-(--muted) underline-offset-4 hover:underline"
                  >
                    Open full contact page
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll>
              <div className="rounded-2xl border border-(--border,rgba(0,0,0,0.08)) bg-(--surface) p-6">
                <ContactForm action={createLeadAction} defaultService={null} />
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </Section>
    </main>
  );
}

