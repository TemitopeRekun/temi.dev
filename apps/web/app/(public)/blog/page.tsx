import { Suspense } from "react";
import { Container, RevealOnScroll, Section } from "@temi/ui";
import { AskAI } from "../../../components/blog/AskAI";
import { BlogContent } from "../../../components/blog/BlogContent";
import { AnimatedText } from "../../../components/common/AnimatedText";
import { buildMetadata } from "../../../lib/metadata";
import LoadingPublic from "../loading";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Thoughts on AI, web, backend systems, and product engineering.",
  path: "/blog",
  type: "website",
});

export default function BlogPage() {
  return (
    <main>
      {/*
        The <h1> lives on the page rather than inside BlogContent so it is
        present regardless of what the posts fetch returns — this index
        previously rendered no top-level heading at all once posts existed,
        because the only <h1> sat in BlogContent's empty-state branch.
      */}
      <Section className="pb-0 pt-24 md:pt-40">
        <Container>
          <RevealOnScroll>
            <AnimatedText
              as="h1"
              phrase="Writing"
              className="mb-6 text-3xl font-semibold text-(--text)"
            />
            <p className="max-w-xl text-lg text-(--muted)">
              Notes on AI engineering, backend systems, and the parts of
              full-stack work that only show up in production.
            </p>
          </RevealOnScroll>
        </Container>
      </Section>

      <Suspense fallback={<LoadingPublic />}>
        <BlogContent />
      </Suspense>
      <AskAI />
    </main>
  );
}
