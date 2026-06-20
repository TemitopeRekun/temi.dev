import { PrismaService } from "./prisma.service";

describe("PrismaService", () => {
  let service: PrismaService;

  beforeEach(() => {
    service = new PrismaService();
  });

  it("connects on module init", async () => {
    const connect = jest
      .spyOn(service, "$connect")
      .mockResolvedValue(undefined);
    await service.onModuleInit();
    expect(connect).toHaveBeenCalled();
  });

  it("disconnects on module destroy", async () => {
    const disconnect = jest
      .spyOn(service, "$disconnect")
      .mockResolvedValue(undefined);
    await service.onModuleDestroy();
    expect(disconnect).toHaveBeenCalled();
  });
});
