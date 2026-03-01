import { Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BlogService } from "./blog.service";
import { BlogListQueryDto } from "./dto/blog-list-query.dto";
import { BlogListResponseDto } from "./dto/blog-list-response.dto";
import { BlogDetailDto } from "./dto/blog-detail.dto";
import { Throttle } from "@nestjs/throttler";

@ApiTags("Blog")
@Controller("api/blog")
export class BlogController {
  constructor(private readonly blog: BlogService) {}

  @Get()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: "List blog posts (cursor paginated)" })
  @ApiResponse({ status: 200, type: BlogListResponseDto })
  async list(@Query() query: BlogListQueryDto): Promise<BlogListResponseDto> {
    return this.blog.list(query);
  }

  @Get(":slug")
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiOperation({ summary: "Get blog post by slug" })
  @ApiResponse({ status: 200, type: BlogDetailDto })
  async getBySlug(@Param("slug") slug: string): Promise<BlogDetailDto> {
    return this.blog.getBySlug(slug);
  }

  @Patch(":slug/view")
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: "Increment blog post view count" })
  @ApiResponse({ status: 200, description: "View count incremented" })
  async incrementView(@Param("slug") slug: string): Promise<void> {
    await this.blog.incrementView(slug);
  }
}
