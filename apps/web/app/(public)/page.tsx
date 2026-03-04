import { Hero } from "../../components/home/Hero";
import { FeaturedCarousel } from "../../components/home/FeaturedCarousel";
import { HomeStatsRow } from "../../components/home/HomeStatsRow";
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
      <FeaturedCarousel />
    </main>
  );
}
