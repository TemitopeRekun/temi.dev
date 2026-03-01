import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { BlogListQueryDto } from "./dto/blog-list-query.dto";
import { BlogListResponseDto } from "./dto/blog-list-response.dto";
import { BlogDetailDto } from "./dto/blog-detail.dto";

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

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
        publishedAt: true,
        viewCount: true,
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
        publishedAt: true,
        viewCount: true,
      },
    });
    if (!post) throw new NotFoundException("Post not found");
    return post;
  }

  async incrementView(slug: string): Promise<void> {
    const updated = await this.prisma.blogPost.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
      select: { id: true },
    }).catch(() => null);
    if (!updated) throw new NotFoundException("Post not found");
  }
}
