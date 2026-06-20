import { Test } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { RagService } from "./rag.service";
import { PrismaService } from "../../prisma/prisma.service";
import { AiService } from "../ai/ai.service";

async function collect(gen: AsyncGenerator<string>): Promise<string[]> {
  const out: string[] = [];
  for await (const chunk of gen) out.push(chunk);
  return out;
}

async function* fromArray(items: string[]): AsyncGenerator<string> {
  for (const item of items) yield item;
}

describe("RagService (streaming, summarize, embed)", () => {
  let service: RagService;
  let prisma: {
    blogPost: { findUnique: jest.Mock };
    project: { findUnique: jest.Mock };
    $executeRaw: jest.Mock;
  };
  let ai: {
    semanticSearch: jest.Mock;
    generateEmbedding: jest.Mock;
    generateCompletion: jest.Mock;
    generateDigitalBrainResponseStream: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      blogPost: { findUnique: jest.fn() },
      project: { findUnique: jest.fn() },
      $executeRaw: jest.fn().mockResolvedValue(1),
    };
    ai = {
      semanticSearch: jest.fn().mockResolvedValue([]),
      generateEmbedding: jest.fn().mockResolvedValue([0.1, 0.2]),
      generateCompletion: jest.fn().mockResolvedValue("summary text"),
      generateDigitalBrainResponseStream: jest.fn(() =>
        fromArray(["a", "b"]),
      ),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        RagService,
        { provide: PrismaService, useValue: prisma },
        { provide: AiService, useValue: ai },
      ],
    }).compile();

    service = moduleRef.get(RagService);
  });

  describe("askArticleStream", () => {
    it("throws BadRequest when inputs are missing", async () => {
      await expect(
        collect(service.askArticleStream("", "")),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("throws NotFound when the article is missing", async () => {
      prisma.blogPost.findUnique.mockResolvedValue(null);
      await expect(
        collect(service.askArticleStream("id", "q")),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("streams chunks from the AI service", async () => {
      prisma.blogPost.findUnique.mockResolvedValue({
        id: "id",
        title: "T",
        content: "body",
      });
      await expect(collect(service.askArticleStream("id", "q"))).resolves.toEqual([
        "a",
        "b",
      ]);
    });
  });

  describe("askWebsiteStream", () => {
    it("throws BadRequest when the question is empty", async () => {
      await expect(
        collect(service.askWebsiteStream("")),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("streams chunks after building context", async () => {
      await expect(collect(service.askWebsiteStream("q"))).resolves.toEqual([
        "a",
        "b",
      ]);
      expect(ai.semanticSearch).toHaveBeenCalledTimes(2);
    });
  });

  describe("summarizeArticle", () => {
    it("throws BadRequest when articleId is empty", async () => {
      await expect(service.summarizeArticle("")).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it("throws NotFound when the article is missing", async () => {
      prisma.blogPost.findUnique.mockResolvedValue(null);
      await expect(service.summarizeArticle("id")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("returns a summary for an existing article", async () => {
      prisma.blogPost.findUnique.mockResolvedValue({
        id: "id",
        title: "T",
        content: "body",
      });
      await expect(service.summarizeArticle("id")).resolves.toEqual({
        summary: "summary text",
      });
    });
  });

  describe("embedArticle", () => {
    it("throws BadRequest when articleId is empty", async () => {
      await expect(service.embedArticle("")).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it("throws NotFound when the article is missing", async () => {
      prisma.blogPost.findUnique.mockResolvedValue(null);
      await expect(service.embedArticle("id")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("throws BadRequest when the embedding is empty", async () => {
      prisma.blogPost.findUnique.mockResolvedValue({ id: "id", content: "c" });
      ai.generateEmbedding.mockResolvedValue([]);
      await expect(service.embedArticle("id")).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it("stores the embedding and returns ok", async () => {
      prisma.blogPost.findUnique.mockResolvedValue({ id: "id", content: "c" });
      await expect(service.embedArticle("id")).resolves.toEqual({ ok: true });
      expect(prisma.$executeRaw).toHaveBeenCalled();
    });

    it("throws BadRequest when the SQL update fails", async () => {
      prisma.blogPost.findUnique.mockResolvedValue({ id: "id", content: "c" });
      prisma.$executeRaw.mockRejectedValue(new Error("no pgvector"));
      await expect(service.embedArticle("id")).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe("embedProject", () => {
    it("throws BadRequest when projectId is empty", async () => {
      await expect(service.embedProject("")).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it("throws NotFound when the project is missing", async () => {
      prisma.project.findUnique.mockResolvedValue(null);
      await expect(service.embedProject("id")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("throws BadRequest when the embedding is empty", async () => {
      prisma.project.findUnique.mockResolvedValue({
        id: "id",
        description: "d",
      });
      ai.generateEmbedding.mockResolvedValue([]);
      await expect(service.embedProject("id")).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it("stores the embedding and returns ok", async () => {
      prisma.project.findUnique.mockResolvedValue({
        id: "id",
        description: "d",
      });
      await expect(service.embedProject("id")).resolves.toEqual({ ok: true });
      expect(prisma.$executeRaw).toHaveBeenCalled();
    });

    it("throws BadRequest when the SQL update fails", async () => {
      prisma.project.findUnique.mockResolvedValue({
        id: "id",
        description: "d",
      });
      prisma.$executeRaw.mockRejectedValue(new Error("no pgvector"));
      await expect(service.embedProject("id")).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });
});
