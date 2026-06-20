import { Test } from "@nestjs/testing";
import type { FastifyReply, FastifyRequest } from "fastify";
import { RagController } from "./rag.controller";
import { RagService } from "./rag.service";

async function* fromArray(items: string[]): AsyncGenerator<string> {
  for (const item of items) yield item;
}

async function* throwingStream(): AsyncGenerator<string> {
  yield "first";
  throw new Error("stream boom");
}

type RawReply = {
  writeHead: jest.Mock;
  write: jest.Mock;
  end: jest.Mock;
};

function makeReply(): { reply: FastifyReply; raw: RawReply } {
  const raw: RawReply = {
    writeHead: jest.fn(),
    write: jest.fn(),
    end: jest.fn(),
  };
  return { reply: { raw } as unknown as FastifyReply, raw };
}

function makeReq(origin?: string): FastifyRequest {
  return { headers: { origin } } as unknown as FastifyRequest;
}

describe("RagController", () => {
  let controller: RagController;
  let rag: {
    askArticle: jest.Mock;
    askWebsite: jest.Mock;
    askArticleStream: jest.Mock;
    askWebsiteStream: jest.Mock;
    summarizeArticle: jest.Mock;
    embedArticle: jest.Mock;
    embedProject: jest.Mock;
  };

  beforeEach(async () => {
    rag = {
      askArticle: jest
        .fn()
        .mockResolvedValue({ answer: "a", sources: [{ title: "T" }] }),
      askWebsite: jest
        .fn()
        .mockResolvedValue({ answer: "a", sources: [] }),
      askArticleStream: jest.fn(() => fromArray(["x", "y"])),
      askWebsiteStream: jest.fn(() => fromArray(["x", "y"])),
      summarizeArticle: jest.fn().mockResolvedValue({ summary: "s" }),
      embedArticle: jest.fn().mockResolvedValue({ ok: true }),
      embedProject: jest.fn().mockResolvedValue({ ok: true }),
    };
    const moduleRef = await Test.createTestingModule({
      controllers: [RagController],
      providers: [{ provide: RagService, useValue: rag }],
    }).compile();
    controller = moduleRef.get(RagController);
  });

  it("askArticle delegates with articleId and question", async () => {
    await controller.askArticle({ articleId: "id1", question: "q" });
    expect(rag.askArticle).toHaveBeenCalledWith("id1", "q");
  });

  it("askWebsite delegates with the question", async () => {
    await controller.askWebsite({ question: "q" });
    expect(rag.askWebsite).toHaveBeenCalledWith("q");
  });

  it("summarize delegates with the articleId", async () => {
    await controller.summarize({ articleId: "id1" });
    expect(rag.summarizeArticle).toHaveBeenCalledWith("id1");
  });

  it("embedArticle delegates with the articleId", async () => {
    await controller.embedArticle({ articleId: "id1" });
    expect(rag.embedArticle).toHaveBeenCalledWith("id1");
  });

  it("embedProject delegates with the projectId", async () => {
    await controller.embedProject({ projectId: "p1" });
    expect(rag.embedProject).toHaveBeenCalledWith("p1");
  });

  describe("askArticleStream", () => {
    it("writes SSE chunks, terminates with [DONE], and ends the stream", async () => {
      const { reply, raw } = makeReply();
      await controller.askArticleStream(
        { articleId: "id", question: "q" },
        makeReq("http://localhost:3000"),
        reply,
      );
      expect(raw.writeHead).toHaveBeenCalledWith(
        200,
        expect.objectContaining({ "Content-Type": "text/event-stream" }),
      );
      expect(raw.write).toHaveBeenCalledWith(
        `data: ${JSON.stringify({ text: "x" })}\n\n`,
      );
      expect(raw.write).toHaveBeenCalledWith("data: [DONE]\n\n");
      expect(raw.end).toHaveBeenCalled();
    });

    it("writes an error frame when the stream throws", async () => {
      rag.askArticleStream.mockReturnValue(throwingStream());
      const { reply, raw } = makeReply();
      await controller.askArticleStream(
        { articleId: "id", question: "q" },
        makeReq(),
        reply,
      );
      expect(raw.write).toHaveBeenCalledWith(
        `data: ${JSON.stringify({ error: "stream boom" })}\n\n`,
      );
      expect(raw.end).toHaveBeenCalled();
    });
  });

  describe("askWebsiteStream", () => {
    it("writes SSE chunks and ends the stream", async () => {
      const { reply, raw } = makeReply();
      await controller.askWebsiteStream(
        { question: "q" },
        makeReq("https://temitope.live"),
        reply,
      );
      expect(raw.write).toHaveBeenCalledWith(
        `data: ${JSON.stringify({ text: "x" })}\n\n`,
      );
      expect(raw.write).toHaveBeenCalledWith("data: [DONE]\n\n");
      expect(raw.end).toHaveBeenCalled();
    });

    it("writes an error frame when the stream throws", async () => {
      rag.askWebsiteStream.mockReturnValue(throwingStream());
      const { reply, raw } = makeReply();
      await controller.askWebsiteStream(
        { question: "q" },
        makeReq("https://evil.example.com"),
        reply,
      );
      expect(raw.write).toHaveBeenCalledWith(
        `data: ${JSON.stringify({ error: "stream boom" })}\n\n`,
      );
    });
  });
});
