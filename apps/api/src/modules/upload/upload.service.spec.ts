import { InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UploadService } from "./upload.service";

const uploadMock = jest.fn();
const getPublicUrlMock = jest.fn();
const getBucketMock = jest.fn();
const createBucketMock = jest.fn();
const fromMock = jest.fn(() => ({
  upload: uploadMock,
  getPublicUrl: getPublicUrlMock,
}));

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    storage: {
      from: fromMock,
      getBucket: getBucketMock,
      createBucket: createBucketMock,
    },
  })),
}));

function makeService(creds = true): UploadService {
  const values: Record<string, string> = creds
    ? {
        SUPABASE_URL: "https://supabase.test",
        SUPABASE_SERVICE_ROLE_KEY: "service-key",
        SUPABASE_BUCKET: "uploads",
      }
    : {};
  const config = {
    get: (key: string): string | undefined => values[key],
  } as unknown as ConfigService;
  return new UploadService(config);
}

describe("UploadService", () => {
  let service: UploadService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = makeService();
    jest.spyOn(service["logger"], "error").mockImplementation(() => undefined);
  });

  it("uploads the file and returns the public url", async () => {
    uploadMock.mockResolvedValue({ error: null });
    getPublicUrlMock.mockReturnValue({
      data: { publicUrl: "https://cdn.test/file.png" },
    });
    const url = await service.uploadFile(
      Buffer.from("data"),
      "file.png",
      "image/png",
    );
    expect(url).toBe("https://cdn.test/file.png");
    expect(uploadMock).toHaveBeenCalledWith(
      "file.png",
      expect.any(Buffer),
      expect.objectContaining({ contentType: "image/png", upsert: true }),
    );
  });

  it("throws a generic error when the upload fails", async () => {
    uploadMock.mockResolvedValue({ error: { message: "bucket exploded" } });
    await expect(
      service.uploadFile(Buffer.from("data"), "file.png", "image/png"),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it("constructs without throwing when Supabase credentials are missing", () => {
    expect(() => makeService(false)).not.toThrow();
  });

  describe("onModuleInit", () => {
    it("creates the bucket when it is not found", async () => {
      getBucketMock.mockResolvedValue({
        error: { message: "Bucket not found" },
      });
      createBucketMock.mockResolvedValue({ error: null });
      jest.spyOn(service["logger"], "log").mockImplementation(() => undefined);
      await service.onModuleInit();
      expect(createBucketMock).toHaveBeenCalledWith("uploads", {
        public: true,
      });
    });

    it("logs when bucket creation fails", async () => {
      getBucketMock.mockResolvedValue({
        error: { message: "Bucket not found" },
      });
      createBucketMock.mockResolvedValue({ error: { message: "denied" } });
      jest.spyOn(service["logger"], "log").mockImplementation(() => undefined);
      await expect(service.onModuleInit()).resolves.toBeUndefined();
    });

    it("warns on an unexpected getBucket error", async () => {
      getBucketMock.mockResolvedValue({ error: { message: "boom" } });
      const warnSpy = jest
        .spyOn(service["logger"], "warn")
        .mockImplementation(() => undefined);
      await service.onModuleInit();
      expect(warnSpy).toHaveBeenCalled();
      expect(createBucketMock).not.toHaveBeenCalled();
    });

    it("does nothing more when the bucket already exists", async () => {
      getBucketMock.mockResolvedValue({ error: null });
      await expect(service.onModuleInit()).resolves.toBeUndefined();
      expect(createBucketMock).not.toHaveBeenCalled();
    });

    it("swallows thrown initialization errors", async () => {
      getBucketMock.mockRejectedValue(new Error("network"));
      const warnSpy = jest
        .spyOn(service["logger"], "warn")
        .mockImplementation(() => undefined);
      await expect(service.onModuleInit()).resolves.toBeUndefined();
      expect(warnSpy).toHaveBeenCalled();
    });
  });
});
