import { AnimatedText } from "../../../components/common/AnimatedText";
import { Container, RevealOnScroll, Section } from "@temi/ui";
import { ServicesList } from "../../../components/services/ServicesList";
import { buildMetadata } from "../../../lib/metadata";
import { createLeadAction } from "../actions";

export const metadata = buildMetadata({
  title: "Services â€” Temitope Ogunrekun",
  description:
    "Full-Stack Development, AI Automation, Mobile Engineering, and Consulting services.",
  path: "/services",
  image: "https://picsum.photos/1200/630?seed=services-og",
});

export default function ServicesPage() {
  return (
    <main>
      <Section>
        <Container>
          <RevealOnScroll>
            <h1 className="sr-only">Services</h1>
            <AnimatedText
              phrase="Services"
              className="text-3xl font-semibold text-(--text)"
            />
          </RevealOnScroll>
          <ServicesList action={createLeadAction} />
        </Container>
      </Section>
    </main>
  );
}
