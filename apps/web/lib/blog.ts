export type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  image: string;
  readTime: number;
  content?: string;
  publishedAt?: string;
  likeCount?: number;
};

export type Comment = {
  id: string;
  content: string;
  author: string;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export function seededLikes(seed: string, min = 8, range = 50): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return min + (hash % range);
}

export async function getPosts(): Promise<BlogPost[]> {
  try {
    const isDev = process.env.NODE_ENV !== "production";
    const res = await fetch(`${API_URL}/api/blog?take=50`, {
      ...(isDev ? { cache: "no-store" } : { next: { revalidate: 60 } }),
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
      // content: item.content, // Exclude content from list to reduce payload
      publishedAt: item.publishedAt,
      likeCount: (item.likeCount || 0) + seededLikes(item.slug),
    }));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export async function getPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  try {
    const res = await fetch(`${API_URL}/api/blog/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const item = await res.json();
      return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        tag: item.tags?.[0] || "Tech",
        excerpt: item.excerpt || "",
        image:
          item.coverImage ||
          item.image ||
          `https://picsum.photos/1200/800?seed=${item.slug}`,
        readTime: Math.ceil((item.content?.length || 1000) / 1000),
        content: item.content,
        publishedAt: item.publishedAt,
        likeCount: (item.likeCount || 0) + seededLikes(item.slug),
      };
    }
  } catch {
    // ignore
  }

  return undefined;
}

export async function getComments(slug: string): Promise<Comment[]> {
  try {
    const res = await fetch(`${API_URL}/api/blog/${slug}/comments`, {
      cache: "no-store",
    });
    if (res.ok) {
      return res.json();
    }
    return [];
  } catch {
    return [];
  }
}
