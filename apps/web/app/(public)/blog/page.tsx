import { Suspense } from "react";
import { Newsletter } from "../../../components/blog/Newsletter";
import { AskAI } from "../../../components/blog/AskAI";
import { BlogContent } from "../../../components/blog/BlogContent";
import { buildMetadata } from "../../../lib/metadata";
import LoadingPublic from "../loading";

export const metadata = buildMetadata({
  title: "Blog — Temitope Ogunrekun",
  description: "Thoughts on AI, web, backend systems, and product engineering.",
  path: "/blog",
  image: "https://picsum.photos/1200/630?seed=blog-og",
  type: "website",
});

export default function BlogPage() {
  return (
    <main>
      <Suspense fallback={<LoadingPublic />}>
        <BlogContent />
      </Suspense>
      <AskAI />
      <Newsletter />
    </main>
  );
}
