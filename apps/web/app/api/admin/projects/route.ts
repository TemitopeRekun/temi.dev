import { NextRequest, NextResponse } from "next/server";
import { forwardToApi } from "../../../../lib/api";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  return forwardToApi({ method: "POST", path: "/api/admin/projects", body });
}
