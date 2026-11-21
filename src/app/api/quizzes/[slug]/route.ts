import { NextResponse, connection } from "next/server";

import { getQuizBySlug } from "@/lib/db/queries/video-quiz";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await connection();
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  return NextResponse.json({ quiz });
}
