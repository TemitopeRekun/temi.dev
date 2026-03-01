import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";
import { OutreachService } from "./outreach.service";
import { CreateOutreachDto } from "./dto/create-outreach.dto";
import { UpdateOutreachDto } from "./dto/update-outreach.dto";

@ApiTags("Outreach")
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller("api/outreach")
export class OutreachController {
  constructor(private readonly service: OutreachService) {}

  @Post()
  @ApiOperation({ summary: "Log an outreach action" })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateOutreachDto): Promise<{ id: string }> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List outreach logs (optional filter by jobLeadId)" })
  @ApiResponse({ status: 200 })
  async list(@Query("jobLeadId") jobLeadId?: string): Promise<unknown[]> {
    return this.service.list(jobLeadId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Add response/outcome to an outreach log" })
  @ApiResponse({ status: 200 })
  async update(@Param("id") id: string, @Body() dto: UpdateOutreachDto): Promise<{ id: string }> {
    return this.service.update(id, dto);
  }
}
