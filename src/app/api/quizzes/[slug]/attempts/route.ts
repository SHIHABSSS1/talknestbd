import { NextResponse } from "next/server";

import { submitQuizAttempt } from "@/lib/actions/video-quiz";
import { getQuizBySlug } from "@/lib/db/queries/video-quiz";
import { rejectCrossSite } from "@/lib/admin-api";
import { quizAttemptSchema } from "@/lib/video-quiz-schema";

/** Submit answers to a published quiz. The server recomputes the score. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }
  const parsed = quizAttemptSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid answers." }, { status: 400 });
  }
  const result = await submitQuizAttempt(quiz.id, parsed.data);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
