import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const slug = "ai-pipelines-at-scale";
  
  const existing = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (existing) {
    console.log(`Post with slug ${slug} already exists.`);
    return;
  }

  await prisma.blogPost.create({
    data: {
      slug,
      title: "Building Reliable AI Pipelines at Scale",
      excerpt: "Designing evaluation loops, observability, and safe fallbacks for production AI features.",
      content: `
        <h2>Introduction</h2>
        <p>Building AI features is easy. Building reliable AI features at scale is hard.</p>
        <p>In this post, we'll explore how to design robust evaluation loops, implement deep observability, and ensure safe fallbacks when the model fails.</p>
        
        <h3>1. Evaluation Loops</h3>
        <p>You can't improve what you don't measure. We use a combination of automated eval sets and human-in-the-loop review.</p>
        
        <h3>2. Observability</h3>
        <p>Tracing every LLM call is crucial. We track latency, token usage, and cost per feature.</p>
        
        <h3>3. Fallbacks</h3>
        <p>Always have a deterministic fallback. If the LLM times out or hallucinates, show a safe default or a cached response.</p>
        
        <h2>Conclusion</h2>
        <p>Reliability is a feature. Don't ship without it.</p>
      `,
      tags: ["AI", "Engineering"],
      published: true,
      publishedAt: new Date(),
      viewCount: 100,
      likeCount: 42,
    },
  });

  console.log(`Seeded post: ${slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
