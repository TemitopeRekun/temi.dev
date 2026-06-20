import { envValidationOptions, envValidationSchema } from "./env.validation";

const validEnv = {
  JWT_SECRET: "a-very-long-test-secret-value",
  ADMIN_PASSWORD_HASH: "$2a$10$abcdefghijklmnopqrstuv",
  ADMIN_EMAIL: "admin@temi.dev",
  DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
};

describe("envValidationSchema", () => {
  it("accepts a valid environment", () => {
    const { error } = envValidationSchema.validate(validEnv, envValidationOptions);
    expect(error).toBeUndefined();
  });

  it("allows unknown keys", () => {
    const { error } = envValidationSchema.validate(
      { ...validEnv, SOME_EXTRA: "value" },
      envValidationOptions,
    );
    expect(error).toBeUndefined();
  });

  it('rejects the placeholder JWT_SECRET "change_me"', () => {
    const { error } = envValidationSchema.validate(
      { ...validEnv, JWT_SECRET: "change_me" },
      envValidationOptions,
    );
    expect(error).toBeDefined();
  });

  it("rejects a JWT_SECRET shorter than 16 characters", () => {
    const { error } = envValidationSchema.validate(
      { ...validEnv, JWT_SECRET: "short" },
      envValidationOptions,
    );
    expect(error).toBeDefined();
  });

  it("rejects an ADMIN_PASSWORD_HASH that is not a bcrypt hash", () => {
    const { error } = envValidationSchema.validate(
      { ...validEnv, ADMIN_PASSWORD_HASH: "plaintextpassword" },
      envValidationOptions,
    );
    expect(error).toBeDefined();
    expect(error?.message).toContain("bcrypt hash");
  });

  it("rejects an invalid ADMIN_EMAIL", () => {
    const { error } = envValidationSchema.validate(
      { ...validEnv, ADMIN_EMAIL: "not-an-email" },
      envValidationOptions,
    );
    expect(error).toBeDefined();
  });

  it("rejects a missing DATABASE_URL", () => {
    const { DATABASE_URL: _omit, ...rest } = validEnv;
    const { error } = envValidationSchema.validate(rest, envValidationOptions);
    expect(error).toBeDefined();
  });
});
