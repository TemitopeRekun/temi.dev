import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Container, RevealOnScroll, Section } from "@temi/ui";
import { AnimatedText } from "../../../../components/common/AnimatedText";
import { getPosts, getPostBySlug, getComments } from "../../../../lib/blog";
import { buildMetadata } from "../../../../lib/metadata";
import { ArticleInteractions } from "../../../../components/blog/ArticleInteractions";
import { CommentSection } from "../../../../components/blog/CommentSection";
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
  const comments = await getComments(slug);

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

              <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-(--border)/20 shadow-2xl">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>

              <div className="prose prose-invert prose-lg max-w-none text-(--muted)">
                {/* If we have full content, render it. Otherwise show excerpt + note */}
                {post.content ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <div className="space-y-6">
                    <p className="lead text-xl text-(--text)">{post.excerpt}</p>
                    <p>
                      <em>
                        (Full content is currently being migrated. Please check
                        back later.)
                      </em>
                    </p>
                    {/* Placeholder paragraphs to make it look like a real post */}
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <h2>Key Takeaways</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Start with a clear problem statement.</li>
                      <li>Iterate on the solution with feedback.</li>
                      <li>Measure impact using defined metrics.</li>
                    </ul>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                )}
              </div>

              {post.id && (
                <AskArticle articleId={post.id} articleTitle={post.title} />
              )}

              <CommentSection slug={slug} comments={comments} />

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
