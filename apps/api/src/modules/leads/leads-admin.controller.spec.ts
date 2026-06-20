import { Test } from "@nestjs/testing";
import { LeadsAdminController } from "./leads-admin.controller";
import { LeadsService } from "./leads.service";

describe("LeadsAdminController", () => {
  let controller: LeadsAdminController;
  let service: {
    adminList: jest.Mock;
    adminGetById: jest.Mock;
    adminUpdate: jest.Mock;
    adminDelete: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      adminList: jest.fn().mockResolvedValue({ items: [], nextCursor: undefined }),
      adminGetById: jest.fn().mockResolvedValue({ id: "x" }),
      adminUpdate: jest.fn().mockResolvedValue({ id: "x" }),
      adminDelete: jest.fn().mockResolvedValue(undefined),
    };
    const moduleRef = await Test.createTestingModule({
      controllers: [LeadsAdminController],
      providers: [{ provide: LeadsService, useValue: service }],
    }).compile();
    controller = moduleRef.get(LeadsAdminController);
  });

  it("list delegates with the query", async () => {
    await controller.list({ take: 5 });
    expect(service.adminList).toHaveBeenCalledWith({ take: 5 });
  });

  it("getById delegates with the id", async () => {
    await controller.getById("abc");
    expect(service.adminGetById).toHaveBeenCalledWith("abc");
  });

  it("update delegates with id and dto", async () => {
    await controller.update("abc", { status: "won" });
    expect(service.adminUpdate).toHaveBeenCalledWith("abc", { status: "won" });
  });

  it("delete delegates with the id", async () => {
    await controller.delete("abc");
    expect(service.adminDelete).toHaveBeenCalledWith("abc");
  });
});
