import { Test } from "@nestjs/testing";
import { LeadsController } from "./leads.controller";
import { LeadsService } from "./leads.service";

describe("LeadsController", () => {
  let controller: LeadsController;
  let service: { create: jest.Mock };

  beforeEach(async () => {
    service = { create: jest.fn().mockResolvedValue("new-id") };
    const moduleRef = await Test.createTestingModule({
      controllers: [LeadsController],
      providers: [{ provide: LeadsService, useValue: service }],
    }).compile();
    controller = moduleRef.get(LeadsController);
  });

  it("delegates to the service and wraps the id with a received status", async () => {
    const res = await controller.create({
      name: "Jane",
      email: "jane@example.com",
      message: "hi",
    });
    expect(service.create).toHaveBeenCalled();
    expect(res).toEqual({ id: "new-id", status: "received" });
  });
});
