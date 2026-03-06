import "reflect-metadata";
import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { AiModule } from "../modules/ai/ai.module";
import { AiService } from "../modules/ai/ai.service";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AiModule],
})
class ScriptModule {}

const BLOG_POSTS = [
  {
    slug: "ai-pipelines-at-scale",
    title: "Building Reliable AI Pipelines at Scale",
    tag: "AI",
    excerpt: "Designing evaluation loops, observability, and safe fallbacks for production AI features.",
    content: `
      <h2>The Challenge of Production AI</h2>
      <p>Building AI prototypes is easy; shipping reliable AI features to production is hard. The non-deterministic nature of LLMs introduces a new class of failures that traditional software engineering practices aren't fully equipped to handle. In this post, we'll explore how to build robust AI pipelines that can withstand the chaos of the real world.</p>

      <h2>Evaluation Loops</h2>
      <p>The core of any reliable AI system is a strong evaluation loop. You cannot improve what you cannot measure. We recommend a three-tiered approach: unit tests for deterministic components, model-graded evals for semantic correctness, and human-in-the-loop validation for edge cases. Tools like Ragas or custom evaluation harnesses using stronger models (like GPT-4 or Gemini 1.5 Pro) to grade weaker models (like Gemini 1.5 Flash) are essential.</p>

      <h2>Observability and Tracing</h2>
      <p>When an AI feature fails, you need to know why. Was it a retrieval failure in your RAG pipeline? A hallucination by the model? Or a latency timeout? implementing comprehensive tracing with tools like LangSmith or OpenTelemetry allows you to visualize the entire chain of thought. Tagging traces with user feedback (thumbs up/down) provides a goldmine of data for fine-tuning.</p>

      <h2>Safe Fallbacks</h2>
      <p>Never let the user see a raw JSON error or a timeout. Always implement graceful fallbacks. If the primary model fails, fall back to a smaller, faster model or even a heuristic-based approach. For RAG systems, if retrieval yields no relevant documents, the system should admit ignorance rather than hallucinating an answer. "I don't know" is a perfectly valid and safe response in a production system.</p>
    `,
    image: "https://picsum.photos/1200/800?seed=ai-pipeline",
    readTime: 6,
    published: true,
    viewCount: 120,
  },
  {
    slug: "nextjs-15-ssr",
    title: "Next.js 15: SSR Patterns That Scale",
    tag: "Web",
    excerpt: "Leverage Server Components, caching, and edge for performance without complexity.",
    content: `
      <h2>Embracing the Server</h2>
      <p>Next.js 15 continues to push the boundaries of what's possible with React Server Components (RSC). By moving data fetching to the server, we reduce the client-side JavaScript bundle, leading to faster First Contentful Paint (FCP) and better SEO. But with great power comes great responsibility—specifically, managing the waterfall of network requests.</p>

      <h2>Caching Strategies</h2>
      <p>The granular caching mechanisms in Next.js 15 allow us to cache data at the request level, route level, or globally. Understanding the difference between \`force-cache\`, \`no-store\`, and revalidation periods is crucial. We've found that a "stale-while-revalidate" strategy works best for content-heavy sites like blogs, while dynamic dashboards benefit from streaming server components with \`Suspense\` boundaries.</p>

      <h2>Edge Rendering</h2>
      <p>For global applications, edge runtime can significantly reduce latency. However, it comes with constraints—no Node.js APIs, limited database connections. We recommend a hybrid approach: use Node.js runtime for complex mutations and database interactions, and Edge runtime for personalized, read-heavy views that rely on cached data or lightweight APIs.</p>
    `,
    image: "https://picsum.photos/1200/800?seed=nextjs",
    readTime: 5,
    published: true,
    viewCount: 85,
  },
  {
    slug: "nestjs-modules",
    title: "Production-Ready NestJS Modules",
    tag: "Backend",
    excerpt: "Patterns for maintainable services, DTO validation, and cross-module communication.",
    content: `
      <h2>Modular Architecture</h2>
      <p>NestJS shines in its ability to enforce a modular architecture. But simply creating modules isn't enough; you need to define clear boundaries. We advocate for a Domain-Driven Design (DDD) approach where each module encapsulates a specific domain (e.g., Auth, Billing, Users). Circular dependencies are a smell that your boundaries are leaking.</p>

      <h2>DTOs and Validation</h2>
      <p>Never trust user input. NestJS's validation pipe combined with \`class-validator\` and \`class-transformer\` provides a robust defense. Define strict DTOs for every input and output. Use \`whitelist: true\` to strip unexpected properties. This not only secures your API but also serves as self-documenting code for frontend consumers.</p>

      <h2>Cross-Module Communication</h2>
      <p>When Module A needs data from Module B, direct imports create tight coupling. Instead, consider using an event-driven architecture with \`@nestjs/event-emitter\` for side effects (like sending a welcome email after registration). For synchronous needs, expose a clean public API service within the module, or better yet, use a shared library for common interfaces.</p>
    `,
    image: "https://picsum.photos/1200/800?seed=nestjs",
    readTime: 7,
    published: true,
    viewCount: 95,
  },
  {
    slug: "r3f-ux",
    title: "3D UX with R3F",
    tag: "3D",
    excerpt: "Blend subtle motion and lighting to enhance narrative without compromising accessibility.",
    content: `
      <h2>The Third Dimension</h2>
      <p>Adding 3D elements to a web page can elevate the user experience from flat to immersive. React Three Fiber (R3F) makes this accessible to React developers. However, the key is subtlety. A spinning cube is a gimmick; a reactive background that responds to mouse movement adds depth and polish.</p>

      <h2>Performance First</h2>
      <p>WebGL contexts are heavy. Always use \`drei\`'s performance monitoring tools to downgrade quality on lower-end devices. Use instanced meshes for repetitive elements. And crucially, ensure your site is fully functional without the 3D canvas—progressive enhancement is the name of the game.</p>
      
      <h2>Accessibility</h2>
      <p>3D should never impede accessibility. Ensure screen readers can still navigate your content. Use \`aria-label\` on canvas elements if they are interactive. Respect the user's \`prefers-reduced-motion\` setting by disabling or slowing down animations.</p>
    `,
    image: "https://picsum.photos/1200/800?seed=r3f",
    readTime: 4,
    published: true,
    viewCount: 60,
  },
  {
    slug: "mobile-design-systems",
    title: "Mobile Design Systems with React Native",
    tag: "Mobile",
    excerpt: "Build once, ship everywhere—shared primitives and tokens across web and mobile.",
    content: `
      <h2>Universal Design Tokens</h2>
      <p>The dream of "write once, run everywhere" starts with design tokens. By defining your colors, spacing, and typography in a platform-agnostic format (like JSON), you can generate theme files for both Tailwind (Web) and Tamagui/NativeWind (Mobile). This ensures brand consistency across all touchpoints.</p>
      
      <h2>Shared Primitives</h2>
      <p>React Native Web has matured significantly. You can build shared UI primitives (Buttons, Cards, Inputs) that render as \`<div>\` on web and \`<View>\` on mobile. Monorepos with tools like Turborepo make sharing these components seamless. However, always be ready to fork implementation for platform-specific nuances, like navigation or gestures.</p>
    `,
    image: "https://picsum.photos/1200/800?seed=mobile",
    readTime: 5,
    published: true,
    viewCount: 45,
  },
  {
    slug: "pgvector-rag",
    title: "RAG with pgvector",
    tag: "Data",
    excerpt: "Chunking, embeddings, and retrieval patterns that are simple and effective.",
    content: `
      <h2>Why pgvector?</h2>
      <p>You don't always need a specialized vector database like Pinecone or Weaviate. If you're already using PostgreSQL, \`pgvector\` allows you to keep your vector data right alongside your relational data. This simplifies your stack, reduces latency, and allows for powerful hybrid queries (e.g., "find vectors similar to X but only where user_id = Y").</p>
      
      <h2>Chunking Strategies</h2>
      <p>The quality of your retrieval depends heavily on how you chunk your data. Naive splitting by character count often breaks semantic meaning. We recommend recursive character splitting or even semantic splitting based on embedding similarity. Overlapping chunks ensures that context isn't lost at the boundaries.</p>
    `,
    image: "https://picsum.photos/1200/800?seed=rag",
    readTime: 6,
    published: true,
    viewCount: 110,
  },
];

