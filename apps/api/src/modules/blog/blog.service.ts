import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { BlogListQueryDto } from "./dto/blog-list-query.dto";
import { BlogListResponseDto } from "./dto/blog-list-response.dto";
import { BlogDetailDto } from "./dto/blog-detail.dto";
import { CreateBlogPostDto } from "./dto/create-blog-post.dto";
import { UpdateBlogPostDto } from "./dto/update-blog-post.dto";
import { AiService } from "../ai/ai.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai?: AiService,
  ) {}

  async list(query: BlogListQueryDto): Promise<BlogListResponseDto> {
    const take = query.take ?? 10;
    const items = await this.prisma.blogPost.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }],
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
    let nextCursor: string | undefined;
    if (items.length > take) {
      const next = items.pop();
      nextCursor = next?.id;
    }
    return { items, nextCursor };
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

  async adminListAll(): Promise<Array<unknown>> {
    const items = await this.prisma.blogPost.findMany({
      orderBy: [{ publishedAt: "desc" }, { title: "asc" }],
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
    return items;
  }

  async adminCreate(dto: CreateBlogPostDto): Promise<{ id: string }> {
    const existing = await this.prisma.blogPost.findUnique({
      where: { slug: dto.slug },
      select: { id: true },
    });
    if (existing) throw new BadRequestException("Slug already exists");
    const data = {
      slug: dto.slug,
      title: dto.title,
      excerpt: dto.excerpt ?? null,
      content: dto.content,
      tags: dto.tags,
      coverImage: dto.coverImage ?? null,
      published: dto.published,
      publishedAt: dto.published ? new Date() : null,
    };
    const created = await this.prisma.blogPost.create({
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
    });
    if (created.published && this.ai) {
      const emb = await this.ai.generateEmbedding(created.content);
      if (emb.length > 0) {
        const vec = `'[${emb.filter((v) => Number.isFinite(v)).map((v) => v.toFixed(6)).join(", ")}]'::vector`;
        await this.prisma.$executeRaw`
          UPDATE "BlogPost" SET embedding = ${Prisma.raw(vec)} WHERE id = ${created.id}
        `;
      }
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
    const updated = await this.prisma.blogPost.update({
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
    });
    const contentChanged =
      dto.content !== undefined && dto.content !== prev.content;
    if (
      this.ai &&
      (contentChanged || (dto.published !== undefined && dto.published))
    ) {
      const emb = await this.ai.generateEmbedding(updated.content);
      if (emb.length > 0) {
        const vec = `'[${emb.filter((v) => Number.isFinite(v)).map((v) => v.toFixed(6)).join(", ")}]'::vector`;
        await this.prisma.$executeRaw`
          UPDATE "BlogPost" SET embedding = ${Prisma.raw(vec)} WHERE id = ${updated.id}
        `;
      }
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

}
