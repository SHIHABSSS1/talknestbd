import { NextResponse } from "next/server";

import { createQuiz } from "@/lib/actions/video-quiz";
import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import { getAllQuizzes } from "@/lib/db/queries/video-quiz";

export async function GET(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  return NextResponse.json({ quizzes: await getAllQuizzes() });
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
  const result = await createQuiz(payload);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
