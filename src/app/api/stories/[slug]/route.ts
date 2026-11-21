import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { deleteOwnStory } from "@/lib/actions/stories";
import { rejectCrossSite } from "@/lib/admin-api";
import { getPublishedStoryBySlug } from "@/lib/db/queries/stories";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  const story = await getPublishedStoryBySlug(slug, session?.user.id);
  if (!story) return NextResponse.json({ error: "Story not found." }, { status: 404 });
  return NextResponse.json({ story });
}

/** An author may withdraw a pending or rejected submission (never a published one). */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { slug } = await params;
  const { getStoryRow } = await import("@/lib/db/queries/stories");
  const row = await getStoryRow(slug);
  if (!row) return NextResponse.json({ error: "Story not found." }, { status: 404 });
  const result = await deleteOwnStory(row.id);
  return NextResponse.json(result, { status: result.ok ? 200 : 403 });
}
