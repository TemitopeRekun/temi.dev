import { Container, Section } from "@temi/ui";
import { AboutHero } from "../../../components/about/AboutHero";
import { Timeline } from "../../../components/about/Timeline";
import { PersonalSection } from "../../../components/about/PersonalSection";
import { DownloadCvButton } from "../../../components/common/DownloadCvButton";
import { buildMetadata } from "../../../lib/metadata";
import { TextReveal } from "../../../components/common/TextReveal";

export const metadata = buildMetadata({
  title: "About — Temitope Ogunrekun",
  description:
    "From Lagos to shipping fiscal-compliance software in Spain. A look at my timeline, stack, and how I got here.",
  path: "/about",
  image: "https://picsum.photos/1200/630?seed=about-og",
});

export default function AboutPage() {
  return (
    <main>
      <AboutHero hideLink />

      <Section>
        <Container>
          <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
            <div className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-(--accent)">
              <TextReveal text="My Journey" type="chars" />
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-(--text) mb-6">
              <TextReveal
                text="From Lagos to shipping fiscal-compliance software in Spain."
                type="words"
                delay={0.2}
              />
            </h2>
            <p className="text-lg text-(--muted) leading-relaxed">
              I picked up programming the way most people in Lagos do — piecing
              things together from whatever was available online. Here's what's
              happened since.
            </p>
          </div>

          <Timeline />

          <div className="mt-24 flex justify-center">
            <DownloadCvButton />
          </div>
        </Container>
      </Section>

      <Section className="bg-(--surface)">
        <Container>
          <PersonalSection />
        </Container>
      </Section>
    </main>
  );
}
