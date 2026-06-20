import { Test } from "@nestjs/testing";
import { ServiceUnavailableException } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { PrismaService } from "../../prisma/prisma.service";

describe("HealthController", () => {
  let controller: HealthController;
  let prisma: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prisma = { $queryRaw: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: prisma }],
    }).compile();
    controller = moduleRef.get(HealthController);
    jest
      .spyOn(controller["logger"], "error")
      .mockImplementation(() => undefined);
  });

  it("returns ok when the DB query resolves", async () => {
    prisma.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);
    await expect(controller.check()).resolves.toEqual({ status: "ok" });
  });

  it("throws ServiceUnavailable when the DB query rejects", async () => {
    prisma.$queryRaw.mockRejectedValue(new Error("db down"));
    await expect(controller.check()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
