"use client";

import { Container, RevealOnScroll, Section, StaggerReveal } from "@temi/ui";
import Link from "next/link";
import Image from "next/image";
import { posts } from "../../lib/blog";
import { TextReveal } from "../common/TextReveal";

export function HomeBlog() {
  const recentPosts = posts.slice(0, 3);

  return (
    <Section className="bg-(--bg)">
      <Container>
        <RevealOnScroll>
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-(--accent)">
                <TextReveal text="From the Blog" type="chars" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-(--text)">
                <TextReveal text="Latest Thoughts" type="chars" delay={0.2} />
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-medium text-(--text) underline-offset-4 hover:underline"
            >
              Read all articles →
            </Link>
          </div>
        </RevealOnScroll>

        <StaggerReveal className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-(--surface) transition-transform hover:-translate-y-1">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-(--muted)">
                    <span className="text-(--accent)">{post.tag}</span>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-(--text) group-hover:text-(--accent) transition-colors">
                    {post.title}
                  </h3>
                  <p className="line-clamp-3 text-sm text-(--muted)">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </StaggerReveal>
      </Container>
    </Section>
  );
}
