import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type LoginBody = {
  email: string;
  password: string;
};

function apiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;
  return (
    env && env.trim().length > 0 ? env : "http://localhost:4000"
  ) as string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: LoginBody;
  try {
    body = (await req.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  const url = `${apiBaseUrl()}/api/auth/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ email: body.email, password: body.password }),
    cache: "no-store",
  }).catch(() => null);

  if (!res || !res.ok) {
    const status = res?.status ?? 502;
    return NextResponse.json({ error: "Login failed" }, { status });
  }
  const data = (await res.json()) as { accessToken: string };
  if (!data?.accessToken) {
    return NextResponse.json(
      { error: "Invalid auth response" },
      { status: 500 },
    );
  }

  const c = await cookies();
  const isProd = process.env.NODE_ENV === "production";
  c.set({
    name: "admin_jwt",
    value: data.accessToken,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
