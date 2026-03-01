export type ProjectCategory = "Frontend" | "Backend" | "AI" | "Mobile";

export type Project = {
  slug: string;
  title: string;
  year: number;
  category: ProjectCategory;
  tags: string[];
  description: string;
  image: string;
  liveUrl: string;
  repoUrl: string;
};

export const projects: Project[] = [
  {
    slug: "nextjs-portfolio",
    title: "AI-First Portfolio",
    year: 2026,
    category: "Frontend",
    tags: ["Next.js 15", "Tailwind CSS", "GSAP", "R3F"],
    description:
      "A performant, theme-aware portfolio with GSAP interactions, R3F visuals, and Server Components.",
    image: "https://picsum.photos/seed/nextjs/1200/800",
    liveUrl: "https://temi.dev",
    repoUrl: "https://github.com/temitopeog/portfolio",
  },
  {
    slug: "nestjs-api",
    title: "Modular API Platform",
    year: 2026,
    category: "Backend",
    tags: ["NestJS", "PostgreSQL", "Prisma", "pgvector"],
    description:
      "Production-ready NestJS service with clean modules, DTO validation, and vector search.",
    image: "https://picsum.photos/seed/nestjs/1200/800",
    liveUrl: "https://api.temi.dev",
    repoUrl: "https://github.com/temitopeog/nest-api",
  },
  {
    slug: "ai-automation",
    title: "AI Automation Suite",
    year: 2026,
    category: "AI",
    tags: ["Gemini", "RAG", "BullMQ", "TypeScript"],
    description:
      "Background AI workflows with Gemini, pgvector RAG, and resilient job queues via BullMQ.",
    image: "https://picsum.photos/seed/ai/1200/800",
    liveUrl: "https://temi.dev/ai",
    repoUrl: "https://github.com/temitopeog/ai-automation",
  },
  {
    slug: "react-native-app",
    title: "React Native App",
    year: 2025,
    category: "Mobile",
    tags: ["React Native", "Expo", "Zustand"],
    description:
      "Cross-platform mobile experience with Expo and smooth native interactions.",
    image: "https://picsum.photos/seed/rn/1200/800",
    liveUrl: "https://expo.dev/@temitopeog/app",
    repoUrl: "https://github.com/temitopeog/react-native-app",
  },
];
