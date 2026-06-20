import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../../prisma/prisma.service";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Liveness/readiness probe (checks DB connectivity)" })
  async check(): Promise<{ status: string }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "ok" };
    } catch (error) {
      this.logger.error(
        "Health check failed",
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException("Database unavailable");
    }
  }
}
