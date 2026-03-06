import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../../prisma/prisma.module";
import { AiService } from "./ai.service";

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
