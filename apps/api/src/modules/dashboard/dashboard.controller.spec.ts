import { Test } from "@nestjs/testing";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

describe("DashboardController", () => {
  let controller: DashboardController;
  let service: { getStats: jest.Mock };

  beforeEach(async () => {
    service = {
      getStats: jest.fn().mockResolvedValue({
        totalProjects: 1,
        totalPosts: 2,
        totalLeads: 3,
        newLeads7d: 0,
      }),
    };
    const moduleRef = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [{ provide: DashboardService, useValue: service }],
    }).compile();
    controller = moduleRef.get(DashboardController);
  });

  it("getStats delegates to the service", async () => {
    const res = await controller.getStats();
    expect(service.getStats).toHaveBeenCalled();
    expect(res).toEqual({
      totalProjects: 1,
      totalPosts: 2,
      totalLeads: 3,
      newLeads7d: 0,
    });
  });
});
