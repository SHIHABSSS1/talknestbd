import { NextResponse, connection } from "next/server";

import { getLeaderboard } from "@/lib/db/queries/video-quiz";

/** Overall leaderboard, or one quiz's board when ?quizId is supplied. */
export async function GET(request: Request) {
  await connection();
  const url = new URL(request.url);
  const quizId = url.searchParams.get("quizId")?.trim() || undefined;
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 10, 1), 100);
  const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);
  const board = await getLeaderboard({ quizId, limit, offset });
  return NextResponse.json({ ...board, quizId: quizId ?? null });
}
