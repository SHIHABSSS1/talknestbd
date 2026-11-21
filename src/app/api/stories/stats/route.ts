import { NextResponse, connection } from "next/server";

import { getStoryCounts } from "@/lib/db/queries/stories";

/** Public counts only — no personal data is exposed. */
export async function GET() {
  await connection();
  const counts = await getStoryCounts();
  return NextResponse.json(counts);
}
