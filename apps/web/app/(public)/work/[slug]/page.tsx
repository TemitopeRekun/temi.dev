import { notFound } from "next/navigation";
import { Container, RevealOnScroll, Section } from "@temi/ui";
import { projects } from "../../../../lib/projects";
import { buildMetadata } from "../../../../lib/metadata";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return buildMetadata({
    title: project ? `${project.title} — Work` : "Work Detail",
    description: project
      ? project.description
      : "Project details will appear here.",
    path: project ? `/work/${project.slug}` : "/work",
    image: project?.image,
    type: "article",
  });
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    notFound();
  }
  return (
    <main>
      <Section className="bg-(--bg)">
        <Container>
          <RevealOnScroll>
            <h1 className="mb-2 text-3xl font-semibold">{project.title}</h1>
          </RevealOnScroll>
          <p className="text-(--muted)">
            Placeholder detail page for <strong>{project.slug}</strong>. Content coming soon.
          </p>
        </Container>
      </Section>
    </main>
  );
}
