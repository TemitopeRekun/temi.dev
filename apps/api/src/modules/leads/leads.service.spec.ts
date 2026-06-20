import { Test } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { LeadsService } from "./leads.service";
import { PrismaService } from "../../prisma/prisma.service";
import { ResendService } from "../email/resend.service";
import { makeLead } from "../../test/factories/lead.factory";

describe("LeadsService", () => {
  let service: LeadsService;
  let prisma: {
    lead: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };
  let email: { sendLeadConfirmation: jest.Mock };

  beforeEach(async () => {
    prisma = {
      lead: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    email = { sendLeadConfirmation: jest.fn().mockResolvedValue(undefined) };

    const moduleRef = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: PrismaService, useValue: prisma },
        { provide: ResendService, useValue: email },
      ],
    }).compile();

    service = moduleRef.get(LeadsService);
  });

  describe("create", () => {
    it("scores company + long message + ai automation service and sends confirmation", async () => {
      prisma.lead.create.mockResolvedValue({ id: "lead-1" });
      const id = await service.create({
        name: "Jane",
        email: "jane@example.com",
        company: "Acme",
        message: "x".repeat(101),
        service: "AI Automation",
      });
      expect(id).toBe("lead-1");
      const arg = prisma.lead.create.mock.calls[0][0] as {
        data: { score: number };
      };
      expect(arg.data.score).toBe(40);
      expect(email.sendLeadConfirmation).toHaveBeenCalledWith(
        "jane@example.com",
        "Jane",
      );
    });

    it("scores 0 with no company, short message and no service", async () => {
      prisma.lead.create.mockResolvedValue({ id: "lead-2" });
      await service.create({
        name: "Bob",
        email: "bob@example.com",
        message: "short",
      });
      const arg = prisma.lead.create.mock.calls[0][0] as {
        data: { score: number; company: string | null; service: string | null };
      };
      expect(arg.data.score).toBe(0);
      expect(arg.data.company).toBeNull();
      expect(arg.data.service).toBeNull();
    });

    it("does not throw when the confirmation email rejects (fire-and-forget)", async () => {
      prisma.lead.create.mockResolvedValue({ id: "lead-3" });
      email.sendLeadConfirmation.mockRejectedValue(new Error("smtp down"));
      const loggerSpy = jest
        .spyOn(service["logger"], "error")
        .mockImplementation(() => undefined);
      await expect(
        service.create({
          name: "A",
          email: "a@b.c",
          message: "m",
        }),
      ).resolves.toBe("lead-3");
      await Promise.resolve();
      await Promise.resolve();
      expect(loggerSpy).toHaveBeenCalled();
    });
  });

  describe("adminList", () => {
    it("requests take+1, returns nextCursor and drops the extra row", async () => {
      const rows = Array.from({ length: 3 }, (_, i) =>
        makeLead({ id: `id-${i}` }),
      );
      prisma.lead.findMany.mockResolvedValue(rows);
      const result = await service.adminList({ take: 2 });
      const arg = prisma.lead.findMany.mock.calls[0][0] as {
        take: number;
        where?: unknown;
      };
      expect(arg.take).toBe(3);
      expect(arg.where).toBeUndefined();
      expect(result.items).toHaveLength(2);
      // last returned row (id-1), not the popped lookahead row (id-2).
      expect(result.nextCursor).toBe("id-1");
    });

    it("returns no nextCursor when results fit in the page", async () => {
      prisma.lead.findMany.mockResolvedValue([makeLead()]);
      const result = await service.adminList({ take: 20 });
      expect(result.nextCursor).toBeUndefined();
      expect(result.items).toHaveLength(1);
    });

    it("applies a status filter and cursor pagination", async () => {
      prisma.lead.findMany.mockResolvedValue([]);
      await service.adminList({ status: "won", cursor: "c1", take: 5 });
      const arg = prisma.lead.findMany.mock.calls[0][0] as {
        where: { status: string };
        cursor: { id: string };
        skip: number;
      };
      expect(arg.where).toEqual({ status: "won" });
      expect(arg.cursor).toEqual({ id: "c1" });
      expect(arg.skip).toBe(1);
    });
  });

  describe("adminGetById", () => {
    it("returns the lead when found", async () => {
      const lead = makeLead({ id: "found" });
      prisma.lead.findUnique.mockResolvedValue(lead);
      await expect(service.adminGetById("found")).resolves.toEqual(lead);
    });

    it("throws NotFound when missing", async () => {
      prisma.lead.findUnique.mockResolvedValue(null);
      await expect(service.adminGetById("nope")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe("adminUpdate", () => {
    it("updates the status and returns the id", async () => {
      prisma.lead.update.mockResolvedValue({ id: "u1" });
      await expect(
        service.adminUpdate("u1", { status: "contacted" }),
      ).resolves.toEqual({ id: "u1" });
    });

    it("throws NotFound when the update fails", async () => {
      prisma.lead.update.mockRejectedValue(new Error("no row"));
      await expect(
        service.adminUpdate("missing", { status: "contacted" }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("adminDelete", () => {
    it("deletes the lead", async () => {
      prisma.lead.delete.mockResolvedValue({ id: "d1" });
      await expect(service.adminDelete("d1")).resolves.toBeUndefined();
    });

    it("throws NotFound when the delete fails", async () => {
      prisma.lead.delete.mockRejectedValue(new Error("no row"));
      await expect(service.adminDelete("missing")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
