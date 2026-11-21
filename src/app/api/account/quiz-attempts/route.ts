import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getAttemptsForUser } from "@/lib/db/queries/video-quiz";

/** Signed-in reader's quiz history. */
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const attempts = await getAttemptsForUser(session.user.id);
  return NextResponse.json({ attempts, total: attempts.length });
}
