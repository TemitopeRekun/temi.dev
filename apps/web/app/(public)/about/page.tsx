import { Container, Section } from "@temi/ui";
import { AboutHero } from "../../../components/about/AboutHero";
import { Timeline } from "../../../components/about/Timeline";
import { HowIBuild } from "../../../components/about/HowIBuild";
import { PersonalSection } from "../../../components/about/PersonalSection";
import { DownloadCvButton } from "../../../components/common/DownloadCvButton";
import { buildMetadata } from "../../../lib/metadata";
import { TextReveal } from "../../../components/common/TextReveal";

export const metadata = buildMetadata({
  title: "About",
  description:
    "From Lagos to shipping fiscal-compliance software in Spain. A look at my timeline, stack, and how I got here.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main>
      <h1 className="sr-only">About Temitope Ogunrekun</h1>
      <AboutHero hideLink />

      <Section>
        <Container>
          <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
            <div className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-(--accent)">
              <TextReveal text="My Journey" type="chars" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight text-(--text) mb-6">
              <TextReveal
                text="From Lagos to shipping fiscal-compliance software in Spain."
                type="words"
                delay={0.2}
              />
            </h2>
            <p className="text-base sm:text-lg text-(--muted) leading-relaxed">
              That's the arc. Here's how it actually unfolded — each role, and
              what it taught me about building software people depend on.
            </p>
          </div>

          <Timeline />

          <div className="mt-24 flex justify-center">
            <DownloadCvButton />
          </div>
        </Container>
      </Section>

      <Section className="border-t border-(--border)">
        <Container>
          <HowIBuild />
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
