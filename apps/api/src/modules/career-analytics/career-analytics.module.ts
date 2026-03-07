import { Module } from "@nestjs/common";
import { CareerAnalyticsService } from "./career-analytics.service";
import { CareerAnalyticsController } from "./career-analytics.controller";
import { AiModule } from "../ai/ai.module";

@Module({
  imports: [AiModule],
  controllers: [CareerAnalyticsController],
  providers: [CareerAnalyticsService],
})
export class CareerAnalyticsModule {}
