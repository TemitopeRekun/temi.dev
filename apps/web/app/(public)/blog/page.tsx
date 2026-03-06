import type { Route } from "next";
import { FeaturedPost } from "../../../components/blog/FeaturedPost";
import { BlogList } from "../../../components/blog/BlogList";
import { Newsletter } from "../../../components/blog/Newsletter";
import { AskAI } from "../../../components/blog/AskAI";
import { getPosts } from "../../../lib/blog";
import { buildMetadata } from "../../../lib/metadata";

export const metadata = buildMetadata({
  title: "Blog — Temitope Ogunrekun",
  description: "Thoughts on AI, web, backend systems, and product engineering.",
  path: "/blog",
  image: "https://picsum.photos/1200/630?seed=blog-og",
  type: "website",
});

export default async function BlogPage() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <main className="flex min-h-[50vh] flex-col items-center justify-center pt-32 text-center">
        <h1 className="text-2xl font-semibold text-(--text)">
          No posts found.
        </h1>
        <p className="mt-2 text-(--muted)">Check back later for updates.</p>
      </main>
    );
  }

  const featured = posts[0];
  const list = posts.slice(1);

  return (
    <main>
      <FeaturedPost post={featured} />
      <BlogList posts={list} />
      <AskAI />
      <Newsletter />
    </main>
  );
}
