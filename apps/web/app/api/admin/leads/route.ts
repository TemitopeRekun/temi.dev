import { NextRequest, NextResponse } from "next/server";
import { forwardToApi } from "../../../../lib/api";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const take = url.searchParams.get("take");
  const cursor = url.searchParams.get("cursor");
  const status = url.searchParams.get("status");
  const qs = new URLSearchParams();
  if (take) qs.set("take", take);
  if (cursor) qs.set("cursor", cursor);
  if (status) qs.set("status", status);
  return forwardToApi({
    method: "GET",
    path: "/api/admin/leads",
    search: qs.toString(),
  });
}