const PROJECTS = [
  {
    title: "AI-First Portfolio",
    slug: "nextjs-portfolio",
    description: "A performant, theme-aware portfolio with GSAP interactions, R3F visuals, and Server Components. Built with Next.js 15 and Tailwind CSS.",
    techStack: ["Next.js 15", "Tailwind CSS", "GSAP", "R3F"],
    liveUrl: "https://temi.dev",
    repoUrl: "https://github.com/temitopeog/portfolio",
    featured: true,
    order: 1,
  },
  {
    title: "Modular API Platform",
    slug: "nestjs-api",
    description: "Production-ready NestJS service with clean modules, DTO validation, and vector search. Implements a scalable architecture for microservices.",
    techStack: ["NestJS", "PostgreSQL", "Prisma", "pgvector"],
    liveUrl: "https://api.temi.dev",
    repoUrl: "https://github.com/temitopeog/nest-api",
    featured: true,
    order: 2,
  },
  {
    title: "AI Automation Suite",
    slug: "ai-automation",
    description: "Background AI workflows with Gemini, pgvector RAG, and resilient job queues via BullMQ. Automates lead scoring and content generation.",
    techStack: ["Gemini", "RAG", "BullMQ", "TypeScript"],
    liveUrl: "https://temi.dev/ai",
    repoUrl: "https://github.com/temitopeog/ai-automation",
    featured: true,
    order: 3,
  },
  {
    title: "React Native App",
    slug: "react-native-app",
    description: "Cross-platform mobile experience with Expo and smooth native interactions. Demonstrates shared code patterns between web and mobile.",
    techStack: ["React Native", "Expo", "Zustand"],
    liveUrl: "https://expo.dev/@temitopeog/app",
    repoUrl: "https://github.com/temitopeog/react-native-app",
    featured: false,
    order: 4,
  },
];

