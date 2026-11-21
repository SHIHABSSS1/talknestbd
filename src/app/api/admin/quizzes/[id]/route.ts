import { NextResponse } from "next/server";

import { deleteQuiz, updateQuiz } from "@/lib/actions/video-quiz";
import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import { getAllQuizzes } from "@/lib/db/queries/video-quiz";
import { idSchema } from "@/lib/video-quiz-schema";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const { id } = await params;
  const quiz = (await getAllQuizzes()).find((row) => row.id === id);
  if (!quiz) return jsonError("Quiz not found.", 404);
  return NextResponse.json({ quiz });
}

export async function PATCH(request: Request, { params }: Context) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const { id } = await params;
  if (!idSchema.safeParse({ id }).success) return jsonError("Invalid quiz id.", 400);
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const result = await updateQuiz({ ...(payload as object), id });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

export async function DELETE(request: Request, { params }: Context) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const { id } = await params;
  const result = await deleteQuiz({ id });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
