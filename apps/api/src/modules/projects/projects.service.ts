import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ProjectsQueryDto } from "./dto/projects-query.dto";
import { ProjectDto } from "./dto/project.dto";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ProjectsQueryDto): Promise<ProjectDto[]> {
    const where =
      query.tech && query.tech.length > 0
        ? {
            techStack: query.tech.length === 1 ? { has: query.tech[0] } : { hasEvery: query.tech },
          }
        : undefined;
    const items = await this.prisma.project.findMany({
      where,
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      select: {
        id: true,
        title: true,
        description: true,
        techStack: true,
        liveUrl: true,
        repoUrl: true,
        featured: true,
        order: true,
      },
    });
    return items;
  }

  async getById(id: string): Promise<ProjectDto> {
    const item = await this.prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        techStack: true,
        liveUrl: true,
        repoUrl: true,
        featured: true,
        order: true,
      },
    });
    if (!item) throw new NotFoundException("Project not found");
    return item;
  }
}
