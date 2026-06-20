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
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Register multipart early to handle file uploads.
  // fileSize matches the 5MB cap enforced in the web ImageUpload component;
  // the @fastify/multipart default is only 1MB, which rejects most cover photos.
  await app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  // Enable CORS. The production allowlist is always honoured; localhost origins
  // are only accepted outside of production.
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) {
        callback(null, true);
        return;
      }

      const allowedOrigins = [
        "https://temitope.live",
        "https://www.temitope.live",
      ];

      const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(
        origin,
      );

      if (allowedOrigins.includes(origin) || (!isProduction && isLocalhost)) {
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
  if (!isProduction) {
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
