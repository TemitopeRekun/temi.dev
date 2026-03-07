import { ApiTags } from "@nestjs/swagger";
import {
  Controller,
  Post,
  Req,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { pipeline } from "stream";
import { promisify } from "util";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { AdminGuard } from "../auth/guards/admin.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

const pump = promisify(pipeline);

@ApiTags("Upload")
@Controller("api/upload")
@UseGuards(JwtAuthGuard, AdminGuard)
export class UploadController {
  @Post()
  async uploadFile(@Req() req: FastifyRequest): Promise<{ url: string }> {
    if (!req.isMultipart()) {
      throw new BadRequestException("Request is not multipart");
    }

    const part = await req.file();
    if (!part) {
      throw new BadRequestException("No file uploaded");
    }

    const uploadDir = join(process.cwd(), "uploads");
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${randomUUID()}-${part.filename}`;
    const filePath = join(uploadDir, filename);

    await pump(part.file, createWriteStream(filePath));

    // Determine base URL
    // In production, this should be the public URL of the server or CDN
    // For now, we use a relative path assuming the frontend can resolve it
    // or the backend serves it from /uploads
    const url = `/uploads/${filename}`;

    return { url };
  }
}
