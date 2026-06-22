import "./instrument";
import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { MAX_UPLOAD_BYTES } from "@temi/types";
import { AppModule } from "./app.module";
import { isOriginAllowed } from "./config/cors";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Register multipart early to handle file uploads. The shared MAX_UPLOAD_BYTES
  // (from @temi/types) is the single source of truth for the cap across the API
  // and the web ImageUpload component; the @fastify/multipart default is only
  // 1MB, which rejects most cover photos.
  await app.register(multipart, {
    limits: {
      fileSize: MAX_UPLOAD_BYTES,
    },
  });

  // Enable CORS using the shared, env-driven allowlist (CORS_ORIGINS). Requests
  // with no Origin header (curl, mobile apps, server-to-server) are allowed;
  // browser origins must pass the allowlist (localhost only outside production).
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  });

  await app.register(helmet);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Normalized error responses + per-request logging.
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Ensure OnModuleDestroy (Prisma $disconnect) runs on SIGTERM/SIGINT.
  app.enableShutdownHooks();

  // Swagger is only mounted outside of production.
  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("Temi API")
      .setDescription("API documentation")
      .setVersion("1.0.0")
      .addBearerAuth(
        { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        "BearerAuth",
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/api/docs", app, document);
  }

  await app.listen(4000, "0.0.0.0");
}

void bootstrap();
