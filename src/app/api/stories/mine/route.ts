import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { listStories } from "@/lib/db/queries/stories";

/** The signed-in reader's own submissions, newest first. */
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const data = await listStories({
    ownerId: session.user.id,
    viewerId: session.user.id,
    limit: 100,
    offset: 0,
  });
  return NextResponse.json({ stories: data.rows, total: data.total });
}
