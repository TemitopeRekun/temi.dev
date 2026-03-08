import { ApiTags } from "@nestjs/swagger";
import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  Req,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";
import { pipeline } from "stream";
import { promisify } from "util";
import { createWriteStream, createReadStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { AdminGuard } from "../auth/guards/admin.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

const pump = promisify(pipeline);

@ApiTags("Upload")
@Controller("api/upload")
export class UploadController {
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

    const uploadDir = join(process.cwd(), "uploads");
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${randomUUID()}-${part.filename}`;
    const filePath = join(uploadDir, filename);

    await pump(part.file, createWriteStream(filePath));

    // Return the API URL instead of the static path to handle CORS/CORP headers manually
    const url = `/api/upload/${filename}`;

    return { url };
  }

  @Get(":filename")
  async getFile(@Param("filename") filename: string, @Res() res: FastifyReply) {
    const filePath = join(process.cwd(), "uploads", filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException("File not found");
    }

    const stream = createReadStream(filePath);

    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    res.header("Access-Control-Allow-Origin", "*");

    return res.send(stream);
  }
}
