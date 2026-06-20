import { Test } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { PrismaService } from "../../prisma/prisma.service";
import { AiService } from "../ai/ai.service";
import { makeBlogPost } from "../../test/factories/blog-post.factory";

type TxClient = {
  blogPost: { create: jest.Mock; update: jest.Mock };
};

describe("BlogService", () => {
  let service: BlogService;
  let prisma: {
    blogPost: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
    $transaction: jest.Mock;
    $executeRaw: jest.Mock;
  };
  let ai: { generateEmbedding: jest.Mock };
  let tx: TxClient;

  beforeEach(async () => {
    tx = {
      blogPost: { create: jest.fn(), update: jest.fn() },
    };
    prisma = {
      blogPost: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn((cb: (c: TxClient) => unknown) => cb(tx)),
      $executeRaw: jest.fn().mockResolvedValue(1),
    };
    ai = { generateEmbedding: jest.fn().mockResolvedValue([0.1, 0.2]) };

    const moduleRef = await Test.createTestingModule({
      providers: [
        BlogService,
        { provide: PrismaService, useValue: prisma },
        { provide: AiService, useValue: ai },
      ],
    }).compile();

    service = moduleRef.get(BlogService);
  });

  // Lets the fire-and-forget embedding microtasks settle.
  const flush = async (): Promise<void> => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  };

  describe("list", () => {
    it("paginates with take+1 and returns a nextCursor", async () => {
      prisma.blogPost.findMany.mockResolvedValue([
        makeBlogPost({ id: "a" }),
        makeBlogPost({ id: "b" }),
        makeBlogPost({ id: "c" }),
      ]);
      const res = await service.list({ take: 2 });
      const arg = prisma.blogPost.findMany.mock.calls[0][0] as { take: number };
      expect(arg.take).toBe(3);
      expect(res.items).toHaveLength(2);
      // nextCursor is the LAST RETURNED row ("b"), not the popped lookahead
      // row ("c") — otherwise cursor+skip:1 would skip "c" on the next page.
      expect(res.nextCursor).toBe("b");
    });

    it("passes the cursor and skip when given", async () => {
      prisma.blogPost.findMany.mockResolvedValue([]);
      await service.list({ cursor: "x" });
      const arg = prisma.blogPost.findMany.mock.calls[0][0] as {
        cursor: { id: string };
        skip: number;
      };
      expect(arg.cursor).toEqual({ id: "x" });
      expect(arg.skip).toBe(1);
    });
  });

  describe("getBySlug", () => {
    it("returns the post when found", async () => {
      const post = makeBlogPost({ slug: "hello" });
      prisma.blogPost.findFirst.mockResolvedValue(post);
      await expect(service.getBySlug("hello")).resolves.toEqual(post);
    });

    it("throws NotFound when missing", async () => {
      prisma.blogPost.findFirst.mockResolvedValue(null);
      await expect(service.getBySlug("missing")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe("adminListAll", () => {
    it("is paginated with take+1 and returns nextCursor", async () => {
      prisma.blogPost.findMany.mockResolvedValue([
        makeBlogPost({ id: "1" }),
        makeBlogPost({ id: "2" }),
      ]);
      const res = await service.adminListAll({ take: 1 });
      expect(res.items).toHaveLength(1);
      // last returned row ("1"), not the popped lookahead row ("2").
      expect(res.nextCursor).toBe("1");
    });
  });

  describe("adminCreate", () => {
    it("rejects a duplicate slug", async () => {
      prisma.blogPost.findUnique.mockResolvedValue({ id: "existing" });
      await expect(
        service.adminCreate({
          slug: "dup",
          title: "t",
          content: "c",
          tags: [],
          published: false,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("creates an unpublished post without embedding", async () => {
      prisma.blogPost.findUnique.mockResolvedValue(null);
      tx.blogPost.create.mockResolvedValue({
        id: "new",
        content: "body",
        published: false,
      });
      const res = await service.adminCreate({
        slug: "new",
        title: "t",
        content: "body",
        tags: [],
        published: false,
      });
      expect(res).toEqual({ id: "new" });
      await flush();
      expect(ai.generateEmbedding).not.toHaveBeenCalled();
    });

    it("creates a published post and embeds in the background without throwing", async () => {
      prisma.blogPost.findUnique.mockResolvedValue(null);
      tx.blogPost.create.mockResolvedValue({
        id: "pub",
        content: "body",
        published: true,
      });
      const res = await service.adminCreate({
        slug: "pub",
        title: "t",
        content: "body",
        tags: [],
        published: true,
      });
      expect(res).toEqual({ id: "pub" });
      await flush();
      expect(ai.generateEmbedding).toHaveBeenCalledWith("body");
      expect(prisma.$executeRaw).toHaveBeenCalled();
    });

    it("swallows background embedding failures (logs, never throws)", async () => {
      prisma.blogPost.findUnique.mockResolvedValue(null);
      tx.blogPost.create.mockResolvedValue({
        id: "pub",
        content: "body",
        published: true,
      });
      ai.generateEmbedding.mockRejectedValue(new Error("ai down"));
      const errSpy = jest
        .spyOn(service["logger"], "error")
        .mockImplementation(() => undefined);
      await expect(
        service.adminCreate({
          slug: "pub",
          title: "t",
          content: "body",
          tags: [],
          published: true,
        }),
      ).resolves.toEqual({ id: "pub" });
      await flush();
      // Retried once, then logged.
      expect(ai.generateEmbedding).toHaveBeenCalledTimes(2);
      expect(errSpy).toHaveBeenCalled();
    });

    it("skips the SQL update when the embedding is empty", async () => {
      prisma.blogPost.findUnique.mockResolvedValue(null);
      tx.blogPost.create.mockResolvedValue({
        id: "pub",
        content: "body",
        published: true,
      });
      ai.generateEmbedding.mockResolvedValue([]);
      await service.adminCreate({
        slug: "pub",
        title: "t",
        content: "body",
        tags: [],
        published: true,
      });
      await flush();
      expect(prisma.$executeRaw).not.toHaveBeenCalled();
    });
  });

  describe("adminUpdate", () => {
    it("throws NotFound when the post does not exist", async () => {
      prisma.blogPost.findUnique.mockResolvedValue(null);
      await expect(
        service.adminUpdate("missing", { title: "x" }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("re-embeds when the content changes", async () => {
      prisma.blogPost.findUnique.mockResolvedValue({
        id: "p1",
        content: "old",
        published: true,
      });
      tx.blogPost.update.mockResolvedValue({
        id: "p1",
        content: "new",
        published: true,
      });
      const res = await service.adminUpdate("p1", { content: "new" });
      expect(res).toEqual({ id: "p1" });
      await flush();
      expect(ai.generateEmbedding).toHaveBeenCalledWith("new");
    });

    it("does not re-embed when content is unchanged and publish state untouched", async () => {
      prisma.blogPost.findUnique.mockResolvedValue({
        id: "p1",
        content: "same",
        published: true,
      });
      tx.blogPost.update.mockResolvedValue({
        id: "p1",
        content: "same",
        published: true,
      });
      await service.adminUpdate("p1", { title: "new title" });
      await flush();
      expect(ai.generateEmbedding).not.toHaveBeenCalled();
    });
  });

  describe("adminRemove", () => {
    it("returns the id on delete", async () => {
      prisma.blogPost.delete.mockResolvedValue({ id: "d1" });
      await expect(service.adminRemove("d1")).resolves.toEqual({ id: "d1" });
    });

    it("throws NotFound when delete fails", async () => {
      prisma.blogPost.delete.mockRejectedValue(new Error("no row"));
      await expect(service.adminRemove("missing")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
