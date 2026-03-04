import { Module } from "@nestjs/common";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";
import { BlogAdminController } from "./blog-admin.controller";
import { AiModule } from "../ai/ai.module";

@Module({
  imports: [AiModule],
  controllers: [BlogController, BlogAdminController],
  providers: [BlogService],
})
export class BlogModule {}
