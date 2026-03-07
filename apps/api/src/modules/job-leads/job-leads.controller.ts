import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JobLeadsService } from "./job-leads.service";
import { CreateJobLeadDto } from "./dto/create-job-lead.dto";
import { UpdateJobLeadDto } from "./dto/update-job-lead.dto";
import { ListJobLeadsQuery } from "./dto/list-job-leads.query";
import { CsvImportDto } from "./dto/csv-import.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";

@ApiTags("Job Leads")
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller("api/admin/job-leads")
export class JobLeadsController {
  constructor(private readonly service: JobLeadsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new job lead" })
  async create(@Body() dto: CreateJobLeadDto) {
    const id = await this.service.create(dto);
    return { id };
  }

  @Post("import")
  @ApiOperation({ summary: "Import job leads from CSV" })
  async importCsv(@Body() dto: CsvImportDto) {
    return this.service.importCsv(dto);
  }

  @Get()
  @ApiOperation({ summary: "List job leads with filtering" })
  async list(@Query() query: ListJobLeadsQuery) {
    return this.service.list(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a job lead by ID" })
  async findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a job lead" })
  async update(@Param("id") id: string, @Body() dto: UpdateJobLeadDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a job lead" })
  async remove(@Param("id") id: string) {
    return this.service.delete(id);
  }

  @Post(":id/analyze")
  @ApiOperation({ summary: "Analyze job lead fit using AI" })
  async analyze(@Param("id") id: string) {
    return this.service.analyze(id);
  }

  @Post(":id/proposal")
  @ApiOperation({ summary: "Generate a proposal draft using AI" })
  async generateProposal(
    @Param("id") id: string,
    @Body("variant") variant?: string,
  ) {
    return this.service.generateProposal(id, variant);
  }
}
