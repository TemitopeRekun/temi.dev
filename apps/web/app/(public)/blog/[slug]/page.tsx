import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Container, RevealOnScroll, Section } from "@temi/ui";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { AnimatedText } from "../../../../components/common/AnimatedText";
import { getPosts, getPostBySlug } from "../../../../lib/blog";
import { buildMetadata } from "../../../../lib/metadata";
import { AskArticle } from "../../../../components/blog/AskArticle";
import { ShareArticle } from "../../../../components/blog/ShareArticle";

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

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://temi.dev";

  const blogPostingSchema = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.image,
        url: `${base}/blog/${slug}`,
        datePublished: post.publishedAt ?? undefined,
        keywords: post.tag,
        timeRequired: `PT${post.readTime}M`,
        mainEntityOfPage: { "@type": "WebPage", "@id": `${base}/blog/${slug}` },
        author: { "@type": "Person", name: "Temitope Ogunrekun", url: base },
        publisher: { "@type": "Person", name: "Temitope Ogunrekun", url: base },
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog` },
      ...(post ? [{ "@type": "ListItem", position: 3, name: post.title, item: `${base}/blog/${slug}` }] : []),
    ],
  };

  return (
    <main>
      {blogPostingSchema && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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

              {post.content ? (
                <div className="case-study">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[
                      [rehypeSanitize, { ...defaultSchema, attributes: { ...defaultSchema.attributes, code: ["className"], span: ["className"] } }],
                      rehypeHighlight,
                    ]}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="case-study space-y-4">
                  <p className="text-xl text-(--text)">{post.excerpt}</p>
                  <p className="text-sm text-(--muted)">
                    Full content is not available for this post.
                  </p>
                </div>
              )}


              {post.id && (
                <div className="mt-16 border-t border-(--border)/20 pt-8">
                  <AskArticle articleId={post.id} articleTitle={post.title} />
                </div>
              )}

              <div className="mt-16 border-t border-(--border)/10 pt-8">
                <ShareArticle slug={slug} title={post.title} />
              </div>

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
