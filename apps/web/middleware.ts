import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Defense-in-depth auth gate for the admin area. The NestJS API remains the
 * authoritative trust boundary — this middleware simply blocks obviously
 * unauthenticated requests early.
 *
 * - Pages under /admin (except /admin/login) redirect to /admin/login.
 * - Requests under /api/admin/* receive a 401 JSON response.
 * - When JWT_SECRET is set, the cookie signature + expiry are verified with
 *   HS256. When it is not set, we fall back to a presence check (dev only).
 */

let warnedAboutMissingSecret = false;

async function isTokenValid(token: string): Promise<boolean> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (!warnedAboutMissingSecret) {
      warnedAboutMissingSecret = true;
      console.warn(
        "[middleware] JWT_SECRET is not set — falling back to cookie-presence check only. Do not rely on this in production.",
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

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/admin");
  const isLogin = pathname === "/admin/login";

  // The login page must stay reachable without a token.
  if (isLogin) {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_jwt")?.value ?? "";
  const valid = token.length > 0 && (await isTokenValid(token));

  if (valid) {
    return NextResponse.next();
  }

  if (isApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
