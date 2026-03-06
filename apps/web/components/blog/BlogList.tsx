"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container, Section, StaggerReveal } from "@temi/ui";
import { BlogPost } from "../../lib/blog";
import { AnimatedText } from "../common/AnimatedText";

type Props = {
  posts: BlogPost[];
};

export function BlogList({ posts }: Props) {
  const [activeTag, setActiveTag] = useState<string>("All");
  const [search, setSearch] = useState("");

  // Extract unique tags
  const tags = ["All", ...Array.from(new Set(posts.map((p) => p.tag)))];

  const filteredPosts = posts.filter((p) => {
    const matchesTag = activeTag === "All" || p.tag === activeTag;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <Section className="py-24">
      <Container>
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-md">
            <AnimatedText
              phrase="Latest Articles"
              className="mb-4 text-3xl font-bold text-(--text)"
            />
            <p className="mb-6 text-(--muted)">
              Explore thoughts on technology, design, and AI engineering.
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-(--border) bg-(--bg) px-5 py-2.5 text-sm text-(--text) placeholder:text-(--muted) focus:border-(--accent) focus:outline-none focus:ring-1 focus:ring-(--accent)"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--muted)"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end md:max-w-lg">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`rounded-full border px-4 py-2 text-sm transition-all ${
                  activeTag === tag
                    ? "border-(--accent) bg-(--accent)/10 text-(--accent)"
                    : "border-(--border) text-(--muted) hover:border-(--text) hover:text-(--text)"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <StaggerReveal
          key={activeTag} // Force re-render animation when tag changes
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredPosts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group block h-full"
            >
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-(--border)/40 bg-(--surface) transition-all duration-300 hover:-translate-y-1 hover:border-(--accent)/50 hover:shadow-lg">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={800}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    {p.tag}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 text-xs text-(--muted)">
                    {p.readTime} min read
                  </div>
                  <h3 className="mb-3 text-xl font-bold leading-tight text-(--text) transition-colors group-hover:text-(--accent)">
                    {p.title}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-(--muted)">
                    {p.excerpt}
                  </p>
                  <div className="mt-auto pt-6 flex items-center text-sm font-medium text-(--accent) opacity-0 transition-opacity group-hover:opacity-100">
                    Read more <span className="ml-1">→</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </StaggerReveal>

        {filteredPosts.length === 0 && (
          <div className="py-20 text-center text-(--muted)">
            No articles found for this category.
          </div>
        )}
      </Container>
    </Section>
  );
}
