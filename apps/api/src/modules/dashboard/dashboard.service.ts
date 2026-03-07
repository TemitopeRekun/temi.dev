import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [totalProjects, totalPosts, totalLeads, newLeads7d, totalJobLeads] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.blogPost.count(),
      this.prisma.lead.count(),
      this.prisma.lead.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.jobLead.count(),
    ]);

    return {
      totalProjects,
      totalPosts,
      totalLeads,
      newLeads7d,
      totalJobLeads,
    };
  }
}
