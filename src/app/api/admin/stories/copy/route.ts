import { NextResponse } from "next/server";

import { resetStoryCopy, saveStoryCopy } from "@/lib/actions/stories";
import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import { getStoryCopy } from "@/lib/db/queries/stories";
import { storyCopySchema } from "@/lib/story-schema";

export async function GET(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  return NextResponse.json({ content: await getStoryCopy() });
}

export async function PUT(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const parsed = storyCopySchema.safeParse(payload);
  if (!parsed.success) return jsonError("Invalid copy.", 400);
  const result = await saveStoryCopy(parsed.data);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

export async function DELETE(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const result = await resetStoryCopy();
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
