// @vitest-environment node
// auth.ts is server/edge code; jose requires Node's Uint8Array realm (jsdom's
// differs and breaks signing/verification), so this suite runs under node.
import { describe, it, expect, afterEach, vi } from "vitest";
import { SignJWT } from "jose";
import { verifyAdminJwt } from "./auth";

const SECRET = "a-very-long-test-secret-value-1234567890";

async function signToken(opts?: { expiresIn?: string }): Promise<string> {
  const builder = new SignJWT({ sub: "admin", role: "ADMIN" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt();
  if (opts?.expiresIn) builder.setExpirationTime(opts.expiresIn);
  return builder.sign(new TextEncoder().encode(SECRET));
}

describe("verifyAdminJwt", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns false for an empty token", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    expect(await verifyAdminJwt("")).toBe(false);
  });

  it("accepts a valid, correctly-signed token", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    const token = await signToken({ expiresIn: "12h" });
    expect(await verifyAdminJwt(token)).toBe(true);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await new SignJWT({ sub: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .sign(new TextEncoder().encode("a-different-secret-value-09876543210"));
    vi.stubEnv("JWT_SECRET", SECRET);
    expect(await verifyAdminJwt(token)).toBe(false);
  });

  it("rejects an expired token", async () => {
    vi.stubEnv("JWT_SECRET", SECRET);
    const nowSec = Math.floor(Date.now() / 1000);
    const token = await new SignJWT({ sub: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(nowSec - 60 * 60)
      .setExpirationTime(nowSec - 60)
      .sign(new TextEncoder().encode(SECRET));
    expect(await verifyAdminJwt(token)).toBe(false);
  });

  it("fails closed in production when JWT_SECRET is unset", async () => {
    vi.stubEnv("JWT_SECRET", "");
    vi.stubEnv("NODE_ENV", "production");
    // Even a non-empty (forged) cookie value must be rejected.
    expect(await verifyAdminJwt("forged-token")).toBe(false);
  });

  it("falls back to presence check outside production when secret is unset", async () => {
    vi.stubEnv("JWT_SECRET", "");
    vi.stubEnv("NODE_ENV", "development");
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(await verifyAdminJwt("any-non-empty")).toBe(true);
  });
});
