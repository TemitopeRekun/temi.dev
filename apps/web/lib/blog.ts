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

// Placeholder data
export const posts: BlogPost[] = [
  {
    id: "mock-1",
    slug: "ai-pipelines-at-scale",
    title: "Building Reliable AI Pipelines at Scale",
    tag: "AI",
    excerpt:
      "Designing evaluation loops, observability, and safe fallbacks for production AI features.",
    image: "https://picsum.photos/1200/800?random=1",
    readTime: 6,
    likeCount: 42,
  },
  {
    id: "mock-2",
    slug: "nextjs-15-ssr",
    title: "Next.js 15: SSR Patterns That Scale",
    tag: "Web",
    excerpt:
      "Leverage Server Components, caching, and edge for performance without complexity.",
    image: "https://picsum.photos/1200/800?random=2",
    readTime: 5,
    likeCount: 12,
  },
  {
    id: "mock-3",
    slug: "nestjs-modules",
    title: "Production-Ready NestJS Modules",
    tag: "Backend",
    excerpt:
      "Patterns for maintainable services, DTO validation, and cross-module communication.",
    image: "https://picsum.photos/1200/800?random=3",
    readTime: 7,
    likeCount: 8,
  },
  {
    id: "mock-4",
    slug: "r3f-ux",
    title: "3D UX with R3F",
    tag: "3D",
    excerpt:
      "Blend subtle motion and lighting to enhance narrative without compromising accessibility.",
    image: "https://picsum.photos/1200/800?random=4",
    readTime: 4,
    likeCount: 25,
  },
  {
    id: "mock-5",
    slug: "mobile-design-systems",
    title: "Mobile Design Systems with React Native",
    tag: "Mobile",
    excerpt:
      "Build once, ship everywhere—shared primitives and tokens across web and mobile.",
    image: "https://picsum.photos/1200/800?random=5",
    readTime: 5,
    likeCount: 19,
  },
  {
    id: "mock-6",
    slug: "pgvector-rag",
    title: "RAG with pgvector",
    tag: "Data",
    excerpt:
      "Chunking, embeddings, and retrieval patterns that are simple and effective.",
    image: "https://picsum.photos/1200/800?random=6",
    readTime: 6,
    likeCount: 30,
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function getPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/api/blog?take=100`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return posts;
    const data = await res.json();
    if (!data.items || !Array.isArray(data.items)) return posts;

    // Map API response to BlogPost type
    return data.items.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      tag: item.tags?.[0] || "Tech",
      excerpt: item.excerpt || "No excerpt available.",
      image: item.image || `https://picsum.photos/1200/800?seed=${item.slug}`,
      readTime: Math.ceil((item.content?.length || 1000) / 1000), // Rough estimate
      content: item.content,
      publishedAt: item.publishedAt,
      likeCount: item.likeCount || 0,
    }));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return posts;
  }
}

export async function getPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  // Try fetching all posts and finding the one (simplest for now without dedicated slug endpoint)
  // Or if backend has slug endpoint:
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
        image: item.image || `https://picsum.photos/1200/800?seed=${item.slug}`,
        readTime: Math.ceil((item.content?.length || 1000) / 1000),
        content: item.content,
        publishedAt: item.publishedAt,
        likeCount: item.likeCount || 0,
      };
    }
  } catch {}

  // Fallback to static list
  return posts.find((p) => p.slug === slug);
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
