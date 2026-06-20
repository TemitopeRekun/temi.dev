// Server-only helpers: these read request cookies and build NextResponse,
// so they must only be imported from route handlers / server code.
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Resolve the upstream NestJS API base URL. Server-only: prefer the
 * non-public `API_BASE_URL`, fall back to `NEXT_PUBLIC_API_BASE_URL`, then
 * to the local dev default.
 */
export function apiBaseUrl(): string {
  const server = process.env.API_BASE_URL;
  if (server && server.trim().length > 0) return server;
  const pub = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (pub && pub.trim().length > 0) return pub;
  return "http://localhost:4000";
}

type ForwardOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  /** Path beginning with a slash, e.g. "/api/admin/blog". */
  path: string;
  /** Optional JSON body to forward. */
  body?: unknown;
  /** Extra query string (without leading "?"). */
  search?: string;
};

/**
 * Perform an authenticated proxy fetch to the upstream API. Reads the
 * `admin_jwt` cookie and attaches it as a Bearer token. Returns a
 * `NextResponse` mirroring the upstream JSON + status, or a 401/502 on
 * missing auth / network failure.
 */
export async function forwardToApi(
  options: ForwardOptions,
): Promise<NextResponse> {
  const c = await cookies();
  const token = c.get("admin_jwt")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers: Record<string, string> = {
    authorization: `Bearer ${token}`,
  };
  if (options.body !== undefined) {
    headers["content-type"] = "application/json";
  }

  const query = options.search ? `?${options.search}` : "";
  const url = `${apiBaseUrl()}${options.path}${query}`;

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    ...(options.body !== undefined
      ? { body: JSON.stringify(options.body) }
      : {}),
    cache: "no-store",
  }).catch(() => null);

  if (!res || !res.ok) {
    return NextResponse.json(
      { error: "Upstream error" },
      { status: res?.status ?? 502 },
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
