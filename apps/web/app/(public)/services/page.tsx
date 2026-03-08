import { Container, Section } from "@temi/ui";
import { ServicesList } from "../../../components/services/ServicesList";
import { ServiceHero } from "../../../components/services/ServiceHero";
import { ProcessSteps } from "../../../components/services/ProcessSteps";
import { ServiceFAQ } from "../../../components/services/ServiceFAQ";
import { buildMetadata } from "../../../lib/metadata";
import { createLeadAction } from "../actions";

export const metadata = buildMetadata({
  title: "Services — Temitope Ogunrekun",
  description:
    "Full-Stack Development, AI Automation, Mobile Engineering, and Consulting services.",
  path: "/services",
  image: "https://picsum.photos/1200/630?seed=services-og",
});

export default function ServicesPage() {
  return (
    <main>
      <ServiceHero />

      <Section className="pt-0">
        <Container>
          <ServicesList action={createLeadAction} />
        </Container>
      </Section>

      <ProcessSteps />

      <ServiceFAQ />
    </main>
  );
}
