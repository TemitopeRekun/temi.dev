import { Container, RevealOnScroll, Section } from "@temi/ui";
import { AnimatedText } from "../../../components/common/AnimatedText";
import { WorkList } from "../../../components/projects/WorkList";
import { buildMetadata } from "../../../lib/metadata";
import { getProjects } from "../../../lib/projects";

export const metadata = buildMetadata({
  title: "Work — Case Studies",
  description:
    "Selected systems I've built across fintech, mobility, AI infrastructure, and full-stack engineering.",
  path: "/work",
});

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <main>
      <Section className="bg-(--bg)">
        <Container>
          <RevealOnScroll>
            <h1 className="sr-only">Work</h1>
            <AnimatedText
              phrase="Work"
              className="mb-6 text-3xl font-semibold text-(--text)"
            />
            <p className="mb-12 max-w-xl text-lg text-(--muted)">
              Selected systems I have built or am actively building. Each case
              study covers the API design, database model, and engineering
              decisions behind the system.
            </p>
          </RevealOnScroll>
          <WorkList initialProjects={projects} />
        </Container>
      </Section>
    </main>
  );
}
