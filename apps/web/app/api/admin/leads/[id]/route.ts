import { NextRequest, NextResponse } from "next/server";
import { forwardToApi } from "../../../../../lib/api";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  return forwardToApi({ method: "GET", path: `/api/admin/leads/${id}` });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { id } = await params;
  return forwardToApi({
    method: "PATCH",
    path: `/api/admin/leads/${id}`,
    body,
  });
}
