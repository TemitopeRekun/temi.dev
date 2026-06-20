import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";
import { BlogService } from "./blog.service";
import { CreateBlogPostDto } from "./dto/create-blog-post.dto";
import { UpdateBlogPostDto } from "./dto/update-blog-post.dto";
import { BlogAdminListQueryDto } from "./dto/blog-admin-list-query.dto";

@ApiTags("Blog (Admin)")
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller("api/admin/blog")
export class BlogAdminController {
  constructor(private readonly blog: BlogService) {}

  @Get("list")
  @ApiOperation({ summary: "Admin: list all blog posts (cursor paginated)" })
  @ApiResponse({ status: 200 })
  async list(
    @Query() query: BlogAdminListQueryDto,
  ): Promise<{ items: Array<unknown>; nextCursor?: string }> {
    return this.blog.adminListAll(query);
  }

  @Post()
  @ApiOperation({ summary: "Admin: create a blog post" })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateBlogPostDto): Promise<{ id: string }> {
    return this.blog.adminCreate(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Admin: update a blog post" })
  @ApiResponse({ status: 200 })
  async update(@Param("id") id: string, @Body() dto: UpdateBlogPostDto): Promise<{ id: string }> {
    return this.blog.adminUpdate(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Admin: delete a blog post" })
  @ApiResponse({ status: 200 })
  async remove(@Param("id") id: string): Promise<{ id: string }> {
    return this.blog.adminRemove(id);
  }

}
