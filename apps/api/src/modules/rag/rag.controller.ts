import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RagService } from "./rag.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AskArticleDto } from "./dto/ask-article.dto";
import { AskWebsiteDto } from "./dto/ask-website.dto";
import { SummarizeDto } from "./dto/summarize.dto";
import { EmbedArticleDto } from "./dto/embed-article.dto";
import { EmbedProjectDto } from "./dto/embed-project.dto";

@ApiTags("RAG")
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
