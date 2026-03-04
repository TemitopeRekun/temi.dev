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

async function main(): Promise<void> {
  const app = await NestFactory.createApplicationContext(ScriptModule);
  const prisma = app.get(PrismaService);
  const ai = app.get(AiService);

  const posts = await prisma.blogPost.findMany({
    select: { id: true, content: true },
  });
  for (const p of posts) {
    if (!p.content) continue;
    const emb = await ai.generateEmbedding(p.content);
    if (emb.length === 0) continue;
    const vec = `'[${emb.map((v) => (Number.isFinite(v) ? v.toFixed(6) : 0)).join(", ")}]'::vector`;
    const idSafe = p.id.replace(/'/g, "''");
    await prisma.$executeRawUnsafe(`UPDATE "BlogPost" SET embedding = ${vec} WHERE id = '${idSafe}'`);
  }

  const projects = await prisma.project.findMany({
    select: { id: true, description: true },
  });
  for (const pr of projects) {
    if (!pr.description) continue;
    const emb = await ai.generateEmbedding(pr.description);
    if (emb.length === 0) continue;
    const vec = `'[${emb.map((v) => (Number.isFinite(v) ? v.toFixed(6) : 0)).join(", ")}]'::vector`;
    const idSafe = pr.id.replace(/'/g, "''");
    await prisma.$executeRawUnsafe(`UPDATE "Project" SET embedding = ${vec} WHERE id = '${idSafe}'`);
  }

  await app.close();
}

void main();
