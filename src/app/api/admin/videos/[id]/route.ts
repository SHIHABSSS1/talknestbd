import { NextResponse } from "next/server";

import { deleteVideo, updateVideo } from "@/lib/actions/video-quiz";
import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import { getAllVideos } from "@/lib/db/queries/video-quiz";
import { idSchema } from "@/lib/video-quiz-schema";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const { id } = await params;
  const video = (await getAllVideos()).find((row) => row.id === id);
  if (!video) return jsonError("Video not found.", 404);
  return NextResponse.json({ video });
}

export async function PATCH(request: Request, { params }: Context) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const { id } = await params;
  if (!idSchema.safeParse({ id }).success) return jsonError("Invalid video id.", 400);
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const result = await updateVideo({ ...(payload as object), id });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

export async function DELETE(request: Request, { params }: Context) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;
  const { id } = await params;
  const result = await deleteVideo({ id });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
