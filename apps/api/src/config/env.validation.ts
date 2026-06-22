import * as Joi from "joi";

/**
 * Joi schema validated at boot via ConfigModule. Requires real secrets so the
 * app refuses to start with the placeholder values shipped in .env.example
 * (e.g. JWT_SECRET="change_me" or an unhashed ADMIN_PASSWORD_HASH).
 *
 * Optional keys are declared (not just allowed via `allowUnknown`) so this file
 * doubles as the authoritative list of every environment variable the API
 * reads — keep it in sync with apps/api/.env.example.
 */
export const envValidationSchema = Joi.object({
  // --- Runtime ---
  NODE_ENV: Joi.string()
    .valid("development", "test", "production")
    .default("development"),
  PORT: Joi.number().optional(),

  // --- Auth (required) ---
  JWT_SECRET: Joi.string().min(16).invalid("change_me").required(),
  ADMIN_PASSWORD_HASH: Joi.string()
    .pattern(/^\$2/)
    .message('ADMIN_PASSWORD_HASH must be a bcrypt hash starting with "$2"')
    .required(),
  ADMIN_EMAIL: Joi.string().email().required(),

  // --- Database (required) ---
  DATABASE_URL: Joi.string().uri().required(),
  // Direct (non-pooled) connection used by `prisma migrate`/introspection.
  DIRECT_URL: Joi.string().uri().optional(),

  // --- CORS ---
  // Comma-separated browser-origin allowlist. Falls back to the canonical
  // production domains when unset (see config/cors.ts).
  CORS_ORIGINS: Joi.string().optional(),

  // --- AI / RAG (optional; features degrade gracefully when absent) ---
  GEMINI_API_KEY: Joi.string().allow("").optional(),
  GEMINI_MODEL: Joi.string().optional(),
  GEMINI_EMBEDDING_MODEL: Joi.string().optional(),
  // Must equal the vector(N) column dimension in the Prisma schema.
  GEMINI_EMBEDDING_DIM: Joi.number().optional(),
  // Cosine-similarity retrieval floor (0–1).
  RAG_SIMILARITY_FLOOR: Joi.number().min(0).max(1).optional(),

  // --- Email (optional) ---
  RESEND_API_KEY: Joi.string().allow("").optional(),
  EMAIL_FROM: Joi.string().optional(),

  // --- Storage (optional) ---
  SUPABASE_URL: Joi.string().allow("").optional(),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string().allow("").optional(),
  SUPABASE_BUCKET: Joi.string().optional(),

  // --- Monitoring (optional) ---
  SENTRY_DSN: Joi.string().allow("").optional(),
});

export const envValidationOptions = {
  allowUnknown: true,
  abortEarly: false,
} as const;
