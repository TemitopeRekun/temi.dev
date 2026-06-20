import { Test } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { PrismaService } from "../../prisma/prisma.service";
import { AiService } from "../ai/ai.service";
import { makeProject } from "../../test/factories/project.factory";

type TxClient = {
  project: { create: jest.Mock; update: jest.Mock };
};

describe("ProjectsService", () => {
  let service: ProjectsService;
  let prisma: {
    project: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
    $transaction: jest.Mock;
    $executeRaw: jest.Mock;
  };
  let ai: { generateEmbedding: jest.Mock };
  let tx: TxClient;

  const flush = async (): Promise<void> => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  };

  beforeEach(async () => {
    tx = { project: { create: jest.fn(), update: jest.fn() } };
    prisma = {
      project: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn((cb: (c: TxClient) => unknown) => cb(tx)),
      $executeRaw: jest.fn().mockResolvedValue(1),
    };
    ai = { generateEmbedding: jest.fn().mockResolvedValue([0.1, 0.2]) };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: prisma },
        { provide: AiService, useValue: ai },
      ],
    }).compile();

    service = moduleRef.get(ProjectsService);
  });

  describe("list", () => {
    it("paginates with take+1 and returns a nextCursor", async () => {
      prisma.project.findMany.mockResolvedValue([
        makeProject({ id: "1" }),
        makeProject({ id: "2" }),
        makeProject({ id: "3" }),
      ]);
      const res = await service.list({ take: 2 });
      expect(res.items).toHaveLength(2);
      // last returned row ("2"), not the popped lookahead row ("3").
      expect(res.nextCursor).toBe("2");
    });

    it("filters by a single tech with has", async () => {
      prisma.project.findMany.mockResolvedValue([]);
      await service.list({ tech: ["NestJS"] });
      const arg = prisma.project.findMany.mock.calls[0][0] as {
        where: { techStack: { has: string } };
      };
      expect(arg.where).toEqual({ techStack: { has: "NestJS" } });
    });

    it("filters by multiple techs with hasEvery", async () => {
      prisma.project.findMany.mockResolvedValue([]);
      await service.list({ tech: ["NestJS", "React"] });
      const arg = prisma.project.findMany.mock.calls[0][0] as {
        where: { techStack: { hasEvery: string[] } };
      };
      expect(arg.where).toEqual({
        techStack: { hasEvery: ["NestJS", "React"] },
      });
    });

    it("applies no where filter when tech is empty", async () => {
      prisma.project.findMany.mockResolvedValue([]);
      await service.list({ tech: [] });
      const arg = prisma.project.findMany.mock.calls[0][0] as {
        where?: unknown;
      };
      expect(arg.where).toBeUndefined();
    });
  });

  describe("getById / getBySlug", () => {
    it("getById returns the project", async () => {
      const project = makeProject({ id: "p1" });
      prisma.project.findUnique.mockResolvedValue(project);
      await expect(service.getById("p1")).resolves.toEqual(project);
    });

    it("getById throws NotFound when missing", async () => {
      prisma.project.findUnique.mockResolvedValue(null);
      await expect(service.getById("nope")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("getBySlug returns the project", async () => {
      const project = makeProject({ slug: "slug-1" });
      prisma.project.findUnique.mockResolvedValue(project);
      await expect(service.getBySlug("slug-1")).resolves.toEqual(project);
    });

    it("getBySlug throws NotFound when missing", async () => {
      prisma.project.findUnique.mockResolvedValue(null);
      await expect(service.getBySlug("nope")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe("create", () => {
    it("creates and embeds in the background", async () => {
      tx.project.create.mockResolvedValue({ id: "new" });
      const id = await service.create({
        slug: "s",
        title: "t",
        description: "desc",
        category: "Web",
        year: 2025,
        techStack: [],
        featured: false,
        order: 0,
      });
      expect(id).toBe("new");
      await flush();
      expect(ai.generateEmbedding).toHaveBeenCalledWith("desc");
      expect(prisma.$executeRaw).toHaveBeenCalled();
    });

    it("does not throw when background embedding fails", async () => {
      tx.project.create.mockResolvedValue({ id: "new" });
      ai.generateEmbedding.mockRejectedValue(new Error("ai down"));
      const errSpy = jest
        .spyOn(service["logger"], "error")
        .mockImplementation(() => undefined);
      await expect(
        service.create({
          slug: "s",
          title: "t",
          description: "desc",
          category: "Web",
          year: 2025,
          techStack: [],
          featured: false,
          order: 0,
        }),
      ).resolves.toBe("new");
      await flush();
      expect(errSpy).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("throws NotFound when the update fails", async () => {
      prisma.project.findUnique.mockResolvedValue({
        id: "p1",
        description: "old",
      });
      tx.project.update.mockRejectedValue(new Error("no row"));
      await expect(
        service.update("p1", { title: "x" }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("re-embeds when the description changes", async () => {
      prisma.project.findUnique.mockResolvedValue({
        id: "p1",
        description: "old",
      });
      tx.project.update.mockResolvedValue({ id: "p1" });
      const res = await service.update("p1", { description: "new" });
      expect(res).toEqual({ id: "p1" });
      await flush();
      expect(ai.generateEmbedding).toHaveBeenCalledWith("new");
    });

    it("does not re-embed when the description is unchanged", async () => {
      prisma.project.findUnique.mockResolvedValue({
        id: "p1",
        description: "same",
      });
      tx.project.update.mockResolvedValue({ id: "p1" });
      await service.update("p1", { description: "same" });
      await flush();
      expect(ai.generateEmbedding).not.toHaveBeenCalled();
    });
  });

  describe("remove", () => {
    it("returns the id on delete", async () => {
      prisma.project.delete.mockResolvedValue({ id: "d1" });
      await expect(service.remove("d1")).resolves.toEqual({ id: "d1" });
    });

    it("throws NotFound when delete fails", async () => {
      prisma.project.delete.mockRejectedValue(new Error("no row"));
      await expect(service.remove("missing")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
