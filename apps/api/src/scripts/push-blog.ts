/**
 * Push blog post content to the database.
 *
 * The seed (seed-data.ts) is create-only — it skips posts that already exist,
 * so it can't update a live post's content. This script fills that gap: it
 * writes directly to the DB via Prisma (same access the seed uses through
 * DATABASE_URL) and regenerates the post's search embedding so RAG stays in
 * sync with the new content.
 *
 * Usage:
 *   pnpm --filter api push:blog                 # update every post in BLOG_POSTS
 *   SLUG=barely-scratched-the-surface \
 *     pnpm --filter api push:blog               # update just one post
 */
import "reflect-metadata";
import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { AiModule } from "../modules/ai/ai.module";
import { AiService } from "../modules/ai/ai.service";
import { BLOG_POSTS } from "./seed-data";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AiModule],
})
class ScriptModule {}

async function main(): Promise<void> {
  const onlySlug = process.env.SLUG;
  const posts = onlySlug
    ? BLOG_POSTS.filter((p) => p.slug === onlySlug)
    : BLOG_POSTS;

  if (posts.length === 0) {
    console.error(
      onlySlug ? `No post with slug "${onlySlug}".` : "No posts to push.",
    );
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(ScriptModule);
  const prisma = app.get(PrismaService);
  const ai = app.get(AiService);

  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
    });
    if (!existing) {
      console.warn(`✗ not found, skipping: ${post.slug}`);
      continue;
    }

    await prisma.blogPost.update({
      where: { slug: post.slug },
      data: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        tags: "tags" in post ? post.tags : [post.tag],
        published: post.published,
      },
    });
    console.log(`✓ updated: ${post.slug}`);

    try {
      const emb = await ai.generateEmbedding(post.content);
      if (emb.length > 0) {
        const vec = `'[${emb.map((v) => (Number.isFinite(v) ? v.toFixed(6) : 0)).join(", ")}]'::vector`;
        await prisma.$executeRawUnsafe(
          `UPDATE "BlogPost" SET embedding = ${vec} WHERE id = '${existing.id}'`,
        );
        console.log(`  embedding regenerated: ${post.slug}`);
      } else {
        console.warn(`  embedding empty, left unchanged: ${post.slug}`);
      }
    } catch (e) {
      console.error(`  embedding failed for ${post.slug}:`, e);
    }
  }

  await app.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
