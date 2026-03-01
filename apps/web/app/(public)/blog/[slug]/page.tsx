import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Container, RevealOnScroll, Section } from "@temi/ui";
import { posts } from "../../../../lib/blog";
import { buildMetadata } from "../../../../lib/metadata";

type Params = { slug: string };

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return buildMetadata({
    title: post ? `${post.title} — Blog` : "Blog Post",
    description: post ? post.excerpt : "Blog post",
    path: post ? `/blog/${post.slug}` : "/blog",
    image: post?.image,
    type: "article",
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return (
    <main>
      <Section>
        <Container>
          {!post ? (
            <div className="text-(--muted)">Post not found.</div>
          ) : (
            <article className="prose prose-invert max-w-none">
              <RevealOnScroll>
                <h1 className="mb-3 text-3xl font-semibold text-(--text)">
                  {post.title}
                </h1>
              </RevealOnScroll>
              <div className="relative mb-6 aspect-16/10 overflow-hidden rounded-2xl border border-(--border)">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={false}
                />
              </div>
              <p className="text-(--muted)">{post.excerpt}</p>
              <div className="mt-6">
                <Link
                  href={"/blog" as Route}
                  className="text-sm text-(--text) underline-offset-4 hover:underline"
                >
                  ← Back to Blog
                </Link>
              </div>
            </article>
          )}
        </Container>
      </Section>
    </main>
  );
}

