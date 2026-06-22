import { NextRequest, NextResponse } from "next/server";
import { forwardToApi } from "../../../../lib/api";
import { revalidateContent, CONTENT_TAG } from "../../../../lib/revalidate";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const res = await forwardToApi({
    method: "POST",
    path: "/api/admin/projects",
    body,
  });
  if (res.ok) revalidateContent(CONTENT_TAG.projects);
  return res;
}
