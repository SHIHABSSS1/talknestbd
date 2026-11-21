import { NextResponse, connection } from "next/server";

import { getLeaderboard, getQuizBySlug } from "@/lib/db/queries/video-quiz";

/** Best score per reader for one quiz. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await connection();
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 10, 1), 100);
  const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);
  const board = await getLeaderboard({ quizId: quiz.id, limit, offset });
  return NextResponse.json({ ...board, quiz: { id: quiz.id, title: quiz.title, slug: quiz.slug } });
}
