import { jwtVerify } from "jose";

/**
 * Shared admin-JWT verification used by both the edge middleware and the
 * server-side protected layout, so the trust decision lives in one place.
 *
 * Fail-closed semantics: the token must carry a valid HS256 signature and an
 * unexpired claim set, checked against `JWT_SECRET` (the same secret the API
 * signs with). In production, a missing `JWT_SECRET` denies access — we never
 * trust a token we cannot verify. Outside production, a missing secret falls
 * back to a presence check purely for local-dev convenience.
 */

let warnedAboutMissingSecret = false;

export async function verifyAdminJwt(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      // Fail closed: refuse to authenticate when we cannot verify signatures.
      return false;
    }
    if (!warnedAboutMissingSecret) {
      warnedAboutMissingSecret = true;
      console.warn(
        "[auth] JWT_SECRET is not set — falling back to a cookie-presence check (development only).",
      );
    }
    return token.length > 0;
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}
