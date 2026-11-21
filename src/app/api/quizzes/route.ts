import { NextResponse, connection } from "next/server";

import { getPublishedQuizzes } from "@/lib/db/queries/video-quiz";

/** Published quizzes with their questions, optionally filtered by type. */
export async function GET(request: Request) {
  await connection();
  const url = new URL(request.url);
  let rows = await getPublishedQuizzes();
  const type = url.searchParams.get("type");
  if (type === "book" || type === "watch" || type === "general") {
    rows = rows.filter((row) => row.type === type);
  }
  const q = url.searchParams.get("q")?.trim().toLowerCase() || "";
  if (q) {
    rows = rows.filter(
      (row) =>
        row.title.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q),
    );
  }
  return NextResponse.json({
    quizzes: rows,
    categories: Array.from(new Set(rows.map((row) => row.category))).sort(),
    total: rows.length,
  });
}
