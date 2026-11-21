import { NextResponse } from "next/server";

import { deleteStoryAdmin, updateStoryAdmin } from "@/lib/actions/stories";
import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import { getStoryRowById } from "@/lib/db/queries/stories";
import { toStoryView } from "@/lib/story-api";
import { idSchema } from "@/lib/story-schema";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const { id } = await params;
  const row = await getStoryRowById(id);
  if (!row) return jsonError("Story not found.", 404);
  return NextResponse.json({ story: toStoryView(row) });
}

export async function PATCH(request: Request, { params }: Context) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const { id } = await params;
  if (!idSchema.safeParse({ id }).success) return jsonError("Invalid story id.", 400);
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const result = await updateStoryAdmin({ ...(payload as object), id });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

export async function DELETE(request: Request, { params }: Context) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const { id } = await params;
  const result = await deleteStoryAdmin({ id });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
