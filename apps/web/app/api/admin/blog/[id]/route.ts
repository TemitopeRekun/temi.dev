import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function apiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (
    env && env.trim().length > 0 ? env : "http://localhost:4000"
  ) as string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const c = await cookies();
  const token = c.get("admin_jwt")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { id } = await params;
  const res = await fetch(`${apiBaseUrl()}/api/admin/blog/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
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

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const c = await cookies();
  const token = c.get("admin_jwt")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const res = await fetch(`${apiBaseUrl()}/api/admin/blog/${id}`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${token}` },
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
