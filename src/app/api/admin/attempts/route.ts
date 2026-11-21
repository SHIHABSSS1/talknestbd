import { NextResponse } from "next/server";

import { getAdminContext } from "@/lib/admin-api";
import { getAllAttempts } from "@/lib/db/queries/video-quiz";

/** Quiz submissions/results table for admins. */
export async function GET(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 20, 1), 100);
  const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);
  const data = await getAllAttempts(limit, offset);
  return NextResponse.json({ ...data, limit, offset });
}
