import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProjectsService } from "./projects.service";
import { ProjectsQueryDto } from "./dto/projects-query.dto";
import { ProjectDto } from "./dto/project.dto";

@ApiTags("Projects")
@Controller("api/projects")
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: "List projects (filter by tech)" })
  @ApiResponse({ status: 200, type: ProjectDto, isArray: true })
  async list(@Query() query: ProjectsQueryDto): Promise<ProjectDto[]> {
    return this.projects.list(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get project by id" })
  @ApiResponse({ status: 200, type: ProjectDto })
  async getById(@Param("id") id: string): Promise<ProjectDto> {
    return this.projects.getById(id);
  }
}
