import { NextResponse, connection } from "next/server";

import { auth } from "@/lib/auth";
import { getAllVideos, getPublishedVideos } from "@/lib/db/queries/video-quiz";

/** Public episode catalogue. Admins can pass ?all=1 to include drafts. */
export async function GET(request: Request) {
  await connection();
  const url = new URL(request.url);
  const session = await auth.api.getSession({ headers: request.headers });
  const includeAll = url.searchParams.get("all") === "1" && session?.user.role === "admin";
  let rows = includeAll ? await getAllVideos() : await getPublishedVideos();

  const q = url.searchParams.get("q")?.trim().toLowerCase() || "";
  const category = url.searchParams.get("category")?.trim();
  const featured = url.searchParams.get("featured") === "1";
  if (q) {
    rows = rows.filter(
      (row) =>
        row.title.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q) ||
        row.host.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q),
    );
  }
  if (category) rows = rows.filter((row) => row.category === category);
  if (featured) rows = rows.filter((row) => row.featured);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || rows.length, 1), 100);

  return NextResponse.json({
    videos: rows.slice(0, limit),
    categories: Array.from(new Set(rows.map((row) => row.category))).sort(),
    total: rows.length,
  });
}
