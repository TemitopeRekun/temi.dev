import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";
import { BlogService } from "./blog.service";
import { CreateBlogPostDto } from "./dto/create-blog-post.dto";
import { UpdateBlogPostDto } from "./dto/update-blog-post.dto";

@ApiTags("Blog (Admin)")
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller("api/admin/blog")
export class BlogAdminController {
  constructor(private readonly blog: BlogService) {}

  @Get("list")
  @ApiOperation({ summary: "Admin: list all blog posts" })
  @ApiResponse({ status: 200 })
  async list(): Promise<Array<unknown>> {
    return this.blog.adminListAll();
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

  @Post("generate")
  @ApiOperation({ summary: "Admin: generate a blog post draft from a topic" })
  @ApiResponse({ status: 201 })
  async generate(@Body() body: { topic: string }): Promise<any> {
    return this.blog.adminGenerate(body.topic);
  }

  @Get("trending")
  @ApiOperation({ summary: "Admin: get trending tech topics for blog ideas" })
  @ApiResponse({ status: 200 })
  async getTrending(): Promise<string[]> {
    return this.blog.adminGetTrendingTopics();
  }
}
