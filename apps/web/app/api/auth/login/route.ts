import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiBaseUrl } from "../../../../lib/api";

type LoginBody = {
  email: string;
  password: string;
};

const authResponseSchema = z.object({
  accessToken: z.string().min(1),
});

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

  const parsed = authResponseSchema.safeParse(await res.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid auth response" },
      { status: 500 },
    );
  }

  const c = await cookies();
  const isProd = process.env.NODE_ENV === "production";
  c.set({
    name: "admin_jwt",
    value: parsed.data.accessToken,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    // Match the API's JWT expiry (12h) so the cookie does not outlive the token
    // and leave a stale, unverifiable credential in the browser.
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ ok: true });
}
