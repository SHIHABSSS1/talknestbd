import { NextResponse } from "next/server";

import { createStoryAdmin } from "@/lib/actions/stories";
import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import { listStories } from "@/lib/db/queries/stories";

/** All submissions and stories with search, filters and pagination. */
export async function GET(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const type = url.searchParams.get("type");
  const category = url.searchParams.get("category");
  const sort = url.searchParams.get("sort");
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 20, 1), 100);
  const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);
  const data = await listStories({
    status: status === "published" || status === "pending" || status === "rejected" || status === "draft" ? status : undefined,
    type: type === "voice" || type === "text" || type === "pdf" ? type : undefined,
    category: category?.trim() || undefined,
    q: url.searchParams.get("q")?.trim() || "",
    sort: sort === "oldest" ? "oldest" : sort === "popular" ? "popular" : "latest",
    limit,
    offset,
  });
  return NextResponse.json({ ...data, limit, offset });
}

export async function POST(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const result = await createStoryAdmin(payload);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
