import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Container, RevealOnScroll, Section } from "@temi/ui";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { AnimatedText } from "../../../../components/common/AnimatedText";
import { getPosts, getPostBySlug } from "../../../../lib/blog";
import { buildMetadata } from "../../../../lib/metadata";
import { ArticleInteractions } from "../../../../components/blog/ArticleInteractions";
import { CommentList } from "../../../../components/blog/CommentList";
import { AskArticle } from "../../../../components/blog/AskArticle";

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
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
  const post = await getPostBySlug(slug);

  return (
    <main>
      {post && (
        <ArticleInteractions slug={slug} likeCount={post.likeCount || 0} />
      )}
      <Section>
        <Container>
          {!post ? (
            <div className="text-(--muted)">Post not found.</div>
          ) : (
            <article className="mx-auto max-w-3xl">
              <RevealOnScroll>
                <div className="mb-8 text-center">
                  <div className="mb-4 flex items-center justify-center gap-3 text-sm font-medium">
                    <span className="rounded-full bg-(--accent)/10 px-3 py-1 text-(--accent)">
                      {post.tag}
                    </span>
                    <span className="text-(--muted)">
                      {post.readTime} min read
                    </span>
                  </div>
                  <h1 className="sr-only">{post.title}</h1>
                  <AnimatedText
                    phrase={post.title}
                    className="mb-6 text-center text-3xl font-bold leading-tight text-(--text) md:text-5xl"
                  />
                  {post.publishedAt && (
                    <time className="text-sm text-(--muted)">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  )}
                </div>
              </RevealOnScroll>

              <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-2xl border border-(--border)/20 shadow-2xl">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>

              <div
                className="prose prose-invert prose-lg max-w-none text-(--muted) leading-7 prose-p:my-6 prose-li:my-3 prose-ul:my-6 prose-ol:my-6 prose-blockquote:my-6 prose-pre:my-6 prose-pre:rounded-xl prose-pre:border prose-pre:border-(--border)/30 prose-pre:bg-(--surface2) prose-pre:p-5 prose-code:rounded prose-code:bg-(--surface2)/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                {post.content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                    {post.content}
                  </ReactMarkdown>
                ) : (
                  <div className="space-y-4">
                    <p className="lead text-xl text-(--text)">{post.excerpt}</p>
                    <p className="text-sm text-(--muted)">
                      Full content is not available for this post.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-16 border-t border-(--border)/20 pt-8">
                <Suspense
                  fallback={
                    <div className="h-32 animate-pulse rounded-2xl bg-(--surface)" />
                  }
                >
                  <CommentList slug={slug} />
                </Suspense>
              </div>

              {post.id && (
                <div className="mt-16 border-t border-(--border)/20 pt-8">
                  <AskArticle articleId={post.id} articleTitle={post.title} />
                </div>
              )}

              <div className="mt-16 border-t border-(--border)/10 pt-8">
                <Link
                  href={"/blog" as Route}
                  className="group inline-flex items-center text-sm font-medium text-(--text) transition-colors hover:text-(--accent)"
                >
                  <span className="mr-2 transition-transform group-hover:-translate-x-1">
                    ←
                  </span>
                  Back to Articles
                </Link>
              </div>
            </article>
          )}
        </Container>
      </Section>
    </main>
  );
}
