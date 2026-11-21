import { NextResponse } from "next/server";

import { getApiSession, unauthorized } from "@/lib/account-api";
import { getUnlockedAudiobooks } from "@/lib/db/queries/audio";

/** Audiobooks unlocked by the signed-in reader, newest unlock first. */
export async function GET(request: Request) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();
  const rows = await getUnlockedAudiobooks(session.user.id);
  return NextResponse.json({ audiobooks: rows, total: rows.length });
}
