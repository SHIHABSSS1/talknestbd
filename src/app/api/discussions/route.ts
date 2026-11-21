import { NextResponse, connection } from "next/server";

import { auth } from "@/lib/auth";
import { getDiscussions } from "@/lib/db/queries/video-quiz";
import { postDiscussion } from "@/lib/actions/video-quiz";
import { rejectCrossSite } from "@/lib/admin-api";
import { discussionCreateSchema } from "@/lib/video-quiz-schema";

/** Public read of one thread; likes are reader-specific when signed in. */
export async function GET(request: Request) {
  await connection();
  const url = new URL(request.url);
  const target = url.searchParams.get("target");
  const targetId = url.searchParams.get("targetId")?.trim() ?? "";
  if ((target !== "video" && target !== "quiz") || !targetId || targetId.length > 80) {
    return NextResponse.json({ error: "Invalid discussion thread." }, { status: 400 });
  }
  const session = await auth.api.getSession({ headers: request.headers });
  const comments = await getDiscussions(target, targetId, session?.user.id);
  return NextResponse.json({ comments, total: comments.length });
}

/** Signed-in readers can post comments and threaded replies. */
export async function POST(request: Request) {
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Sign in to join the discussion." }, { status: 401 });
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }
  const parsed = discussionCreateSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Invalid comment." }, { status: 400 });
  const result = await postDiscussion(parsed.data);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
