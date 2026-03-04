import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { BlogModule } from "./modules/blog/blog.module";
import { LeadsModule } from "./modules/leads/leads.module";
import { UploadModule } from "./modules/upload/upload.module";
import { JobLeadsModule } from "./modules/job-leads/job-leads.module";
import { ProposalsModule } from "./modules/proposals/proposals.module";
import { OutreachModule } from "./modules/outreach/outreach.module";
import { CareerAnalyticsModule } from "./modules/career-analytics/career-analytics.module";
import { AiModule } from "./modules/ai/ai.module";
import { RagModule } from "./modules/rag/rag.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }]),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    BlogModule,
    LeadsModule,
    UploadModule,
    JobLeadsModule,
    ProposalsModule,
    OutreachModule,
    CareerAnalyticsModule,
    AiModule,
    RagModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
