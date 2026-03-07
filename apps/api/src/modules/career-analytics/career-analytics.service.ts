import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AiService } from "../ai/ai.service";

type PrismaLike = {
  jobLead: {
    findMany(args: unknown): Promise<Array<{ platform: string; status: string; createdAt: Date }>>;
  };
  platformStats: {
    findMany(args: unknown): Promise<Array<Record<string, unknown>>>;
  };
};

@Injectable()
export class CareerAnalyticsService {
  private readonly prismaLike: PrismaLike;

  constructor(private readonly prisma: PrismaService, private readonly ai: AiService) {
    this.prismaLike = this.prisma as unknown as PrismaLike;
  }

  async summary() {
    const leads = await this.prismaLike.jobLead.findMany({
      select: { platform: true, status: true, createdAt: true },
    } as unknown);
    const byStatus: Record<string, number> = {};
    const platformTotals: Record<string, number> = {};
    leads.forEach((l) => {
      byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;
      platformTotals[l.platform] = (platformTotals[l.platform] ?? 0) + 1;
    });
    const platformStats = await this.prismaLike.platformStats.findMany({} as unknown);
    const conversion: Array<{ platform: string; rate: number }> = platformStats.map((s) => {
      const total = platformTotals[String(s.platform)] ?? 0;
      const wins = Number(s.wins ?? 0);
      const rate = total > 0 ? Math.round((wins / total) * 100) : 0;
      return { platform: String(s.platform), rate };
    });
    return { byStatus, conversion };
  }

  async platformStats() {
    return this.prismaLike.platformStats.findMany({
      select: { platform: true, proposalsSent: true, replies: true, interviews: true, wins: true, updatedAt: true },
      orderBy: [{ platform: "asc" }],
    } as unknown);
  }

  async weeklyInsights() {
    const stats = await this.summary();
    const text = await this.ai.generateWeeklyInsights(stats);
    return { insights: text };
  }
}
