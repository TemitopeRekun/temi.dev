import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import type { FastifyReply, FastifyRequest } from "fastify";

const ALLOWED_ORIGINS = ["https://temitope.live", "https://www.temitope.live"];

function resolveCorsOrigin(origin: string | undefined): string {
  if (!origin) return "*";
  const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return isLocalhost || ALLOWED_ORIGINS.includes(origin) ? origin : "";
}
import { RagService } from "./rag.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AskArticleDto } from "./dto/ask-article.dto";
import { AskWebsiteDto } from "./dto/ask-website.dto";
import { SummarizeDto } from "./dto/summarize.dto";
import { EmbedArticleDto } from "./dto/embed-article.dto";
import { EmbedProjectDto } from "./dto/embed-project.dto";

@ApiTags("RAG")
@Throttle({ default: { limit: 5, ttl: 60_000 } })
@Controller("api/rag")
export class RagController {
  constructor(private readonly rag: RagService) {}

  @Post("ask-article")
  @ApiOperation({ summary: "Ask a question about a specific article" })
  @ApiResponse({ status: 200 })
  async askArticle(@Body() dto: AskArticleDto): Promise<{ answer: string; sources: Array<{ title: string }> }> {
    return this.rag.askArticle(dto.articleId, dto.question);
  }

  @Post("ask-website")
  @ApiOperation({ summary: "Ask a question using semantic search across site content" })
  @ApiResponse({ status: 200 })
  async askWebsite(@Body() dto: AskWebsiteDto): Promise<{ answer: string; sources: Array<{ title: string; similarity: number }> }> {
    return this.rag.askWebsite(dto.question);
  }

  @Post("ask-article-stream")
  @ApiOperation({ summary: "Streamed Q&A about a specific article" })
  async askArticleStream(
    @Body() dto: AskArticleDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: false }) reply: FastifyReply,
  ): Promise<void> {
    const raw = reply.raw;
    const corsOrigin = resolveCorsOrigin(req.headers.origin);
    raw.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      ...(corsOrigin && {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Credentials": "true",
      }),
    });
    try {
      for await (const chunk of this.rag.askArticleStream(dto.articleId, dto.question)) {
        raw.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Stream error";
      raw.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
    }
    raw.write("data: [DONE]\n\n");
    raw.end();
  }

  @Post("ask-website-stream")
  @ApiOperation({ summary: "Streamed Q&A across site content via semantic search" })
  async askWebsiteStream(
    @Body() dto: AskWebsiteDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: false }) reply: FastifyReply,
  ): Promise<void> {
    const raw = reply.raw;
    const corsOrigin = resolveCorsOrigin(req.headers.origin);
    raw.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      ...(corsOrigin && {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Credentials": "true",
      }),
    });
    try {
      for await (const chunk of this.rag.askWebsiteStream(dto.question)) {
        raw.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Stream error";
      raw.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
    }
    raw.write("data: [DONE]\n\n");
    raw.end();
  }

  @Post("summarize")
  @ApiOperation({ summary: "Summarize an article (3–5 sentences)" })
  @ApiResponse({ status: 200 })
  async summarize(@Body() dto: SummarizeDto): Promise<{ summary: string }> {
    return this.rag.summarizeArticle(dto.articleId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("embed-article")
  @ApiOperation({ summary: "Generate and store embedding for an article" })
  @ApiResponse({ status: 200 })
  async embedArticle(@Body() dto: EmbedArticleDto): Promise<{ ok: boolean }> {
    return this.rag.embedArticle(dto.articleId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("embed-project")
  @ApiOperation({ summary: "Generate and store embedding for a project" })
  @ApiResponse({ status: 200 })
  async embedProject(@Body() dto: EmbedProjectDto): Promise<{ ok: boolean }> {
    return this.rag.embedProject(dto.projectId);
  }
}
