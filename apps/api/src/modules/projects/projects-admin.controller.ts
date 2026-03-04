import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@ApiTags("Projects (Admin)")
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller("api/admin/projects")
export class ProjectsAdminController {
  constructor(private readonly projects: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: "Admin: create a project" })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateProjectDto): Promise<{ id: string }> {
    const id = await this.projects.create(dto);
    return { id };
  }

  @Patch(":id")
  @ApiOperation({ summary: "Admin: update a project" })
  @ApiResponse({ status: 200 })
  async update(@Param("id") id: string, @Body() dto: UpdateProjectDto): Promise<{ id: string }> {
    return this.projects.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Admin: delete a project" })
  @ApiResponse({ status: 200 })
  async remove(@Param("id") id: string): Promise<{ id: string }> {
    return this.projects.remove(id);
  }
}
