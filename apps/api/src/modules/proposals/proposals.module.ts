import { Module } from "@nestjs/common";
import { ProposalsService } from "./proposals.service";
import { ProposalsController } from "./proposals.controller";
import { AIService } from "../../services/ai.service";

@Module({
  controllers: [ProposalsController],
  providers: [ProposalsService, AIService],
})
export class ProposalsModule {}
