import { NextResponse } from "next/server";
import { forwardToApi } from "../../../../../lib/api";

export async function GET(): Promise<NextResponse> {
  return forwardToApi({ method: "GET", path: "/api/admin/blog/list" });
}
