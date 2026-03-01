import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";
import { ProposalsService } from "./proposals.service";
import { GenerateProposalDto } from "./dto/generate-proposal.dto";
import { UpdateProposalDto } from "./dto/update-proposal.dto";

@ApiTags("Proposals")
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller("api/proposals")
export class ProposalsController {
  constructor(private readonly service: ProposalsService) {}

  @Post("generate")
  @ApiOperation({ summary: "AI-generate a proposal variant for a job lead" })
  @ApiResponse({ status: 201 })
  async generate(@Body() dto: GenerateProposalDto): Promise<{ id: string; content: string }> {
    return this.service.generate(dto);
  }

  @Get()
  @ApiOperation({ summary: "List proposals (optional filter by jobLeadId)" })
  @ApiResponse({ status: 200 })
  async list(@Query("jobLeadId") jobLeadId?: string): Promise<unknown[]> {
    return this.service.list(jobLeadId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update proposal content/approval" })
  @ApiResponse({ status: 200 })
  async update(@Param("id") id: string, @Body() dto: UpdateProposalDto): Promise<{ id: string }> {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a proposal" })
  @ApiResponse({ status: 200 })
  async remove(@Param("id") id: string): Promise<{ id: string }> {
    return this.service.remove(id);
  }
}
