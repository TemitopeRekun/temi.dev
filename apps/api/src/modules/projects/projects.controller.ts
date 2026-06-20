import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProjectsService } from "./projects.service";
import { ProjectsQueryDto } from "./dto/projects-query.dto";
import { ProjectDto } from "./dto/project.dto";
import { ProjectsListResponseDto } from "./dto/projects-list-response.dto";

@ApiTags("Projects")
@Controller("api/projects")
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: "List projects (cursor paginated, filter by tech)" })
  @ApiResponse({ status: 200, type: ProjectsListResponseDto })
  async list(
    @Query() query: ProjectsQueryDto,
  ): Promise<ProjectsListResponseDto> {
    return this.projects.list(query);
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Get project by slug" })
  @ApiResponse({ status: 200, type: ProjectDto })
  async getBySlug(@Param("slug") slug: string): Promise<ProjectDto> {
    return this.projects.getBySlug(slug);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get project by id" })
  @ApiResponse({ status: 200, type: ProjectDto })
  async getById(@Param("id") id: string): Promise<ProjectDto> {
    return this.projects.getById(id);
  }
}
