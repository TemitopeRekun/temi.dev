import { AboutHero } from "../../components/about/AboutHero";
import { Hero } from "../../components/home/Hero";
import { MarqueeSlider } from "../../components/home/MarqueeSlider";
import { HomeStatsRow } from "../../components/home/HomeStatsRow";
import { ProjectsSection } from "../../components/projects/ProjectsSection";
import { HomeStackIntro } from "../../components/home/HomeStackIntro";
import { Testimonials } from "../../components/home/Testimonials";
import { HomeBlog } from "../../components/home/HomeBlog";
import { GlobalBackground } from "../../components/common/GlobalBackground";
import { buildMetadata } from "../../lib/metadata";
import { getPosts } from "../../lib/blog";
import { getProjects } from "../../lib/projects";

export const metadata = buildMetadata({
  title: "Temitope Ogunrekun — Full-Stack Engineer",
  description:
    "Full-stack engineer from Lagos. TypeScript, Next.js, NestJS, PostgreSQL. Open to remote mid-level roles.",
  path: "/",
  type: "website",
});

export default async function HomePage() {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);

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
            url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.temitope.live") + "/",
            jobTitle: "Full-Stack Engineer",
            sameAs: [
              "https://github.com/TemitopeRekun",
              "https://www.linkedin.com/in/temitope-ogunrekun-092736229/",
              "https://x.com/_sireTemi",
            ],
            worksFor: [
              {
                "@type": "Organization",
                name: "ADP Digitek",
              },
              {
                "@type": "Organization",
                name: "Bica Driver",
              },
            ],
            knowsAbout: [
              "TypeScript",
              "Next.js",
              "NestJS",
              "PostgreSQL",
              "REST APIs",
              "Docker",
              "React",
              "Node.js",
              "Full-Stack Engineering",
            ],
          }),
        }}
      />
      <GlobalBackground />
      <Hero />
      <MarqueeSlider />
      <HomeStatsRow />
      <AboutHero />
      <HomeStackIntro />
      <ProjectsSection initialProjects={projects} />
      <Testimonials />
      <HomeBlog initialPosts={posts} />
    </main>
  );
}
