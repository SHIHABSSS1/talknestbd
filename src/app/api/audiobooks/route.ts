import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getAllAudiobooks, getPublishedAudiobooks } from "@/lib/db/queries/audio";

/** Public audiobook catalogue. Admins (or ?all=1 with session) see drafts too. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const session = await auth.api.getSession({ headers: request.headers });
  const includeAll =
    url.searchParams.get("all") === "true" && session?.user.role === "admin";
  const rows = includeAll ? await getAllAudiobooks() : await getPublishedAudiobooks();
  const q = url.searchParams.get("q")?.trim().toLowerCase() || "";
  const filtered = q
    ? rows.filter(
        (row) =>
          row.title.toLowerCase().includes(q) ||
          row.author.toLowerCase().includes(q) ||
          row.narrator.toLowerCase().includes(q),
      )
    : rows;
  return NextResponse.json({ audiobooks: filtered, total: filtered.length });
}
