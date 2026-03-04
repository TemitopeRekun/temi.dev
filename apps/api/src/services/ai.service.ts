import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { readFile } from "fs/promises";
import { resolve } from "path";

type ScoreResult = { score: number; reason: string; pitchAngle: string };

@Injectable()
export class AIService {
  private readonly apiKey: string;
  private readonly modelFast: string;
  private readonly modelReason: string;
  private readonly prismaLike: {
    aiRequestLog: { create(args: unknown): Promise<unknown> };
  };

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.apiKey = this.config.get<string>("GEMINI_API_KEY") ?? "";
    this.modelFast =
      this.config.get<string>("GEMINI_MODEL_FAST") ?? "gemini-1.5-flash";
    this.modelReason =
      this.config.get<string>("GEMINI_MODEL_REASON") ?? "gemini-1.5-pro";
    this.prismaLike = this.prisma as unknown as {
      aiRequestLog: { create(args: unknown): Promise<unknown> };
    };
  }

  private async callGemini(
    model: string,
    prompt: string,
    maxOutputTokens = 512,
  ): Promise<string> {
    if (!this.apiKey) {
      console.error("GEMINI_API_KEY missing");
      return "";
    }
    try {
      const start = Date.now();
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens },
          }),
        },
      );
      const data = (await res.json()) as unknown;
      const text: string | undefined = (() => {
        if (
          data &&
          typeof data === "object" &&
          "candidates" in data &&
          Array.isArray((data as { candidates?: unknown[] }).candidates)
        ) {
          const cand = (data as { candidates: unknown[] }).candidates[0];
          if (
            cand &&
            typeof cand === "object" &&
            "content" in cand &&
            cand.content &&
            typeof (cand as { content?: unknown }).content === "object" &&
            Array.isArray(
              (cand as { content: { parts?: unknown[] } }).content.parts,
            )
          ) {
            const part = (cand as { content: { parts: unknown[] } }).content
              .parts[0];
            if (
              part &&
              typeof part === "object" &&
              "text" in part &&
              typeof (part as { text?: unknown }).text === "string"
            ) {
              return (part as { text: string }).text;
            }
          }
        }
        return undefined;
      })();
      const output = text ?? "";
      const duration = Date.now() - start;
      // NOTE: custom implementation — minimal DB logging for AI observability
      await this.prismaLike.aiRequestLog.create({
        data: {
          model,
          input: prompt.slice(0, 4000),
          output: output.slice(0, 4000),
          durationMs: duration,
        },
      } as unknown);
      return output;
    } catch (e) {
      console.error("Gemini call failed", e);
      return "";
    }
  }

  async scoreLead(
    description: string,
    techStack: string[],
    skills: string[],
  ): Promise<ScoreResult> {
    const prompt = [
      "You are an assistant scoring job leads for Temitope.",
      "Evaluate fit between job description and skills.",
      `Job Description:\n${description}`,
      `Job Tech Stack: ${techStack.join(", ")}`,
      `Temitope's Skills: ${skills.join(", ")}`,
      "Return JSON with fields: score (0-100), reason (short), pitchAngle (short).",
    ].join("\n\n");
    const raw = await this.callGemini(this.modelReason, prompt, 256);
    try {
      const json = JSON.parse(raw) as Partial<ScoreResult>;
      return {
        score: Math.max(0, Math.min(100, Math.round(json.score ?? 0))),
        reason: json.reason ?? "",
        pitchAngle: json.pitchAngle ?? "",
      };
    } catch {
      // fallback heuristic
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
    const text = await this.callGemini(this.modelFast, prompt, 400);
    return (
      text ||
      "Hi — I'd love to help. Sharing relevant experience and next steps."
    );
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
    const text = await this.callGemini(this.modelReason, prompt, 500);
    return text || "No significant changes this week.";
  }
}
