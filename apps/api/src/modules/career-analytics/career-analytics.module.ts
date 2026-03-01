import { Module } from "@nestjs/common";
import { CareerAnalyticsService } from "./career-analytics.service";
import { CareerAnalyticsController } from "./career-analytics.controller";
import { AIService } from "../../services/ai.service";

@Module({
  controllers: [CareerAnalyticsController],
  providers: [CareerAnalyticsService, AIService],
})
export class CareerAnalyticsModule {}
