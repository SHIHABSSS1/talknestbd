import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { badRequest, getApiSession, unauthorized } from "@/lib/account-api";
import { db } from "@/lib/db";
import { audioUnlocks } from "@/lib/db/schema";

export async function GET(request: Request) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();

  const rows = await db
    .select({ slug: audioUnlocks.slug })
    .from(audioUnlocks)
    .where(eq(audioUnlocks.userId, session.user.id))
    .orderBy(desc(audioUnlocks.unlockedAt));

  return NextResponse.json(rows.map((row) => row.slug));
}

export async function POST(request: Request) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("Expected a JSON body.");
  }
  const parsed = z.object({ slug: z.string().trim().min(1).max(120) }).safeParse(payload);
  if (!parsed.success) return badRequest("Invalid audio slug.");

  await db
    .insert(audioUnlocks)
    .values({ userId: session.user.id, slug: parsed.data.slug })
    .onConflictDoNothing();

  return NextResponse.json({ ok: true }, { status: 201 });
}
