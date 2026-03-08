import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ProjectsQueryDto } from "./dto/projects-query.dto";
import { ProjectDto } from "./dto/project.dto";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { AiService } from "../ai/ai.service";

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai?: AiService,
  ) {}

  async list(query: ProjectsQueryDto): Promise<ProjectDto[]> {
    const where =
      query.tech && query.tech.length > 0
        ? {
            techStack:
              query.tech.length === 1
                ? { has: query.tech[0] }
                : { hasEvery: query.tech },
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
        coverImage: true,
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
        coverImage: true,
        featured: true,
        order: true,
      },
    });
    if (!item) throw new NotFoundException("Project not found");
    return item;
  }

  async create(dto: CreateProjectDto): Promise<string> {
    const created = await this.prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        techStack: dto.techStack,
        liveUrl: dto.liveUrl ?? null,
        repoUrl: dto.repoUrl ?? null,
        coverImage: dto.coverImage ?? null,
        featured: dto.featured,
        order: dto.order,
      },
      select: { id: true },
    });
    if (this.ai) {
      const emb = await this.ai.generateEmbedding(dto.description);
      if (emb.length > 0) {
        const vec = `'[${emb.map((v) => (Number.isFinite(v) ? v.toFixed(6) : 0)).join(", ")}]'::vector`;
        await this.prisma.$executeRawUnsafe(
          `UPDATE "Project" SET embedding = ${vec} WHERE id = '${created.id}'`,
        );
      }
    }
    return created.id;
  }

  async update(id: string, dto: UpdateProjectDto): Promise<{ id: string }> {
    const prev = await this.prisma.project.findUnique({
      where: { id },
      select: { id: true, description: true },
    });
    const updated = await this.prisma.project
      .update({
        where: { id },
        data: {
          title: dto.title ?? undefined,
          description: dto.description ?? undefined,
          techStack: dto.techStack ?? undefined,
          liveUrl: dto.liveUrl ?? undefined,
          repoUrl: dto.repoUrl ?? undefined,
          coverImage: dto.coverImage ?? undefined,
          featured: dto.featured ?? undefined,
          order: dto.order ?? undefined,
        },
        select: { id: true },
      })
      .catch(() => null);
    if (!updated) throw new NotFoundException("Project not found");
    const descriptionChanged =
      dto.description !== undefined && dto.description !== prev?.description;
    if (this.ai && descriptionChanged) {
      const content = dto.description ?? prev?.description ?? "";
      const emb = await this.ai.generateEmbedding(content);
      if (emb.length > 0) {
        const vec = `'[${emb.map((v) => (Number.isFinite(v) ? v.toFixed(6) : 0)).join(", ")}]'::vector`;
        await this.prisma.$executeRawUnsafe(
          `UPDATE "Project" SET embedding = ${vec} WHERE id = '${id}'`,
        );
      }
    }
    return { id };
  }

  async remove(id: string): Promise<{ id: string }> {
    const deleted = await this.prisma.project
      .delete({
        where: { id },
        select: { id: true },
      })
      .catch(() => null);
    if (!deleted) throw new NotFoundException("Project not found");
    return { id };
  }
}
