import { NextResponse, connection } from "next/server";

import { auth } from "@/lib/auth";
import { submitStory } from "@/lib/actions/stories";
import { rejectCrossSite } from "@/lib/admin-api";
import { listStories } from "@/lib/db/queries/stories";

export async function GET(request: Request) {
  await connection();
  const url = new URL(request.url);
  const session = await auth.api.getSession({ headers: request.headers });
  const type = url.searchParams.get("type");
  const sort = url.searchParams.get("sort");
  const data = await listStories({
    status: "published",
    type: type === "voice" || type === "text" || type === "pdf" ? type : undefined,
    category: url.searchParams.get("category")?.trim() || undefined,
    q: url.searchParams.get("q")?.trim() || "",
    sort: sort === "popular" || sort === "oldest" ? sort : "latest",
    limit: Math.min(Math.max(Number(url.searchParams.get("limit")) || 12, 1), 50),
    offset: Math.max(Number(url.searchParams.get("offset")) || 0, 0),
    viewerId: session?.user.id,
  });
  return NextResponse.json({
    stories: data.rows,
    rows: data.rows,
    total: data.total,
    limit: Number(url.searchParams.get("limit")) || 12,
  });
}

/** Signed-in readers submit a story for editorial review. */
export async function POST(request: Request) {
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Sign in to share a story." }, { status: 401 });
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }
  const result = await submitStory(payload);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
