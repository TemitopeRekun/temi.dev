import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ProjectsQueryDto } from "./dto/projects-query.dto";
import { ProjectDto } from "./dto/project.dto";
import { ProjectsListResponseDto } from "./dto/projects-list-response.dto";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { AiService } from "../ai/ai.service";
import { Prisma } from "@prisma/client";
import { toVectorLiteral } from "../../common/utils/vector";
import { applyCursorPage } from "../../common/utils/pagination";

const PROJECT_SELECT = {
  id: true,
  slug: true,
  title: true,
  description: true,
  body: true,
  category: true,
  year: true,
  techStack: true,
  liveUrl: true,
  repoUrl: true,
  coverImage: true,
  featured: true,
  order: true,
} as const;

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  async list(query: ProjectsQueryDto): Promise<ProjectsListResponseDto> {
    // Previously returned an unbounded array. Now cursor-paginated; response
    // shape changed to { items, nextCursor }.
    const take = query.take ?? 20;
    const where =
      query.tech && query.tech.length > 0
        ? {
            techStack:
              query.tech.length === 1
                ? { has: query.tech[0] }
                : { hasEvery: query.tech },
          }
        : undefined;
    const rows = await this.prisma.project.findMany({
      where,
      orderBy: [{ featured: "desc" }, { order: "asc" }, { id: "asc" }],
      take: take + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      select: PROJECT_SELECT,
    });
    return applyCursorPage(rows, take);
  }

  async getById(id: string): Promise<ProjectDto> {
    const item = await this.prisma.project.findUnique({
      where: { id },
      select: PROJECT_SELECT,
    });
    if (!item) throw new NotFoundException("Project not found");
    return item;
  }

  async getBySlug(slug: string): Promise<ProjectDto> {
    const item = await this.prisma.project.findUnique({
      where: { slug },
      select: PROJECT_SELECT,
    });
    if (!item) throw new NotFoundException("Project not found");
    return item;
  }

  async create(dto: CreateProjectDto): Promise<string> {
    const created = await this.prisma.$transaction((tx) =>
      tx.project.create({
        data: {
          slug: dto.slug,
          title: dto.title,
          description: dto.description,
          body: dto.body ?? null,
          category: dto.category,
          year: dto.year,
          techStack: dto.techStack,
          liveUrl: dto.liveUrl ?? null,
          repoUrl: dto.repoUrl ?? null,
          coverImage: dto.coverImage ?? null,
          featured: dto.featured,
          order: dto.order,
        },
        select: { id: true },
      }),
    );
    this.embedProjectInBackground(created.id, dto.description);
    return created.id;
  }

  async update(id: string, dto: UpdateProjectDto): Promise<{ id: string }> {
    const prev = await this.prisma.project.findUnique({
      where: { id },
      select: { id: true, description: true },
    });
    const updated = await this.prisma.$transaction((tx) =>
      tx.project
        .update({
          where: { id },
          data: {
            slug: dto.slug ?? undefined,
            title: dto.title ?? undefined,
            description: dto.description ?? undefined,
            body: dto.body ?? undefined,
            category: dto.category ?? undefined,
            year: dto.year ?? undefined,
            techStack: dto.techStack ?? undefined,
            liveUrl: dto.liveUrl ?? undefined,
            repoUrl: dto.repoUrl ?? undefined,
            coverImage: dto.coverImage ?? undefined,
            featured: dto.featured ?? undefined,
            order: dto.order ?? undefined,
          },
          select: { id: true },
        })
        .catch(() => null),
    );
    if (!updated) throw new NotFoundException("Project not found");
    const descriptionChanged =
      dto.description !== undefined && dto.description !== prev?.description;
    if (descriptionChanged) {
      const content = dto.description ?? prev?.description ?? "";
      this.embedProjectInBackground(id, content);
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

  /**
   * Generates and stores a project embedding off the request path. Never
   * throws (errors are logged), retries once, so no unhandled rejection.
   */
  private embedProjectInBackground(id: string, description: string): void {
    void this.embedWithRetry(id, description, 1).catch((err: unknown) => {
      this.logger.error(
        `Background embedding failed for Project ${id}`,
        err instanceof Error ? err.stack : String(err),
      );
    });
  }

  private async embedWithRetry(
    id: string,
    description: string,
    retries: number,
  ): Promise<void> {
    try {
      const emb = await this.ai.generateEmbedding(description);
      if (emb.length === 0) return;
      const vec = toVectorLiteral(emb);
      await this.prisma.$executeRaw`
        UPDATE "Project" SET embedding = ${Prisma.raw(vec)} WHERE id = ${id}
      `;
    } catch (err) {
      if (retries > 0) {
        await this.embedWithRetry(id, description, retries - 1);
        return;
      }
      throw err;
    }
  }
}
