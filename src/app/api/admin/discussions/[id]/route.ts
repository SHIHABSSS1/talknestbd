import { NextResponse } from "next/server";

import { deleteDiscussion, moderateDiscussion } from "@/lib/actions/video-quiz";
import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import { discussionModerateSchema } from "@/lib/video-quiz-schema";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const { id } = await params;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const parsed = discussionModerateSchema.safeParse({ ...(payload as object), id });
  if (!parsed.success) return jsonError("Invalid update.", 400);
  const result = await moderateDiscussion(parsed.data);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

export async function DELETE(request: Request, { params }: Context) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const { id } = await params;
  const result = await deleteDiscussion({ id });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
