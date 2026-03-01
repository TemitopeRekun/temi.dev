import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";
import { CareerAnalyticsService } from "./career-analytics.service";

@ApiTags("Career Analytics")
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller("api/career-analytics")
export class CareerAnalyticsController {
  constructor(private readonly service: CareerAnalyticsService) {}

  @Get("summary")
  @ApiOperation({ summary: "Totals by status and platform conversion rates" })
  @ApiResponse({ status: 200 })
  async summary(): Promise<unknown> {
    return this.service.summary();
  }

  @Get("platform-stats")
  @ApiOperation({ summary: "Per-platform breakdown" })
  @ApiResponse({ status: 200 })
  async platformStats(): Promise<unknown> {
    return this.service.platformStats();
  }

  @Get("weekly-insights")
  @ApiOperation({ summary: "AI-generated weekly summary" })
  @ApiResponse({ status: 200 })
  async weeklyInsights(): Promise<{ insights: string }> {
    return this.service.weeklyInsights();
  }
}
