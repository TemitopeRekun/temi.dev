import { BadRequestException } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);

function webpMagic(): Buffer {
  const b = Buffer.alloc(12);
  b.write("RIFF", 0, "ascii");
  b.write("WEBP", 8, "ascii");
  return b;
}

function ftypMagic(brand: string): Buffer {
  const b = Buffer.alloc(12);
  b.write("ftyp", 4, "ascii");
  b.write(brand, 8, "ascii");
  return b;
}

type FakeFile = {
  mimetype: string;
  toBuffer: () => Promise<Buffer>;
};

function makeRequest(opts: {
  multipart?: boolean;
  file?: FakeFile | null;
}): FastifyRequest {
  return {
    isMultipart: () => opts.multipart ?? true,
    file: async () => opts.file ?? null,
  } as unknown as FastifyRequest;
}

describe("UploadController", () => {
  let controller: UploadController;
  let uploadService: { uploadFile: jest.Mock };

  beforeEach(() => {
    uploadService = {
      uploadFile: jest.fn().mockResolvedValue("https://cdn.test/x.png"),
    };
    controller = new UploadController(
      uploadService as unknown as UploadService,
    );
  });

  it("rejects a non-multipart request", async () => {
    await expect(
      controller.uploadFile(makeRequest({ multipart: false })),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects when no file is present", async () => {
    await expect(
      controller.uploadFile(makeRequest({ file: null })),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects an empty file", async () => {
    await expect(
      controller.uploadFile(
        makeRequest({
          file: {
            mimetype: "image/png",
            toBuffer: async () => Buffer.alloc(0),
          },
        }),
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects content whose magic bytes are not a known image", async () => {
    await expect(
      controller.uploadFile(
        makeRequest({
          file: {
            mimetype: "image/png",
            toBuffer: async () => Buffer.from("not an image"),
          },
        }),
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects a disallowed declared mimetype even with valid PNG bytes", async () => {
    await expect(
      controller.uploadFile(
        makeRequest({
          file: {
            mimetype: "application/octet-stream",
            toBuffer: async () => PNG_MAGIC,
          },
        }),
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects a file that exceeds the 5MB limit", async () => {
    const big = Buffer.concat([PNG_MAGIC, Buffer.alloc(5 * 1024 * 1024 + 1)]);
    await expect(
      controller.uploadFile(
        makeRequest({
          file: { mimetype: "image/png", toBuffer: async () => big },
        }),
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects HEIC content which is not in the declared allowlist", async () => {
    await expect(
      controller.uploadFile(
        makeRequest({
          file: {
            mimetype: "image/png",
            toBuffer: async () => ftypMagic("heic"),
          },
        }),
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("accepts a valid JPEG", async () => {
    const res = await controller.uploadFile(
      makeRequest({
        file: { mimetype: "image/jpeg", toBuffer: async () => JPEG_MAGIC },
      }),
    );
    expect(res).toEqual({ url: "https://cdn.test/x.png" });
    const args = uploadService.uploadFile.mock.calls[0] as [Buffer, string, string];
    expect(args[1]).toMatch(/\.jpg$/);
  });

  it("accepts a valid WEBP", async () => {
    const res = await controller.uploadFile(
      makeRequest({
        file: { mimetype: "image/webp", toBuffer: async () => webpMagic() },
      }),
    );
    expect(res).toEqual({ url: "https://cdn.test/x.png" });
  });

  it("accepts a valid AVIF", async () => {
    const res = await controller.uploadFile(
      makeRequest({
        file: { mimetype: "image/avif", toBuffer: async () => ftypMagic("avif") },
      }),
    );
    expect(res).toEqual({ url: "https://cdn.test/x.png" });
  });

  it("accepts a valid PNG and returns the uploaded url", async () => {
    const res = await controller.uploadFile(
      makeRequest({
        file: {
          mimetype: "image/png",
          toBuffer: async () => PNG_MAGIC,
        },
      }),
    );
    expect(res).toEqual({ url: "https://cdn.test/x.png" });
    const args = uploadService.uploadFile.mock.calls[0] as [
      Buffer,
      string,
      string,
    ];
    expect(args[1]).toMatch(/\.png$/);
    expect(args[2]).toBe("image/png");
  });
});
