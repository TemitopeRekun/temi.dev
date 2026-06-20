import { Test } from "@nestjs/testing";
import { DashboardService } from "./dashboard.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("DashboardService", () => {
  let service: DashboardService;
  let prisma: {
    project: { count: jest.Mock };
    blogPost: { count: jest.Mock };
    lead: { count: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      project: { count: jest.fn().mockResolvedValue(3) },
      blogPost: { count: jest.fn().mockResolvedValue(7) },
      lead: { count: jest.fn().mockResolvedValueOnce(12).mockResolvedValueOnce(4) },
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(DashboardService);
  });

  it("aggregates counts across projects, posts, leads and recent leads", async () => {
    const stats = await service.getStats();
    expect(stats).toEqual({
      totalProjects: 3,
      totalPosts: 7,
      totalLeads: 12,
      newLeads7d: 4,
    });
    expect(prisma.lead.count).toHaveBeenCalledTimes(2);
    const recentArg = prisma.lead.count.mock.calls[1][0] as {
      where: { createdAt: { gte: Date } };
    };
    expect(recentArg.where.createdAt.gte).toBeInstanceOf(Date);
  });
});
