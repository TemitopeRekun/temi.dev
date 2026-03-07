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
      this.config.get<string>("GEMINI_MODEL") ?? "gemini-1.5-flash";
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
    const fullPrompt = `You are Temitope's Digital Brain, an AI assistant representing Temitope Ogunrekun (a Senior Full-Stack Engineer).
Answer the user's question based on the provided context (which includes my blog posts and projects).
If the context is relevant, use it to provide specific details.
If the context is empty or irrelevant, use your general knowledge to answer helpfuly, but clarify that this is general advice not specific to my writing.
Maintain a professional, technical, and encouraging tone.
Format your response using Markdown.

Context:
---
${context}
---

Question: ${question}
`;
    return this.callGemini(fullPrompt);
  }

  async generateBlogPost(topic: string): Promise<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tags: string[];
    imagePrompt: string;
  }> {
    const prompt = `Write a comprehensive technical blog post about "${topic}".
The post should be engaging, easy to understand for developers, and SEO-friendly.
Include code snippets where relevant (in markdown).
Return a valid JSON object with the following fields:
- title: A catchy title.
- slug: A URL-friendly kebab-case string based on the title.
- excerpt: A short summary (1-2 sentences) for SEO.
- content: The full blog post body in Markdown format.
- tags: An array of 3-5 relevant tags.
- imagePrompt: A descriptive prompt for an AI image generator to create a header image for this post.

Do not wrap the JSON in markdown code blocks. Just return the raw JSON.`;

    const raw = await this.callGemini(prompt, {
      responseMimeType: "application/json",
    });

    try {
      const json = JSON.parse(raw);
      return {
        title: json.title || topic,
        slug: json.slug || topic.toLowerCase().replace(/\s+/g, "-"),
        excerpt: json.excerpt || "",
        content: json.content || "",
        tags: json.tags || [],
        imagePrompt: json.imagePrompt || `Abstract tech illustration of ${topic}`,
      };
    } catch {
      throw new BadRequestException("Failed to generate blog post JSON");
    }
  }

  async getTrendingTopics(): Promise<string[]> {
    const prompt = `List 5 trending software engineering topics or technologies that are currently popular or rising.
Focus on practical, interesting subjects for a tech blog.
Return a valid JSON array of strings (e.g., ["Topic 1", "Topic 2"]).`;

    const raw = await this.callGemini(prompt, {
      responseMimeType: "application/json",
    });

    try {
      const json = JSON.parse(raw);
      return Array.isArray(json) ? json : [];
    } catch {
      return ["React Server Components", "AI Engineering", "TypeScript Best Practices", "Next.js Performance", "Rust for Web Dev"];
    }
  }

  async scoreLead(
    description: string,
    techStack: string[],
    skills: string[],
  ): Promise<{ score: number; reason: string; pitchAngle: string }> {
    const prompt = [
      "You are an assistant scoring job leads for Temitope.",
      "Evaluate fit between job description and skills.",
      `Job Description:\n${description}`,
      `Job Tech Stack: ${techStack.join(", ")}`,
      `Temitope's Skills: ${skills.join(", ")}`,
      "Return JSON with fields: score (0-100), reason (short), pitchAngle (short).",
    ].join("\n\n");

    const raw = await this.callGemini(prompt, {
      responseMimeType: "application/json",
    });

    try {
      const json = JSON.parse(raw) as Partial<{
        score: number;
        reason: string;
        pitchAngle: string;
      }>;
      return {
        score: Math.max(0, Math.min(100, Math.round(json.score ?? 0))),
        reason: json.reason ?? "",
        pitchAngle: json.pitchAngle ?? "",
      };
    } catch {
      const base = description.length > 500 ? 60 : 40;
      return {
        score: base,
        reason: "Heuristic fallback",
        pitchAngle: "General value alignment",
      };
    }
  }

  async generateProposal(
    jobDescription: string,
    variant: string,
    projects: Array<{
      title: string;
      description: string;
      techStack: string[];
    }>,
  ): Promise<string> {
    const projectsText = projects
      .map((p) => `- ${p.title}: ${p.description} [${p.techStack.join(", ")}]`)
      .join("\n");
    const path = resolve(
      process.cwd(),
      "../../packages/ai/prompts/proposal.txt",
    );
    const tmpl = await readFile(path, "utf8").catch(() => "");
    const prompt = tmpl
      ? tmpl
          .replace("{{variant}}", variant)
          .replace("{{jobDescription}}", jobDescription)
          .replace("{{projects}}", projectsText)
      : [
          "Generate a concise proposal tailored to the job description.",
          `Variant: ${variant}`,
          `Job Description:\n${jobDescription}`,
          "Use Temitope's background:",
          projectsText,
          "Tone: professional, clear value, short paragraphs, include relevant achievements.",
        ].join("\n\n");

    return this.callGemini(prompt);
  }

  async generateWeeklyInsights(stats: unknown): Promise<string> {
    const path = resolve(
      process.cwd(),
      "../../packages/ai/prompts/weekly-insights.txt",
    );
    const tmpl = await readFile(path, "utf8").catch(() => "");
    const prompt = tmpl
      ? tmpl.replace("{{stats}}", JSON.stringify(stats, null, 2))
      : [
          "You are a career pipeline analyst.",
          "Given the following weekly stats JSON, produce a short, actionable summary (bullets).",
          JSON.stringify(stats, null, 2),
        ].join("\n\n");
    return this.callGemini(prompt);
  }

  async generateLeadReply(
    leadMessage: string,
    context?: string,
  ): Promise<string> {
    const prompt = [
      "You are Temitope Ogunrekun, a professional software engineer.",
      "Write a polite, concise, and helpful email reply to this inquiry.",
      `Inquiry: "${leadMessage}"`,
      context ? `Context: ${context}` : "",
      "Tone: Friendly but professional. Invite a call or further discussion if relevant.",
    ].join("\n\n");
    return this.callGemini(prompt);
  }

  private async callGemini(
    prompt: string,
    config: { responseMimeType?: string } = {},
  ): Promise<string> {
    if (!this.genAI) throw new BadRequestException("GEMINI_API_KEY missing");
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.generationModel,
      });
      const started = Date.now();
      const res = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 1024,
          ...(config.responseMimeType
            ? { responseMimeType: config.responseMimeType }
            : {}),
        },
      });
      const text = res.response?.text?.() ?? "";
      const duration = Date.now() - started;
      // NOTE: custom implementation — minimal DB logging for AI observability
      await this.prismaLike.aiRequestLog.create({
        data: {
          model: this.generationModel,
          input: prompt.slice(0, 4000),
          output: text.slice(0, 4000),
          durationMs: duration,
        },
      } as unknown);
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
