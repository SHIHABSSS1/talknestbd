import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { toggleDiscussionLike } from "@/lib/actions/video-quiz";
import { rejectCrossSite } from "@/lib/admin-api";
import { idSchema } from "@/lib/video-quiz-schema";

/** Toggle a signed-in reader's like on a comment. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Sign in to like comments." }, { status: 401 });
  const { id } = await params;
  const parsed = idSchema.safeParse({ id });
  if (!parsed.success) return NextResponse.json({ error: "Invalid comment id." }, { status: 400 });
  const result = await toggleDiscussionLike(parsed.data);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
