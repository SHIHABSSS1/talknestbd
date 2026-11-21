import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { toggleStoryLike } from "@/lib/actions/stories";
import { rejectCrossSite } from "@/lib/admin-api";
import { getStoryRow } from "@/lib/db/queries/stories";

/** Toggle a signed-in reader's like. Duplicate likes are rejected server-side. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Sign in to like stories." }, { status: 401 });
  const { slug } = await params;
  const row = await getStoryRow(slug);
  if (!row || row.status !== "published") {
    return NextResponse.json({ error: "Story not available." }, { status: 404 });
  }
  const result = await toggleStoryLike(row.id);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
