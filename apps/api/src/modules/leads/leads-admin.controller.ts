import { Controller, Get, Param, Patch, Query, UseGuards, Body, Delete, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";
import { LeadsService } from "./leads.service";
import { LeadsAdminListQueryDto } from "./dto/leads-admin-list-query.dto";
import { UpdateLeadAdminDto } from "./dto/update-lead-admin.dto";

@ApiTags("Leads (Admin)")
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller("api/admin/leads")
export class LeadsAdminController {
  constructor(private readonly leads: LeadsService) {}

  @Get()
  @ApiOperation({ summary: "Admin: list leads (cursor paginated, optional status filter)" })
  @ApiResponse({ status: 200 })
  async list(@Query() query: LeadsAdminListQueryDto): Promise<{ items: Array<unknown>; nextCursor?: string }> {
    return this.leads.adminList(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Admin: get lead by id" })
  @ApiResponse({ status: 200 })
  async getById(@Param("id") id: string): Promise<unknown> {
    return this.leads.adminGetById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Admin: update lead status/notes" })
  @ApiResponse({ status: 200 })
  async update(@Param("id") id: string, @Body() dto: UpdateLeadAdminDto): Promise<{ id: string }> {
    return this.leads.adminUpdate(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Admin: delete lead" })
  @ApiResponse({ status: 200 })
  async delete(@Param("id") id: string): Promise<void> {
    return this.leads.adminDelete(id);
  }

  @Post(":id/reply-draft")
  @ApiOperation({ summary: "Admin: generate AI reply draft" })
  @ApiResponse({ status: 201 })
  async generateReply(@Param("id") id: string): Promise<{ reply: string }> {
    return this.leads.generateReply(id);
  }
}
