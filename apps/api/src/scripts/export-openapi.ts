import "reflect-metadata";
import { writeFileSync } from "fs";
import { join } from "path";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "../app.module";

/**
 * Writes the OpenAPI spec to apps/api/openapi.json from the same DocumentBuilder
 * config used by the in-app Swagger UI. Runs in Nest **preview mode** so the DI
 * providers are not instantiated (no DB/Supabase connections), making it safe to
 * run in CI or locally without live infrastructure.
 *
 * Usage: `pnpm --filter api openapi:export`
 */
async function exportOpenApi(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { preview: true, logger: false },
  );

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
  const outPath = join(process.cwd(), "openapi.json");
  writeFileSync(outPath, `${JSON.stringify(document, null, 2)}\n`);
  await app.close();

  process.stdout.write(`OpenAPI spec written to ${outPath}\n`);
}

void exportOpenApi();
