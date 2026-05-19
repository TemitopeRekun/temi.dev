import { PrismaClient } from "@prisma/client";

declare const process: any;

const prisma = new PrismaClient();

async function main() {
  const slug = "ai-pipelines-at-scale";
  
  const postData = {
    title: "Building Reliable AI Pipelines at Scale",
    excerpt: "Designing evaluation loops, observability, and safe fallbacks for production AI features.",
    content: `## Introduction
Building AI features is easy. Building reliable AI features at scale is hard.

In this post, we'll explore how to design robust evaluation loops, implement deep observability, and ensure safe fallbacks when the model fails.

### 1. Evaluation Loops
You can't improve what you don't measure. We use a combination of automated eval sets and human-in-the-loop review.

### 2. Observability
Tracing every LLM call is crucial. We track latency, token usage, and cost per feature.

### 3. Fallbacks
Always have a deterministic fallback. If the LLM times out or hallucinates, show a safe default or a cached response.

## Conclusion
Reliability is a feature. Don't ship without it.`,
    tags: ["AI", "Engineering"],
    published: true,
    publishedAt: new Date(),
  };

  await prisma.blogPost.upsert({
    where: { slug },
    update: postData,
    create: {
      slug,
      ...postData,
    },
  });

  console.log(`Seeded/Updated post: ${slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
