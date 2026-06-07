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
};

// Raw shape returned by the API before mapping to `BlogPost`.
export type RawBlogItem = {
  id?: string;
  slug: string;
  title: string;
  tags?: string[];
  excerpt?: string;
  coverImage?: string;
  image?: string;
  content?: string;
  publishedAt?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function getPosts(): Promise<BlogPost[]> {
  try {
    const isDev = process.env.NODE_ENV !== "production";
    const res = await fetch(`${API_URL}/api/blog?take=50`, {
      ...(isDev ? { cache: "no-store" } : { next: { revalidate: 60 } }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.items || !Array.isArray(data.items)) return [];

    return data.items.map((item: RawBlogItem) => ({
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
      publishedAt: item.publishedAt,
    }));
  } catch {
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
      };
    }
  } catch {
    // ignore
  }

  return undefined;
}
