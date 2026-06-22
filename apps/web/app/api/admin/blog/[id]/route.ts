import { NextRequest, NextResponse } from "next/server";
import { forwardToApi } from "../../../../../lib/api";
import { revalidateContent, CONTENT_TAG } from "../../../../../lib/revalidate";

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
  const res = await forwardToApi({
    method: "PATCH",
    path: `/api/admin/blog/${id}`,
    body,
  });
  if (res.ok) revalidateContent(CONTENT_TAG.posts);
  return res;
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const res = await forwardToApi({
    method: "DELETE",
    path: `/api/admin/blog/${id}`,
  });
  if (res.ok) revalidateContent(CONTENT_TAG.posts);
  return res;
}
