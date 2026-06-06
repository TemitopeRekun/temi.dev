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

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://temi.dev";

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.image || undefined,
    url: project.liveUrl || `${base}/work/${slug}`,
    dateCreated: String(project.year),
    keywords: project.tags.join(", "),
    creator: { "@type": "Person", name: "Temitope Ogunrekun", url: base },
    author: { "@type": "Person", name: "Temitope Ogunrekun", url: base },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: "Work", item: `${base}/work` },
      { "@type": "ListItem", position: 3, name: project.title, item: `${base}/work/${slug}` },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Section className="bg-(--bg)">
        <Container>
          <article className="mx-auto max-w-3xl">
            <RevealOnScroll>
              <div className="mb-16 text-center">
                <div className="mb-4 flex items-center justify-center gap-3 text-sm font-medium">
                  <span className="rounded-full bg-(--accent)/10 px-3 py-1 text-(--accent)">
                    {project.category}
                  </span>
                  <span className="text-(--muted)">{project.year}</span>
                </div>
                <h1 className="sr-only">{project.title}</h1>
                <AnimatedText
                  phrase={project.title}
                  className="mb-6 text-center text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-(--text)"
                />

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-(--surface2) px-3 py-1.5 text-sm font-medium text-(--muted)"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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

            <div className="case-study">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h2: ({ children }) => (
                    <h2 className="case-study-h2">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="case-study-h3">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="case-study-p">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="case-study-ul">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="case-study-ol">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="case-study-li">{children}</li>
                  ),
                  code: ({ children, className }) => (
                    <code className={className || "case-study-inline-code"}>
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="case-study-pre">{children}</pre>
                  ),
                  strong: ({ children }) => (
                    <strong className="case-study-strong">{children}</strong>
                  ),
                  hr: () => <hr className="case-study-hr" />,
                }}
              >
                {project.description}
              </ReactMarkdown>
            </div>

            <div className="mt-20 border-t border-(--border)/10 pt-10 text-center">
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
