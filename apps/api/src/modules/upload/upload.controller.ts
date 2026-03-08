import { ApiTags } from "@nestjs/swagger";
import {
  Controller,
  Post,
  Req,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import { AdminGuard } from "../auth/guards/admin.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UploadService } from "./upload.service";

@ApiTags("Upload")
@Controller("api/upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async uploadFile(@Req() req: FastifyRequest): Promise<{ url: string }> {
    if (!req.isMultipart()) {
      throw new BadRequestException("Request is not multipart");
    }

    const part = await req.file();
    if (!part) {
      throw new BadRequestException("No file uploaded");
    }

    const buffer = await part.toBuffer();
    const filename = `${randomUUID()}-${part.filename}`;

    const url = await this.uploadService.uploadFile(
      buffer,
      filename,
      part.mimetype
    );

    return { url };
  }
}
