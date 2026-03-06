import { AboutHero } from "../../components/about/AboutHero";
import { Hero } from "../../components/home/Hero";
import { MarqueeSlider } from "../../components/home/MarqueeSlider";
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
      <MarqueeSlider />
      <HomeStatsRow />
      <AboutHero />
      <ProjectsSection />
    </main>
  );
}