async function main(): Promise<void> {
  console.log("Starting seed...");
  const app = await NestFactory.createApplicationContext(ScriptModule);
  const prisma = app.get(PrismaService);
  const ai = app.get(AiService);

  // Seed Blog Posts
  for (const post of BLOG_POSTS) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
    });
    if (!existing) {
      console.log(`Creating post: ${post.title}`);
      const created = await prisma.blogPost.create({
        data: {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          tags: [post.tag],
          published: post.published,
          publishedAt: new Date(),
          viewCount: post.viewCount,
        },
      });
      
      // Generate Embedding
      console.log(`Generating embedding for: ${post.title}`);
      try {
        const emb = await ai.generateEmbedding(post.content);
        if (emb.length > 0) {
          const vec = `'[${emb.map((v) => (Number.isFinite(v) ? v.toFixed(6) : 0)).join(", ")}]'::vector`;
          await prisma.$executeRawUnsafe(`UPDATE "BlogPost" SET embedding = ${vec} WHERE id = '${created.id}'`);
          console.log(`Embedding saved for: ${post.title}`);
        } else {
            console.warn(`Embedding generation returned empty for: ${post.title}`);
        }
      } catch (e) {
        console.error(`Failed to generate embedding for ${post.title}:`, e);
      }
    } else {
      console.log(`Post already exists: ${post.title}`);
    }
  }

  // Seed Projects
  for (const project of PROJECTS) {
    const existing = await prisma.project.findFirst({
      where: { title: project.title },
    });
    if (!existing) {
      console.log(`Creating project: ${project.title}`);
      const created = await prisma.project.create({
        data: {
            title: project.title,
            description: project.description,
            techStack: project.techStack,
            liveUrl: project.liveUrl,
            repoUrl: project.repoUrl,
            featured: project.featured,
            order: project.order,
        }
      });

      // Generate Embedding
      console.log(`Generating embedding for: ${project.title}`);
      try {
        const emb = await ai.generateEmbedding(project.description);
        if (emb.length > 0) {
          const vec = `'[${emb.map((v) => (Number.isFinite(v) ? v.toFixed(6) : 0)).join(", ")}]'::vector`;
          await prisma.$executeRawUnsafe(`UPDATE "Project" SET embedding = ${vec} WHERE id = '${created.id}'`);
          console.log(`Embedding saved for: ${project.title}`);
        } else {
            console.warn(`Embedding generation returned empty for: ${project.title}`);
        }
      } catch (e) {
        console.error(`Failed to generate embedding for ${project.title}:`, e);
      }
    } else {
        console.log(`Project already exists: ${project.title}`);
    }
  }

  console.log("Seed completed.");
  await app.close();
}

void main();
