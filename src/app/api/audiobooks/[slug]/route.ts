import { NextResponse } from "next/server";

import { getAudiobookBySlug } from "@/lib/db/queries/audio";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const book = await getAudiobookBySlug(slug);
  if (!book) {
    return NextResponse.json({ error: "Audiobook not found." }, { status: 404 });
  }
  return NextResponse.json({ audiobook: book });
}
