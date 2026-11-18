import { createReadStream } from "node:fs";
import { Readable } from "node:stream";

import { resolveMedia } from "@/lib/storage/local";

/**
 * Serves uploaded files from UPLOAD_DIR at /media/*.
 *
 * In development this route is the only way to reach uploads: they deliberately
 * live outside public/, because public/ is copied at build time and runtime
 * writes there are lost on redeploy.
 *
 * In production Nginx should serve /media/ directly (docs/ARCHITECTURE.md
 * §8.4) — it adds Range support and caching headers for free.
 *
 * TODO: implement 206 Partial Content for audio/video once those uploads land.
 * Images never issue Range requests, so this is enough for the hero today.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const media = await resolveMedia(segments ?? []);

  if (!media) {
    return new Response("Not found", { status: 404 });
  }

  const stream = Readable.toWeb(createReadStream(media.filePath)) as ReadableStream;

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": media.contentType,
      "Content-Length": String(media.size),
      // Filenames are content hashes, so the bytes behind a URL never change.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Accept-Ranges": "bytes",
    },
  });
}