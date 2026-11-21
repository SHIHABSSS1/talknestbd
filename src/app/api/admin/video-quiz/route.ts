import { NextResponse } from "next/server";

import { resetVideoQuizCopy, saveVideoQuizCopy } from "@/lib/actions/video-quiz";
import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import { getVideoQuizCopy } from "@/lib/db/queries/video-quiz";
import { videoQuizCopySchema } from "@/lib/video-quiz-schema";

/** Admin API for the three copy tabs (catalogue items have their own APIs). */
export async function GET(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  return NextResponse.json({ content: await getVideoQuizCopy() });
}

export async function PUT(request: Request) {
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
  const parsed = videoQuizCopySchema.safeParse(payload);
  if (!parsed.success) return jsonError("Invalid copy.", 400);
  const result = await saveVideoQuizCopy(parsed.data);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

export async function DELETE(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const result = await resetVideoQuizCopy();
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
