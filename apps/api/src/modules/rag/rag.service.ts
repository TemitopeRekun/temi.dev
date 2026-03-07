import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AiService } from "../ai/ai.service";
import { readFile } from "fs/promises";
import { resolve } from "path";

@Injectable()
export class RagService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  async askArticle(
    articleId: string,
    question: string,
  ): Promise<{ answer: string; sources: Array<{ title: string }> }> {
    if (!articleId || !question)
      throw new BadRequestException("articleId and question are required");
    const post = await this.prisma.blogPost.findUnique({
      where: { id: articleId },
      select: { id: true, title: true, content: true },
    });
    if (!post) throw new NotFoundException("Article not found");
    const answer = await this.ai.generateDigitalBrainResponse(question, post.content);
    return { answer, sources: [{ title: post.title }] };
  }

  async askWebsite(question: string): Promise<{
    answer: string;
    sources: Array<{ title: string; similarity: number }>;
  }> {
    if (!question) throw new BadRequestException("question is required");
    const blogMatches = await this.ai.semanticSearch(question, "BlogPost", 5);
    const projectMatches = await this.ai.semanticSearch(question, "Project", 5);
    const combined = [...blogMatches, ...projectMatches]
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 8);
    const context = combined
      .map((m) => `Title: ${m.title}\n\n${m.content}`)
      .join("\n\n---\n\n");
    const answer = await this.ai.generateDigitalBrainResponse(question, context);
    const sources = combined.map((m) => ({
      title: m.title,
      similarity: m.similarity,
    }));
    return { answer, sources };
  }

  async summarizeArticle(articleId: string): Promise<{ summary: string }> {
    if (!articleId) throw new BadRequestException("articleId is required");
    const post = await this.prisma.blogPost.findUnique({
      where: { id: articleId },
      select: { id: true, title: true, content: true },
    });
    if (!post) throw new NotFoundException("Article not found");
    const path = resolve(
      process.cwd(),
      "../../packages/ai/prompts/article-summary.txt",
    );
    const tmpl = await readFile(path, "utf8").catch(() => "");
    const prompt = tmpl
      ? tmpl
      : "Provide a concise 6–8 sentence summary capturing key points, highlights, and conclusions.";
    const summary = await this.ai.generateCompletion(prompt, post.content);
    return { summary };
  }

  async embedArticle(articleId: string): Promise<{ ok: boolean }> {
    if (!articleId) throw new BadRequestException("articleId is required");
    const post = await this.prisma.blogPost.findUnique({
      where: { id: articleId },
      select: { id: true, content: true },
    });
    if (!post) throw new NotFoundException("Article not found");
    const embedding = await this.ai.generateEmbedding(post.content);
    if (!embedding || embedding.length === 0)
      throw new BadRequestException("Embedding failed");
    const vecLiteral = `'[${embedding.map((v) => (Number.isFinite(v) ? v.toFixed(6) : 0)).join(", ")}]'::vector`;
    const sql = `UPDATE "BlogPost" SET embedding = ${vecLiteral} WHERE id = '${post.id}'`;
    try {
      await this.prisma.$executeRawUnsafe(sql);
      return { ok: true };
    } catch {
      throw new BadRequestException(
        "Failed to store embedding. Ensure pgvector and column exist.",
      );
    }
  }

  async embedProject(projectId: string): Promise<{ ok: boolean }> {
    if (!projectId) throw new BadRequestException("projectId is required");
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, description: true },
    });
    if (!project) throw new NotFoundException("Project not found");
    const embedding = await this.ai.generateEmbedding(project.description);
    if (!embedding || embedding.length === 0)
      throw new BadRequestException("Embedding failed");
    const vecLiteral = `'[${embedding.map((v) => (Number.isFinite(v) ? v.toFixed(6) : 0)).join(", ")}]'::vector`;
    const sql = `UPDATE "Project" SET embedding = ${vecLiteral} WHERE id = '${project.id}'`;
    try {
      await this.prisma.$executeRawUnsafe(sql);
      return { ok: true };
    } catch {
      throw new BadRequestException(
        "Failed to store embedding. Ensure pgvector and column exist.",
      );
    }
  }
}
