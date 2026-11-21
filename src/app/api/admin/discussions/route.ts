import { NextResponse } from "next/server";

import { replyToDiscussion } from "@/lib/actions/video-quiz";
import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import { getAllDiscussions } from "@/lib/db/queries/video-quiz";
import { adminReplySchema } from "@/lib/video-quiz-schema";

export async function GET(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 20, 1), 100);
  const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);
  const data = await getAllDiscussions({
    target: url.searchParams.get("target") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    q: url.searchParams.get("q")?.trim() ?? "",
    limit,
    offset,
  });
  return NextResponse.json({ ...data, limit, offset });
}

/** Admin reply — isAdmin is set by the server, never by the request body. */
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
  const parsed = adminReplySchema.safeParse(payload);
  if (!parsed.success) return jsonError("Invalid reply.", 400);
  const result = await replyToDiscussion(parsed.data);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
