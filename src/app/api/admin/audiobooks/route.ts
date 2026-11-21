import { NextResponse } from "next/server";

import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import {
  createAudiobook,
  deleteAudiobook,
  updateAudiobook,
} from "@/lib/actions/audio";
import { getAllAudiobooks } from "@/lib/db/queries/audio";
import { deleteAudiobookSchema } from "@/lib/audio-schema";

export async function GET(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  return NextResponse.json({ audiobooks: await getAllAudiobooks() });
}

export async function POST(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const crossSite = rejectCrossSite(request);
  if (crossSite) return crossSite;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const result = await createAudiobook(payload);
  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}

export async function PATCH(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const crossSite = rejectCrossSite(request);
  if (crossSite) return crossSite;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const parsed = deleteAudiobookSchema.safeParse(payload);
  if (!parsed.success) return jsonError("Invalid audiobook id.", 400);
  const result = await updateAudiobook(payload);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

export async function DELETE(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const crossSite = rejectCrossSite(request);
  if (crossSite) return crossSite;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const parsed = deleteAudiobookSchema.safeParse(payload);
  if (!parsed.success) return jsonError("Invalid audiobook id.", 400);
  const result = await deleteAudiobook(payload);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
