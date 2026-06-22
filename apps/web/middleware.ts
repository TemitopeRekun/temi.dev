import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminJwt } from "@/lib/auth";

/**
 * Defense-in-depth auth gate for the admin area. The NestJS API remains the
 * authoritative trust boundary — this middleware blocks unauthenticated
 * requests early and fails closed (see lib/auth.ts: a missing JWT_SECRET in
 * production denies access rather than degrading to a presence check).
 *
 * - Pages under /admin (except /admin/login) redirect to /admin/login.
 * - Requests under /api/admin/* receive a 401 JSON response.
 */

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/admin");
  const isLogin = pathname === "/admin/login";

  // The login page must stay reachable without a token.
  if (isLogin) {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_jwt")?.value ?? "";
  const valid = await verifyAdminJwt(token);

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
