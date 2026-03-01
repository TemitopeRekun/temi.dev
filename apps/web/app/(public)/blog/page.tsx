import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, RevealOnScroll, Section, StaggerReveal } from "@temi/ui";
import { posts } from "../../../lib/blog";
import { buildMetadata } from "../../../lib/metadata";

export const metadata = buildMetadata({
  title: "Blog — Temitope Ogunrekun",
  description:
    "Thoughts on AI, web, backend systems, and product engineering.",
  path: "/blog",
  image: "https://picsum.photos/1200/630?seed=blog-og",
  type: "website",
});

export default function BlogPage() {
  const items = posts.slice(0, 6);
  return (
    <main>
      <Section>
        <Container>
          <RevealOnScroll>
            <h1 className="text-3xl font-semibold text-(--text)">Blog</h1>
          </RevealOnScroll>
          <StaggerReveal className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {items.map((p) => (
              <article
                key={p.slug}
                className="overflow-hidden rounded-2xl border border-(--border,rgba(0,0,0,0.08)) bg-(--surface)"
              >
                <div className="relative aspect-16/10">
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-wide text-(--muted)">
                      {p.tag}
                    </span>
                    <span className="text-xs text-(--muted)">{p.readTime} min</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-(--text)">{p.title}</h3>
                  <p className="mt-1 line-clamp-3 text-(--muted)">{p.excerpt}</p>
                  <div className="mt-3">
                    <Link
                      href={`/blog/${p.slug}` as Route}
                      className="text-sm text-(--text) underline-offset-4 hover:underline"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </StaggerReveal>
          <div className="mt-8 flex justify-center">
            <button
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-current px-5 py-2.5 text-sm text-(--muted)"
            >
              Load more
            </button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
