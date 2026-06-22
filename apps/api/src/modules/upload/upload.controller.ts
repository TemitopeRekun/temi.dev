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
import {
  ALLOWED_IMAGE_MIME_EXT,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_MB,
} from "@temi/types";
import { AdminGuard } from "../auth/guards/admin.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UploadService } from "./upload.service";

type DetectedImage = { mimetype: string; ext: string };

// Allowlisted image mimetype → canonical extension map is shared with the web
// app via @temi/types so both tiers agree on what is accepted. Both the
// declared mimetype AND the file's magic bytes must match an entry here.

/**
 * Detects the real image type from the buffer's magic bytes. Returns null when
 * the content does not match a supported image format.
 */
function detectImage(buffer: Buffer): DetectedImage | null {
  // PNG: 89 50 4E 47
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { mimetype: "image/png", ext: "png" };
  }
  // JPEG: FF D8 FF
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { mimetype: "image/jpeg", ext: "jpg" };
  }
  // WEBP: "RIFF" .... "WEBP"
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { mimetype: "image/webp", ext: "webp" };
  }
  // AVIF / HEIF: ftyp box with a known brand at bytes 8..12
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 4, 8) === "ftyp"
  ) {
    const brand = buffer.toString("ascii", 8, 12);
    if (brand === "avif" || brand === "avis") {
      return { mimetype: "image/avif", ext: "avif" };
    }
    if (brand === "heic" || brand === "heix" || brand === "mif1") {
      // HEIF/HEIC content is served as AVIF-compatible; not in the declared
      // allowlist, so it will be rejected by the mimetype check below.
      return { mimetype: "image/heic", ext: "heic" };
    }
  }
  return null;
}

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

    if (buffer.length === 0) {
      throw new BadRequestException("Empty file");
    }
    if (buffer.length > MAX_UPLOAD_BYTES) {
      throw new BadRequestException(`File exceeds the ${MAX_UPLOAD_MB}MB limit`);
    }

    const detected = detectImage(buffer);
    if (!detected) {
      throw new BadRequestException("Unsupported or invalid image file");
    }

    // Both the declared mimetype and the detected content type must be in the
    // allowlist and agree with each other.
    const allowedExt = ALLOWED_IMAGE_MIME_EXT[part.mimetype];
    if (!allowedExt || !ALLOWED_IMAGE_MIME_EXT[detected.mimetype]) {
      throw new BadRequestException("Unsupported image type");
    }

    // Drop the raw client filename entirely; derive a safe one from the
    // validated content type.
    const safeFilename = `${randomUUID()}.${detected.ext}`;

    const url = await this.uploadService.uploadFile(
      buffer,
      safeFilename,
      detected.mimetype,
    );

    return { url };
  }
}
