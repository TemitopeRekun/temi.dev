import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";
import { DashboardService } from "./dashboard.service";

@ApiTags("Dashboard")
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller("api/admin/dashboard")
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get("stats")
  @ApiOperation({ summary: "Get admin dashboard stats" })
  @ApiResponse({ status: 200 })
  async getStats() {
    return this.service.getStats();
  }
}
