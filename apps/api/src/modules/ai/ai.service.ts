import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFile } from "fs/promises";
import { resolve } from "path";

type TableName = "BlogPost" | "Project";

@Injectable()
export class AiService {
  private readonly apiKey: string;
  private readonly embeddingModel: string;
  private readonly embeddingDim: number;
  private readonly generationModel: string;
  private readonly genAI: GoogleGenerativeAI | null;
  private persona: string | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.apiKey = this.config.get<string>("GEMINI_API_KEY") ?? "";
    this.embeddingModel =
      this.config.get<string>("GEMINI_EMBEDDING_MODEL") ??
      "gemini-embedding-001";
    // Must match the "vector(N)" column dimension in the Prisma schema.
    this.embeddingDim = Number(
      this.config.get<string>("GEMINI_EMBEDDING_DIM") ?? "768",
    );
    this.generationModel =
      this.config.get<string>("GEMINI_MODEL") ?? "gemini-2.5-flash";
    this.genAI = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
  }

  private async getPersona(): Promise<string> {
    if (this.persona) return this.persona;
    try {
      const path = resolve(process.cwd(), "../../packages/ai/prompts/digital-brain-persona.txt");
      this.persona = await readFile(path, "utf8");
    } catch {
      this.persona = "You are Temitope's Digital Brain, an AI assistant representing Temitope Ogunrekun, a Full-Stack Engineer based in Lagos, Nigeria.";
    }
    return this.persona;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.apiKey) throw new BadRequestException("GEMINI_API_KEY missing");
    // The SDK (v0.24.1) can't request a reduced output dimensionality, so we
    // call the REST endpoint directly with outputDimensionality set to match
    // the vector(N) column. Errors are logged (not silently swallowed) and we
    // return [] so callers fall back gracefully.
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.embeddingModel}:embedContent?key=${this.apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: `models/${this.embeddingModel}`,
          content: { parts: [{ text }] },
          outputDimensionality: this.embeddingDim,
        }),
      });
      if (!res.ok) {
        console.error(
          `Embedding request failed (${this.embeddingModel}): ${res.status} ${await res.text()}`,
        );
        return [];
      }
      const data = (await res.json()) as {
        embedding?: { values?: number[] };
      };
      const values = data.embedding?.values ?? [];
      if (!Array.isArray(values) || values.length === 0) return [];
      return values.map((v) => Number(v));
    } catch (e) {
      console.error("Embedding generation error:", e);
      return [];
    }
  }

  async generateCompletion(prompt: string, context: string): Promise<string> {
    const fullPrompt = `Based on the following context, answer the user's question.
If the context doesn't contain the answer, say you don't know. Format your response using Markdown (e.g., paragraphs, lists, bolding).

Context:
---
${context}
---

Question: ${prompt}
`;
    return this.callGemini(fullPrompt);
  }

  async generateDigitalBrainResponse(
    question: string,
    context: string,
  ): Promise<string> {
    const persona = await this.getPersona();
    const fullPrompt = `${persona}

${context ? `== ADDITIONAL CONTEXT FROM MY BLOG & PROJECTS ==\n---\n${context}\n---\n` : ""}
Question: ${question}
`;
    return this.callGemini(fullPrompt);
  }

  private async callGemini(
    prompt: string,
    config: { responseMimeType?: string; maxOutputTokens?: number } = {},
  ): Promise<string> {
    if (!this.genAI) throw new BadRequestException("GEMINI_API_KEY missing");
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.generationModel,
      });
      const res = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: config.maxOutputTokens ?? 1024,
          ...(config.responseMimeType
            ? { responseMimeType: config.responseMimeType }
            : {}),
        },
      });
      const text = res.response?.text?.() ?? "";
      return text;
    } catch (error) {
      console.error("AI Generation Error:", error);
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        "An unknown error occurred while generating the AI response.",
      );
    }
  }

  async *callGeminiStream(
    prompt: string,
  ): AsyncGenerator<string> {
    if (!this.genAI) throw new BadRequestException("GEMINI_API_KEY missing");
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.generationModel,
      });
      const result = await model.generateContentStream({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) yield text;
      }
    } catch (error) {
      console.error("AI Stream Error:", error);
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException("Stream error occurred");
    }
  }

  async *generateDigitalBrainResponseStream(
    question: string,
    context: string,
  ): AsyncGenerator<string> {
    const persona = await this.getPersona();
    const fullPrompt = `${persona}

${context ? `== ADDITIONAL CONTEXT FROM MY BLOG & PROJECTS ==\n---\n${context}\n---\n` : ""}
Question: ${question}
`;
    yield* this.callGeminiStream(fullPrompt);
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
