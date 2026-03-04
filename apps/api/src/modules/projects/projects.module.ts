import { Module } from "@nestjs/common";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { ProjectsAdminController } from "./projects-admin.controller";
import { AiModule } from "../ai/ai.module";

@Module({
  imports: [AiModule],
  controllers: [ProjectsController, ProjectsAdminController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
