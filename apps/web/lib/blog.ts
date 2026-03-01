export type BlogPost = {
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  image: string;
  readTime: number;
};

export const posts: BlogPost[] = [
  {
    slug: "ai-pipelines-at-scale",
    title: "Building Reliable AI Pipelines at Scale",
    tag: "AI",
    excerpt:
      "Designing evaluation loops, observability, and safe fallbacks for production AI features.",
    image: "https://picsum.photos/1200/800?random=1",
    readTime: 6,
  },
  {
    slug: "nextjs-15-ssr",
    title: "Next.js 15: SSR Patterns That Scale",
    tag: "Web",
    excerpt:
      "Leverage Server Components, caching, and edge for performance without complexity.",
    image: "https://picsum.photos/1200/800?random=2",
    readTime: 5,
  },
  {
    slug: "nestjs-modules",
    title: "Production-Ready NestJS Modules",
    tag: "Backend",
    excerpt:
      "Patterns for maintainable services, DTO validation, and cross-module communication.",
    image: "https://picsum.photos/1200/800?random=3",
    readTime: 7,
  },
  {
    slug: "r3f-ux",
    title: "3D UX with R3F",
    tag: "3D",
    excerpt:
      "Blend subtle motion and lighting to enhance narrative without compromising accessibility.",
    image: "https://picsum.photos/1200/800?random=4",
    readTime: 4,
  },
  {
    slug: "mobile-design-systems",
    title: "Mobile Design Systems with React Native",
    tag: "Mobile",
    excerpt:
      "Build once, ship everywhere—shared primitives and tokens across web and mobile.",
    image: "https://picsum.photos/1200/800?random=5",
    readTime: 5,
  },
  {
    slug: "pgvector-rag",
    title: "RAG with pgvector",
    tag: "Data",
    excerpt:
      "Chunking, embeddings, and retrieval patterns that are simple and effective.",
    image: "https://picsum.photos/1200/800?random=6",
    readTime: 6,
  },
];

