import { NextResponse, connection } from "next/server";

import { getVideoBySlug } from "@/lib/db/queries/video-quiz";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await connection();
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) return NextResponse.json({ error: "Video not found." }, { status: 404 });
  return NextResponse.json({ video });
}
