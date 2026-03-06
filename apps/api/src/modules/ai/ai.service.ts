import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { GoogleGenerativeAI } from "@google/generative-ai";

type TableName = "BlogPost" | "Project";

@Injectable()
export class AiService {
  private readonly apiKey: string;
  private readonly embeddingModel: string;
  private readonly generationModel: string;
  private readonly genAI: GoogleGenerativeAI | null;
  private readonly prismaLike: {
    aiRequestLog: { create(args: unknown): Promise<unknown> };
  };

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.apiKey = this.config.get<string>("GEMINI_API_KEY") ?? "";
    this.embeddingModel =
      this.config.get<string>("GEMINI_EMBEDDING_MODEL") ?? "text-embedding-004";
    this.generationModel =
      this.config.get<string>("GEMINI_MODEL") ?? "gemini-2.5-flash";
    this.genAI = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
    this.prismaLike = this.prisma as unknown as {
      aiRequestLog: { create(args: unknown): Promise<unknown> };
    };
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.genAI) throw new BadRequestException("GEMINI_API_KEY missing");
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.embeddingModel,
      });
      const started = Date.now();
      const res = await model.embedContent(text);
      const values = res.embedding?.values ?? [];
      if (!Array.isArray(values) || values.length === 0) return [];
      const out = values.map((v) => Number(v));
      const duration = Date.now() - started;
      // NOTE: custom implementation — minimal DB logging for AI observability
      await this.prismaLike.aiRequestLog.create({
        data: {
          model: this.embeddingModel,
          input: text.slice(0, 2000),
          output: `dims=${out.length}; sample=[${out
            .slice(0, 8)
            .map((v) => v.toFixed(6))
            .join(", ")}]`,
          durationMs: duration,
        },
      } as unknown);
      return out;
    } catch {
      return [];
    }
  }

  async generateCompletion(prompt: string, context: string): Promise<string> {
    if (!this.genAI) throw new BadRequestException("GEMINI_API_KEY missing");
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.generationModel,
      });

      const fullPrompt = `Based on the following context, answer the user's question.
If the context doesn't contain the answer, say you don't know. Format your response using Markdown (e.g., paragraphs, lists, bolding).

Context:
---
${context}
---

Question: ${prompt}
`;

      const started = Date.now();
      const res = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: { maxOutputTokens: 1024 },
      });
      const text = res.response?.text?.() ?? "";
      const duration = Date.now() - started;
      // NOTE: custom implementation — minimal DB logging for AI observability
      await this.prismaLike.aiRequestLog.create({
        data: {
          model: this.generationModel,
          input: fullPrompt.slice(0, 4000),
          output: text.slice(0, 4000),
          durationMs: duration,
        },
      } as unknown);
      return text;
    } catch (error) {
      console.error("AI Generation Error:", error);
      if (error instanceof Error) {
        // Pass the underlying error message to the client for better debugging.
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        "An unknown error occurred while generating the AI response.",
      );
    }
  }

  async semanticSearch(
    query: string,
    tableName: TableName,
    limit = 5,
  ): Promise<
    Array<{ id: string; title: string; content: string; similarity: number }>
  > {
    const embedding = await this.generateEmbedding(query);
    if (embedding.length === 0) return [];
    const table = tableName === "BlogPost" ? `"BlogPost"` : `"Project"`;
    const columnContent = tableName === "BlogPost" ? "content" : "description";
    const columnTitle = tableName === "BlogPost" ? "title" : "title";
    const embeddingColumn = "embedding";
    const vecLiteral = `'[${embedding.map((v) => (Number.isFinite(v) ? v.toFixed(6) : 0)).join(", ")}]'::vector`;
    const sql = `
      SELECT id, ${columnTitle} AS title, ${columnContent} AS content,
             1 - (${embeddingColumn} <=> ${vecLiteral}) AS similarity
      FROM ${table}
      WHERE ${embeddingColumn} IS NOT NULL
        AND 1 - (${embeddingColumn} <=> ${vecLiteral}) >= 0.7
      ORDER BY ${embeddingColumn} <=> ${vecLiteral} ASC
      LIMIT ${Math.max(1, Math.min(50, limit))}
    `;
    try {
      const rows = await this.prisma.$queryRawUnsafe<
        Array<{
          id: string;
          title: string;
          content: string;
          similarity: number;
        }>
      >(sql);
      return rows ?? [];
    } catch {
      const fallback:
        | Array<{ id: string; title: string; content: string }>
        | Array<{ id: string; title: string; description: string }> =
        tableName === "BlogPost"
          ? await this.prisma.blogPost.findMany({
              where: { content: { contains: query, mode: "insensitive" } },
              select: { id: true, title: true, content: true },
              take: limit,
            })
          : await this.prisma.project.findMany({
              where: { description: { contains: query, mode: "insensitive" } },
              select: { id: true, title: true, description: true },
              take: limit,
            });
      if (tableName === "BlogPost") {
        return (
          fallback as Array<{ id: string; title: string; content: string }>
        ).map((r) => ({
          id: r.id,
          title: r.title,
          content: r.content,
          similarity: 0.0,
        }));
      }
      return (
        fallback as Array<{ id: string; title: string; description: string }>
      ).map((r) => ({
        id: r.id,
        title: r.title,
        content: r.description,
        similarity: 0.0,
      }));
    }
  }
}
