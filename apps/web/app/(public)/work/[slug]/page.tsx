import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { Container, RevealOnScroll, Section } from "@temi/ui";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { AnimatedText } from "../../../../components/common/AnimatedText";
import { getProjects, getProjectBySlug } from "../../../../lib/projects";
import { buildMetadata } from "../../../../lib/metadata";

type Params = { slug: string };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return buildMetadata({
    title: project ? `${project.title} — Work` : "Work Detail",
    description: project ? project.description : "Project details.",
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
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <Section className="bg-(--bg)">
        <Container>
          <article className="mx-auto max-w-4xl">
            <RevealOnScroll>
              <div className="mb-8 text-center">
                <div className="mb-4 flex items-center justify-center gap-3 text-sm font-medium">
                  <span className="rounded-full bg-(--accent)/10 px-3 py-1 text-(--accent)">
                    {project.category}
                  </span>
                  <span className="text-(--muted)">{project.year}</span>
                </div>
                <h1 className="sr-only">{project.title}</h1>
                <AnimatedText
                  phrase={project.title}
                  className="mb-6 text-center text-3xl font-bold leading-tight text-(--text) md:text-5xl"
                />

                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full border border-(--border) px-6 py-2 text-sm font-medium transition-colors hover:bg-(--surface2) hover:text-(--accent)"
                    >
                      Visit Live Site ↗
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full border border-(--border) px-6 py-2 text-sm font-medium transition-colors hover:bg-(--surface2)"
                    >
                      View Code ↗
                    </a>
                  )}
                </div>
              </div>
            </RevealOnScroll>

            <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-2xl border border-(--border)/20 shadow-2xl">
              <Image
                src={
                  project.image ||
                  `https://picsum.photos/seed/${project.slug}/1200/800`
                }
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
                priority
              />
            </div>

            <div className="grid gap-12 lg:grid-cols-[1fr_250px]">
              <div
                className="prose prose-invert prose-lg max-w-none text-(--muted) leading-7"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {project.description}
                </ReactMarkdown>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-(--text)">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-(--surface2) px-3 py-1.5 text-sm text-(--muted)"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 border-t border-(--border)/10 pt-8">
              <Link
                href={"/work" as Route}
                className="group inline-flex items-center text-sm font-medium text-(--text) transition-colors hover:text-(--accent)"
              >
                <span className="mr-2 transition-transform group-hover:-translate-x-1">
                  ←
                </span>
                Back to Projects
              </Link>
            </div>
          </article>
        </Container>
      </Section>
    </main>
  );
}
