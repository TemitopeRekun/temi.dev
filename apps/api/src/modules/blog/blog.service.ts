import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { BlogListQueryDto } from "./dto/blog-list-query.dto";
import { BlogListResponseDto } from "./dto/blog-list-response.dto";
import { BlogDetailDto } from "./dto/blog-detail.dto";
import { CreateBlogPostDto } from "./dto/create-blog-post.dto";
import { UpdateBlogPostDto } from "./dto/update-blog-post.dto";
import { BlogAdminListQueryDto } from "./dto/blog-admin-list-query.dto";
import { AiService } from "../ai/ai.service";
import { Prisma } from "@prisma/client";
import { toVectorLiteral } from "../../common/utils/vector";
import { applyCursorPage } from "../../common/utils/pagination";

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  async list(query: BlogListQueryDto): Promise<BlogListResponseDto> {
    const take = query.take ?? 10;
    const rows = await this.prisma.blogPost.findMany({
      where: { published: true },
      // `id` is the unique tiebreaker that makes the cursor ordering total.
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
      take: take + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        tags: true,
        coverImage: true,
        publishedAt: true,
      },
    });
    return applyCursorPage(rows, take);
  }

  async getBySlug(slug: string): Promise<BlogDetailDto> {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, published: true },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        tags: true,
        coverImage: true,
        publishedAt: true,
      },
    });
    if (!post) throw new NotFoundException("Post not found");
    return post;
  }

  async adminListAll(
    query: BlogAdminListQueryDto,
  ): Promise<{ items: Array<unknown>; nextCursor?: string }> {
    // Previously returned the full (unbounded) table. Now cursor-paginated like
    // the public list; response shape changed to { items, nextCursor } so the
    // admin UI can page through large tables.
    const take = query.take ?? 20;
    const rows = await this.prisma.blogPost.findMany({
      // publishedAt is nullable for drafts and title is non-unique, so `id` is
      // the unique tiebreaker that makes the cursor ordering deterministic.
      orderBy: [{ publishedAt: "desc" }, { title: "asc" }, { id: "asc" }],
      take: take + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        tags: true,
        coverImage: true,
        published: true,
        publishedAt: true,
      },
    });
    return applyCursorPage(rows, take);
  }

  async adminCreate(dto: CreateBlogPostDto): Promise<{ id: string }> {
    const existing = await this.prisma.blogPost.findUnique({
      where: { slug: dto.slug },
      select: { id: true },
    });
    if (existing) throw new BadRequestException("Slug already exists");
    const created = await this.prisma.$transaction((tx) =>
      tx.blogPost.create({
        data: {
          slug: dto.slug,
          title: dto.title,
          excerpt: dto.excerpt ?? null,
          content: dto.content,
          tags: dto.tags,
          coverImage: dto.coverImage ?? null,
          published: dto.published,
          publishedAt: dto.published ? new Date() : null,
        },
        select: { id: true, content: true, published: true },
      }),
    );
    if (created.published) {
      // Fire-and-forget: the HTTP response returns immediately while the
      // embedding is generated/stored in the background.
      this.embedBlogPostInBackground(created.id, created.content);
    }
    return { id: created.id };
  }

  async adminUpdate(
    id: string,
    dto: UpdateBlogPostDto,
  ): Promise<{ id: string }> {
    const prev = await this.prisma.blogPost.findUnique({
      where: { id },
      select: { id: true, content: true, published: true },
    });
    if (!prev) throw new NotFoundException("Post not found");
    const published = dto.published ?? prev.published;
    const updated = await this.prisma.$transaction((tx) =>
      tx.blogPost.update({
        where: { id },
        data: {
          title: dto.title ?? undefined,
          excerpt: dto.excerpt ?? undefined,
          content: dto.content ?? undefined,
          tags: dto.tags ?? undefined,
          coverImage: dto.coverImage ?? undefined,
          published: published,
          publishedAt: published ? new Date() : null,
        },
        select: { id: true, content: true, published: true },
      }),
    );
    const contentChanged =
      dto.content !== undefined && dto.content !== prev.content;
    if (contentChanged || (dto.published !== undefined && dto.published)) {
      this.embedBlogPostInBackground(updated.id, updated.content);
    }
    return { id };
  }

  async adminRemove(id: string): Promise<{ id: string }> {
    const deleted = await this.prisma.blogPost
      .delete({
        where: { id },
        select: { id: true },
      })
      .catch(() => null);
    if (!deleted) throw new NotFoundException("Post not found");
    return { id };
  }

  /**
   * Generates and stores a blog post embedding off the request path. Never
   * throws (errors are logged), retries once, so no unhandled rejection.
   */
  private embedBlogPostInBackground(id: string, content: string): void {
    void this.embedWithRetry(id, content, 1).catch((err: unknown) => {
      this.logger.error(
        `Background embedding failed for BlogPost ${id}`,
        err instanceof Error ? err.stack : String(err),
      );
    });
  }

  private async embedWithRetry(
    id: string,
    content: string,
    retries: number,
  ): Promise<void> {
    try {
      const emb = await this.ai.generateEmbedding(content);
      if (emb.length === 0) return;
      const vec = toVectorLiteral(emb);
      await this.prisma.$executeRaw`
        UPDATE "BlogPost" SET embedding = ${Prisma.raw(vec)} WHERE id = ${id}
      `;
    } catch (err) {
      if (retries > 0) {
        await this.embedWithRetry(id, content, retries - 1);
        return;
      }
      throw err;
    }
  }
}
