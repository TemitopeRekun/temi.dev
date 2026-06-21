import { z } from "zod";

export type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  tag: string;
  tags: string[];
  excerpt: string;
  image: string;
  readTime: number;
  content?: string;
  publishedAt?: string;
  updatedAt?: string;
};

// Nullable DB columns (excerpt, coverImage, publishedAt, ...) come back as JSON
// `null`, so optional string fields use `.nullish()` (string|null|undefined) —
// `.optional()` alone rejects null and would fail the whole list parse.
const rawBlogItemSchema = z.object({
  id: z.string().nullish(),
  slug: z.string(),
  title: z.string(),
  tags: z.array(z.string()).nullish(),
  excerpt: z.string().nullish(),
  coverImage: z.string().nullish(),
  image: z.string().nullish(),
  content: z.string().nullish(),
  publishedAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
});

// Derived from the schema so the type always matches what safeParse accepts.
export type RawBlogItem = z.infer<typeof rawBlogItemSchema>;

const blogListSchema = z.object({
  items: z.array(rawBlogItemSchema),
});

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

/** Estimate reading time at ~200 words per minute, minimum 1 minute. */
export function estimateReadTime(content?: string | null): number {
  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  return Math.max(1, Math.round(wordCount / 200));
}

function mapBlogItem(item: RawBlogItem): BlogPost {
  return {
    id: item.id ?? undefined,
    slug: item.slug,
    title: item.title,
    tag: item.tags?.[0] || "Tech",
    tags: item.tags || [],
    excerpt: item.excerpt || "No excerpt available.",
    image: item.coverImage || item.image || `/blog/${item.slug}/og`,
    readTime: estimateReadTime(item.content),
    content: item.content ?? undefined,
    publishedAt: item.publishedAt ?? undefined,
    updatedAt: item.updatedAt ?? undefined,
  };
}

export async function getPosts(): Promise<BlogPost[]> {
  try {
    const isDev = process.env.NODE_ENV !== "production";
    const res = await fetch(`${API_URL}/api/blog?take=50`, {
      ...(isDev ? { cache: "no-store" } : { next: { revalidate: 60 } }),
    });
    if (!res.ok) {
      console.error(`[blog] getPosts: upstream returned ${res.status}`);
      return [];
    }
    const data = await res.json();
    const parsed = blogListSchema.safeParse(data);
    if (!parsed.success) {
      console.error("[blog] getPosts: unexpected payload shape", parsed.error.issues);
      return [];
    }
    return parsed.data.items.map(mapBlogItem);
  } catch (err) {
    console.error("[blog] getPosts: fetch failed", err);
    return [];
  }
}

export async function getPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  try {
    const isDev = process.env.NODE_ENV !== "production";
    const res = await fetch(`${API_URL}/api/blog/${slug}`, {
      ...(isDev ? { cache: "no-store" } : { next: { revalidate: 60 } }),
    });
    if (!res.ok) {
      if (res.status !== 404) {
        console.error(`[blog] getPostBySlug(${slug}): upstream returned ${res.status}`);
      }
      return undefined;
    }
    const data = await res.json();
    const parsed = rawBlogItemSchema.safeParse(data);
    if (!parsed.success) {
      console.error(
        `[blog] getPostBySlug(${slug}): unexpected payload shape`,
        parsed.error.issues,
      );
      return undefined;
    }
    return mapBlogItem(parsed.data);
  } catch (err) {
    console.error(`[blog] getPostBySlug(${slug}): fetch failed`, err);
    return undefined;
  }
}
