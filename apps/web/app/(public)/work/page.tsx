import { Container, RevealOnScroll, Section } from "@temi/ui";
import { AnimatedText } from "../../../components/common/AnimatedText";
import { WorkList } from "../../../components/projects/WorkList";
import { buildMetadata } from "../../../lib/metadata";

export const metadata = buildMetadata({
  title: "Work — Selected Projects",
  description:
    "Browse selected projects across frontend, backend, AI automation, and mobile.",
  path: "/work",
  image: "https://picsum.photos/1200/630?seed=work-og",
});

export default function WorkPage() {
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
          </RevealOnScroll>
          <WorkList />
        </Container>
      </Section>
    </main>
  );
}
