import { Module } from "@nestjs/common";
import { JobLeadsService } from "./job-leads.service";
import { JobLeadsController } from "./job-leads.controller";
import { AIService } from "../../services/ai.service";

@Module({
  controllers: [JobLeadsController],
  providers: [JobLeadsService, AIService],
})
export class JobLeadsModule {}
