import { Module } from "@nestjs/common";
import { ProposalsService } from "./proposals.service";
import { ProposalsController } from "./proposals.controller";
import { AiModule } from "../ai/ai.module";

@Module({
  imports: [AiModule],
  controllers: [ProposalsController],
  providers: [ProposalsService],
})
export class ProposalsModule {}
