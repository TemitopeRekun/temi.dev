import { Test } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AiService } from "./ai.service";
import { PrismaService } from "../../prisma/prisma.service";

const generateContentMock = jest.fn();
const generateContentStreamMock = jest.fn();
const getGenerativeModelMock = jest.fn(() => ({
  generateContent: generateContentMock,
  generateContentStream: generateContentStreamMock,
}));

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: getGenerativeModelMock,
  })),
}));

async function* fromArray(
  items: Array<{ text: () => string }>,
): AsyncGenerator<{ text: () => string }> {
  for (const item of items) yield item;
}

async function collect(gen: AsyncGenerator<string>): Promise<string[]> {
  const out: string[] = [];
  for await (const chunk of gen) out.push(chunk);
  return out;
}

const CONFIG: Record<string, string> = {
  GEMINI_API_KEY: "test-key",
  GEMINI_EMBEDDING_MODEL: "gemini-embedding-001",
  GEMINI_EMBEDDING_DIM: "3",
  RAG_SIMILARITY_FLOOR: "0.5",
  GEMINI_MODEL: "gemini-2.5-flash",
};

describe("AiService", () => {
  let service: AiService;
  let prisma: {
    $queryRawUnsafe: jest.Mock;
    blogPost: { findMany: jest.Mock };
    project: { findMany: jest.Mock };
  };
  const fetchMock = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    global.fetch = fetchMock as unknown as typeof fetch;
    prisma = {
      $queryRawUnsafe: jest.fn(),
      blogPost: { findMany: jest.fn() },
      project: { findMany: jest.fn() },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: { get: (key: string): string | undefined => CONFIG[key] },
        },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = moduleRef.get(AiService);
    jest.spyOn(service["logger"], "error").mockImplementation(() => undefined);
  });

  describe("generateEmbedding", () => {
    it("returns the embedding values on a successful fetch", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ embedding: { values: [0.1, 0.2, 0.3] } }),
      });
      await expect(service.generateEmbedding("hi")).resolves.toEqual([
        0.1, 0.2, 0.3,
      ]);
    });

    it("returns [] when the fetch is not ok", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => "server error",
      });
      await expect(service.generateEmbedding("hi")).resolves.toEqual([]);
    });

    it("returns [] when fetch throws", async () => {
      fetchMock.mockRejectedValue(new Error("network"));
      await expect(service.generateEmbedding("hi")).resolves.toEqual([]);
    });

    it("returns [] when the response has no values", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ embedding: {} }),
      });
      await expect(service.generateEmbedding("hi")).resolves.toEqual([]);
    });
  });

  describe("semanticSearch", () => {
    it("returns [] when the embedding is empty (no SQL run)", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ embedding: { values: [] } }),
      });
      await expect(
        service.semanticSearch("q", "BlogPost", 5),
      ).resolves.toEqual([]);
      expect(prisma.$queryRawUnsafe).not.toHaveBeenCalled();
    });

    it("builds the SQL with the table, clamps the limit, and returns rows", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ embedding: { values: [0.1, 0.2, 0.3] } }),
      });
      const rows = [{ id: "1", title: "T", content: "C", similarity: 0.9 }];
      prisma.$queryRawUnsafe.mockResolvedValue(rows);
      const result = await service.semanticSearch("q", "BlogPost", 999);
      expect(result).toEqual(rows);
      const sql = prisma.$queryRawUnsafe.mock.calls[0][0] as string;
      expect(sql).toContain('"BlogPost"');
      expect(sql).toContain("content AS content");
      expect(sql).toContain("LIMIT 50");
    });

    it("uses the description column for Project", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ embedding: { values: [0.1, 0.2, 0.3] } }),
      });
      prisma.$queryRawUnsafe.mockResolvedValue([]);
      await service.semanticSearch("q", "Project", 1);
      const sql = prisma.$queryRawUnsafe.mock.calls[0][0] as string;
      expect(sql).toContain('"Project"');
      expect(sql).toContain("description AS content");
      expect(sql).toContain("LIMIT 1");
    });

    it("falls back to a blog text search when the raw query errors", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ embedding: { values: [0.1, 0.2, 0.3] } }),
      });
      prisma.$queryRawUnsafe.mockRejectedValue(new Error("no pgvector"));
      prisma.blogPost.findMany.mockResolvedValue([
        { id: "1", title: "T", content: "body" },
      ]);
      const result = await service.semanticSearch("q", "BlogPost", 5);
      expect(result).toEqual([
        { id: "1", title: "T", content: "body", similarity: 0 },
      ]);
    });

    it("falls back to a project text search when the raw query errors", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ embedding: { values: [0.1, 0.2, 0.3] } }),
      });
      prisma.$queryRawUnsafe.mockRejectedValue(new Error("no pgvector"));
      prisma.project.findMany.mockResolvedValue([
        { id: "2", title: "P", description: "desc" },
      ]);
      const result = await service.semanticSearch("q", "Project", 5);
      expect(result).toEqual([
        { id: "2", title: "P", content: "desc", similarity: 0 },
      ]);
    });
  });

  describe("prompt assembly", () => {
    it("generateCompletion includes the injection-mitigation delimiters", async () => {
      generateContentMock.mockResolvedValue({
        response: { text: () => "completion" },
      });
      const result = await service.generateCompletion("my prompt", "ctx data");
      expect(result).toBe("completion");
      const arg = generateContentMock.mock.calls[0][0] as {
        contents: [{ parts: [{ text: string }] }];
      };
      const prompt = arg.contents[0].parts[0].text;
      expect(prompt).toContain("SECURITY:");
      expect(prompt).toContain("<retrieved_context>");
      expect(prompt).toContain("</retrieved_context>");
      expect(prompt).toContain("<user_question>");
      expect(prompt).toContain("ctx data");
      expect(prompt).toContain("my prompt");
    });

    it("generateDigitalBrainResponse wraps the question in delimiters", async () => {
      generateContentMock.mockResolvedValue({
        response: { text: () => "brain" },
      });
      const result = await service.generateDigitalBrainResponse(
        "who are you",
        "context",
      );
      expect(result).toBe("brain");
      const arg = generateContentMock.mock.calls[0][0] as {
        contents: [{ parts: [{ text: string }] }];
      };
      const prompt = arg.contents[0].parts[0].text;
      expect(prompt).toContain("SECURITY:");
      expect(prompt).toContain("<user_question>");
      expect(prompt).toContain("who are you");
    });
  });

  describe("callGemini error path", () => {
    it("throws a generic BadRequest when generation fails", async () => {
      generateContentMock.mockRejectedValue(new Error("provider exploded"));
      await expect(
        service.generateCompletion("p", "c"),
      ).rejects.toBeInstanceOf(BadRequestException);
      await expect(service.generateCompletion("p", "c")).rejects.toThrow(
        "Failed to generate the AI response",
      );
    });

    it("returns an empty string when the model returns no text", async () => {
      generateContentMock.mockResolvedValue({ response: {} });
      await expect(service.generateCompletion("p", "c")).resolves.toBe("");
    });
  });

  describe("streaming", () => {
    it("yields non-empty text chunks from the model stream", async () => {
      generateContentStreamMock.mockResolvedValue({
        stream: fromArray([
          { text: () => "hello" },
          { text: () => "" },
          { text: () => "world" },
        ]),
      });
      await expect(
        collect(service.generateDigitalBrainResponseStream("q", "ctx")),
      ).resolves.toEqual(["hello", "world"]);
    });

    it("throws a generic BadRequest when the stream fails", async () => {
      generateContentStreamMock.mockRejectedValue(new Error("stream boom"));
      await expect(
        collect(service.generateDigitalBrainResponseStream("q", "ctx")),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe("missing API key", () => {
    it("throws BadRequest from generateEmbedding when the key is absent", async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          AiService,
          {
            provide: ConfigService,
            useValue: { get: (): undefined => undefined },
          },
          { provide: PrismaService, useValue: prisma },
        ],
      }).compile();
      const keyless = moduleRef.get(AiService);
      await expect(keyless.generateEmbedding("x")).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(
        keyless.generateCompletion("p", "c"),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
