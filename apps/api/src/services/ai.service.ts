import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

type ScoreResult = { score: number; reason: string; pitchAngle: string };

@Injectable()
export class AIService {
  private readonly apiKey: string;
  private readonly modelFast: string;
  private readonly modelReason: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>("GEMINI_API_KEY") ?? "";
    this.modelFast = this.config.get<string>("GEMINI_MODEL_FAST") ?? "gemini-1.5-flash";
    this.modelReason = this.config.get<string>("GEMINI_MODEL_REASON") ?? "gemini-1.5-pro";
  }

  private async callGemini(model: string, prompt: string, maxOutputTokens = 512): Promise<string> {
    if (!this.apiKey) {
      console.error("GEMINI_API_KEY missing");
      return "";
    }
    try {
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
      const data = (await res.json()) as any;
      const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text ?? "";
    } catch (e) {
      console.error("Gemini call failed", e);
      return "";
    }
  }

  async scoreLead(description: string, techStack: string[], skills: string[]): Promise<ScoreResult> {
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
      return { score: base, reason: "Heuristic fallback", pitchAngle: "General value alignment" };
    }
  }

  async generateProposal(jobDescription: string, variant: string, projects: Array<{ title: string; description: string; techStack: string[] }>): Promise<string> {
    const projectsText = projects
      .map((p) => `- ${p.title}: ${p.description} [${p.techStack.join(", ")}]`)
      .join("\n");
    const prompt = [
      "Generate a concise proposal tailored to the job description.",
      `Variant: ${variant}`,
      `Job Description:\n${jobDescription}`,
      "Use Temitope's background:",
      projectsText,
      "Tone: professional, clear value, short paragraphs, include relevant achievements.",
    ].join("\n\n");
    const text = await this.callGemini(this.modelFast, prompt, 400);
    return text || "Hi — I'd love to help. Sharing relevant experience and next steps.";
    }

  async generateWeeklyInsights(stats: unknown): Promise<string> {
    const prompt = [
      "You are a career pipeline analyst.",
      "Given the following weekly stats JSON, produce a short, actionable summary (bullets).",
      JSON.stringify(stats, null, 2),
    ].join("\n\n");
    const text = await this.callGemini(this.modelReason, prompt, 500);
    return text || "No significant changes this week.";
  }
}
