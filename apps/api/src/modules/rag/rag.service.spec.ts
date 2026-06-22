import { Test } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { RagService } from "./rag.service";
import { PrismaService } from "../../prisma/prisma.service";
import { AiService } from "../ai/ai.service";

describe("RagService", () => {
  let service: RagService;
  let prisma: { blogPost: { findUnique: jest.Mock } };
  let ai: {
    generateEmbedding: jest.Mock;
    searchByEmbedding: jest.Mock;
    generateDigitalBrainResponse: jest.Mock;
  };

  beforeEach(async () => {
    prisma = { blogPost: { findUnique: jest.fn() } };
    ai = {
      generateEmbedding: jest.fn().mockResolvedValue([0.1, 0.2]),
      searchByEmbedding: jest.fn().mockResolvedValue([]),
      generateDigitalBrainResponse: jest.fn().mockResolvedValue("answer"),
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

  it("askArticle throws NotFound when the article does not exist", async () => {
    prisma.blogPost.findUnique.mockResolvedValue(null);
    await expect(service.askArticle("id", "question")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("askArticle throws BadRequest when question is empty", async () => {
    await expect(service.askArticle("id", "")).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it("askWebsite throws BadRequest when question is empty", async () => {
    await expect(service.askWebsite("")).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it("searchContext sorts by similarity and slices to 8", async () => {
    // 5 blog + 5 project matches -> 10, sorted desc, sliced to 8.
    const blog = Array.from({ length: 5 }, (_, i) => ({
      id: `b${i}`,
      title: `B${i}`,
      content: "c",
      similarity: i / 10,
    }));
    const project = Array.from({ length: 5 }, (_, i) => ({
      id: `p${i}`,
      title: `P${i}`,
      content: "c",
      similarity: 0.5 + i / 10,
    }));
    ai.searchByEmbedding
      .mockResolvedValueOnce(blog)
      .mockResolvedValueOnce(project);

    const result = await service.askWebsite("hello");
    expect(result.sources).toHaveLength(8);
    // Highest similarity first.
    expect(result.sources[0]?.similarity).toBeGreaterThanOrEqual(
      result.sources[1]?.similarity ?? 0,
    );
    // SCA-2: the question is embedded exactly once, then both tables are
    // searched with that single vector.
    expect(ai.generateEmbedding).toHaveBeenCalledTimes(1);
    expect(ai.searchByEmbedding).toHaveBeenCalledWith(
      [0.1, 0.2],
      "hello",
      "BlogPost",
      5,
    );
    expect(ai.searchByEmbedding).toHaveBeenCalledWith(
      [0.1, 0.2],
      "hello",
      "Project",
      5,
    );
  });

  it("askArticle returns answer and the post title as the source", async () => {
    prisma.blogPost.findUnique.mockResolvedValue({
      id: "id",
      title: "My Post",
      content: "body",
    });
    const res = await service.askArticle("id", "what?");
    expect(res.answer).toBe("answer");
    expect(res.sources).toEqual([{ title: "My Post" }]);
  });
});
