import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminJwt } from "@/lib/auth";
import { isValidSlug, slugify } from "@/lib/slug";

/**
 * Two concerns, matched by prefix — see `config.matcher` below.
 *
 * 1. Legacy slug normalisation on public detail routes. Slugs created before the
 *    API enforced SLUG_PATTERN can contain spaces and capitals, which serve as
 *    percent-encoded URLs. This has to run here rather than in the page: a
 *    redirect thrown from the page body lands after the streamed shell has
 *    flushed, so Next degrades it to a `<meta refresh>` at HTTP 200 instead of a
 *    308. It is a pure string check with no I/O, so a conforming slug — every
 *    normal request — falls through immediately.
 *
 * 2. Defense-in-depth auth gate for the admin area. The NestJS API remains the
 *    authoritative trust boundary; this blocks unauthenticated requests early
 *    and fails closed (see lib/auth.ts: a missing JWT_SECRET in production
 *    denies access rather than degrading to a presence check).
 *    - Pages under /admin (except /admin/login) redirect to /admin/login.
 *    - Requests under /api/admin/* receive a 401 JSON response.
 */

/** Public detail routes whose final path segment is a content slug. */
const SLUG_ROUTES = ["/blog/", "/work/"];

/**
 * A 308 to the normalised slug, or null when the path is not a single-segment
 * detail route or its slug already conforms.
 */
function legacySlugRedirect(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;
  const prefix = SLUG_ROUTES.find((p) => pathname.startsWith(p));
  if (!prefix) return null;

  const segment = pathname.slice(prefix.length);
  // Only the detail route itself. Nested paths (e.g. /blog/<slug>/og) are left
  // alone so their own handlers keep serving them.
  if (segment.length === 0 || segment.includes("/")) return null;

  let slug: string;
  try {
    slug = decodeURIComponent(segment);
  } catch {
    // Malformed percent-encoding — nothing sensible to redirect to.
    return null;
  }

  if (isValidSlug(slug)) return null;

  const normalized = slugify(slug);
  if (!normalized || normalized === slug) return null;

  const url = req.nextUrl.clone();
  url.pathname = `${prefix}${normalized}`;
  // 308 rather than 307: permanent, and it preserves the method.
  return NextResponse.redirect(url, 308);
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  const redirect = legacySlugRedirect(req);
  if (redirect) return redirect;

  const isAdminPage = pathname.startsWith("/admin");
  const isApi = pathname.startsWith("/api/admin");

  // Public content routes are matched only for the slug check above; they must
  // never reach the auth gate.
  if (!isAdminPage && !isApi) {
    return NextResponse.next();
  }

  // The login page must stay reachable without a token.
  if (pathname === "/admin/login") {
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
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/blog/:path*",
    "/work/:path*",
  ],
};
