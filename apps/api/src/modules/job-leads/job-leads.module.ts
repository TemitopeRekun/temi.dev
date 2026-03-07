import { Module } from "@nestjs/common";
import { JobLeadsService } from "./job-leads.service";
import { JobLeadsController } from "./job-leads.controller";
import { AiModule } from "../ai/ai.module";

@Module({
  imports: [AiModule],
  controllers: [JobLeadsController],
  providers: [JobLeadsService],
})
export class JobLeadsModule {}
