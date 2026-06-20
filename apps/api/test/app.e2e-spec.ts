import "reflect-metadata";

// Satisfy the boot-time Joi env validation in AppModule without a real DB.
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "a-very-long-test-secret-value";
process.env.ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ?? "$2a$10$abcdefghijklmnopqrstuv";
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@temi.dev";
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://user:pass@localhost:5432/db";

import { ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { AuthService } from "../src/modules/auth/auth.service";
import { AiService } from "../src/modules/ai/ai.service";

describe("App (e2e)", () => {
  let app: NestFastifyApplication;

  // No real DB: $queryRaw resolves so /health is ok; everything else is mocked.
  const prismaMock = {
    $queryRaw: jest.fn().mockResolvedValue([{ result: 1 }]),
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    onModuleInit: jest.fn().mockResolvedValue(undefined),
    onModuleDestroy: jest.fn().mockResolvedValue(undefined),
  };

  const authMock = {
    login: jest.fn().mockResolvedValue({ accessToken: "e2e.jwt.token" }),
    changePassword: jest.fn().mockResolvedValue(undefined),
  };

  const aiMock = {
    generateEmbedding: jest.fn().mockResolvedValue([]),
    semanticSearch: jest.fn().mockResolvedValue([]),
    generateDigitalBrainResponse: jest.fn().mockResolvedValue("answer"),
    generateCompletion: jest.fn().mockResolvedValue("answer"),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .overrideProvider(AuthService)
      .useValue(authMock)
      .overrideProvider(AiService)
      .useValue(aiMock)
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /health returns 200 ok", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });

  it("POST /api/auth/login returns an access token", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { email: "admin@temi.dev", password: "correct-password" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ accessToken: "e2e.jwt.token" });
  });

  it("GET /api/admin/dashboard/stats returns 401 without a token", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/admin/dashboard/stats",
    });
    expect(res.statusCode).toBe(401);
  });

  it("POST /api/rag/ask-website rejects an oversized question with 400", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/rag/ask-website",
      payload: { question: "x".repeat(2001) },
    });
    expect(res.statusCode).toBe(400);
  });
});
