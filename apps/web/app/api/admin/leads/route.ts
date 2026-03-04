import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function apiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (env && env.trim().length > 0 ? env : "http://localhost:4000") as string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const c = await cookies();
  const token = c.get("admin_jwt")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const take = url.searchParams.get("take");
  const cursor = url.searchParams.get("cursor");
  const status = url.searchParams.get("status");
  const qs = new URLSearchParams();
  if (take) qs.set("take", take);
  if (cursor) qs.set("cursor", cursor);
  if (status) qs.set("status", status);
  const res = await fetch(`${apiBaseUrl()}/api/admin/leads?${qs.toString()}`, {
    cache: "no-store",
    headers: { authorization: `Bearer ${token}` },
  }).catch(() => null);
  if (!res || !res.ok) {
    return NextResponse.json({ error: "Upstream error" }, { status: res?.status ?? 502 });
  }
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
