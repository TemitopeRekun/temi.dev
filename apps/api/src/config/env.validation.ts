import * as Joi from "joi";

/**
 * Joi schema validated at boot via ConfigModule. Requires real secrets so the
 * app refuses to start with the placeholder values shipped in .env.example
 * (e.g. JWT_SECRET="change_me" or an unhashed ADMIN_PASSWORD_HASH).
 */
export const envValidationSchema = Joi.object({
  JWT_SECRET: Joi.string().min(16).invalid("change_me").required(),
  ADMIN_PASSWORD_HASH: Joi.string()
    .pattern(/^\$2/)
    .message('ADMIN_PASSWORD_HASH must be a bcrypt hash starting with "$2"')
    .required(),
  ADMIN_EMAIL: Joi.string().email().required(),
  DATABASE_URL: Joi.string().uri().required(),
});

export const envValidationOptions = {
  allowUnknown: true,
  abortEarly: false,
} as const;
