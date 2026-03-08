"use client";

import { useQuery } from "@tanstack/react-query";
import { FeaturedPost } from "./FeaturedPost";
import { BlogList } from "./BlogList";
import { seededLikes } from "../../lib/blog";

function apiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (
    env && env.trim().length > 0 ? env : "http://localhost:4000"
  ) as string;
}

export function BlogContent() {
  const { data: posts = [] } = useQuery({
    queryKey: ["public-blog"],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl()}/api/blog?take=50`, {
        cache: "no-store",
      });
      if (!res.ok) return [];
      const data = await res.json();
      if (!data.items || !Array.isArray(data.items)) return [];
      return data.items.map((item: any) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        tag: item.tags?.[0] || "Tech",
        excerpt: item.excerpt || "No excerpt available.",
        image:
          item.coverImage ||
          item.image ||
          `https://picsum.photos/1200/800?seed=${item.slug}`,
        readTime: Math.ceil((item.content?.length || 1000) / 1000),
        content: item.content,
        publishedAt: item.publishedAt,
        likeCount: (item.likeCount || 0) + seededLikes(item.slug),
      }));
    },
  });

  if (posts.length === 0) {
    return (
      <div className="relative flex min-h-[55vh] flex-col items-center justify-center overflow-hidden pt-32 text-center">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_60%)]" />
        </div>
        <div className="relative rounded-2xl border border-(--border)/20 bg-(--surface) px-6 py-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.6)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-(--border)/30 bg-(--surface)/80 text-2xl">
            ✨
          </div>
          <h1 className="text-2xl font-semibold text-(--text)">
            We're cooking something delightful
          </h1>
          <p className="mt-2 max-w-md text-(--muted)">
            Fresh posts are on the way - stay tuned for new ideas, insights, and
            experiments. 🍳📚
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-(--muted)">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-(--accent)" />
            <span>Publishing soon</span>
          </div>
        </div>
      </div>
    );
  }

  const featured = posts[0];
  const list = posts.slice(1);

  return (
    <>
      <FeaturedPost post={featured} />
      <BlogList posts={list} />
    </>
  );
}
