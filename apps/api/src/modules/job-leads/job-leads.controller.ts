import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";
import { JobLeadsService } from "./job-leads.service";
import { CreateJobLeadDto } from "./dto/create-job-lead.dto";
import { ListJobLeadsQuery } from "./dto/list-job-leads.query";
import { UpdateJobLeadDto } from "./dto/update-job-lead.dto";
import { CsvImportDto } from "./dto/csv-import.dto";

@ApiTags("Job Leads")
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller("api/job-leads")
export class JobLeadsController {
  constructor(private readonly service: JobLeadsService) {}

  @Post()
  @ApiOperation({ summary: "Create a job lead (manual)" })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateJobLeadDto): Promise<{ id: string }> {
    const id = await this.service.create(dto);
    return { id };
  }

  @Post("csv")
  @ApiOperation({ summary: "Bulk import leads from CSV" })
  @ApiResponse({ status: 200 })
  async importCsv(@Body() dto: CsvImportDto): Promise<{ created: number }> {
    return this.service.importCsv(dto);
  }

  @Get()
  @ApiOperation({ summary: "List leads (filterable, cursor paginated)" })
  @ApiResponse({ status: 200 })
  async list(@Query() query: ListJobLeadsQuery): Promise<{ items: unknown[]; nextCursor?: string }> {
    return this.service.list(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get lead by id" })
  @ApiResponse({ status: 200 })
  async getById(@Param("id") id: string): Promise<unknown> {
    return this.service.getById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update lead status/notes" })
  @ApiResponse({ status: 200 })
  async update(@Param("id") id: string, @Body() dto: UpdateJobLeadDto): Promise<{ id: string }> {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a lead" })
  @ApiResponse({ status: 200 })
  async remove(@Param("id") id: string): Promise<{ id: string }> {
    return this.service.remove(id);
  }

  @Post(":id/score")
  @ApiOperation({ summary: "Trigger AI scoring for a lead" })
  @ApiResponse({ status: 200 })
  async score(@Param("id") id: string): Promise<{ score: number; reason: string; pitchAngle: string }> {
    return this.service.score(id);
  }
}
