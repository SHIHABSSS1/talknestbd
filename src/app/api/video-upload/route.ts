import { NextResponse } from "next/server";

import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import { saveVideoStream } from "@/lib/storage/local";

const MAX_BYTES = (Number(process.env.MAX_VIDEO_MB || 200) || 200) * 1024 * 1024;

/**
 * Admin-only video upload. The request body is streamed to disk; it is never
 * parsed with formData() (which would buffer the entire file in memory).
 * Send the raw file with Content-Type: video/mp4 or video/webm.
 */
export async function POST(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BYTES + 1024 * 1024) {
    return jsonError("Video file is too large.", 413);
  }
  if (!request.body) return jsonError("Choose a video file.", 400);

  try {
    const stored = await saveVideoStream(request.body, declared);
    return NextResponse.json(stored, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not store the video.";
    return jsonError(message, /larger than/i.test(message) ? 413 : 400);
  }
}
