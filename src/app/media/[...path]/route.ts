import { createReadStream } from "node:fs";
import { Readable } from "node:stream";

import { resolveMedia } from "@/lib/storage/local";

/** Parses a single-range header. Returns null for invalid/multi ranges. */
function parseRange(header: string, size: number): { start: number; end: number } | null {
  const match = header.trim().match(/^bytes=(\d*)-(\d*)$/);
  if (!match) return null;
  const [, startText, endText] = match;
  if (!startText && !endText) return null;
  let start = startText ? Number(startText) : Math.max(0, size - Number(endText));
  let end = endText && startText ? Number(endText) : size - 1;
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  start = Math.max(0, Math.min(start, size - 1));
  end = Math.max(start, Math.min(end, size - 1));
  return { start, end };
}

/** Serves uploaded files from UPLOAD_DIR at /media/*, with HTTP Range support. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const media = await resolveMedia(segments ?? []);
  if (!media) return new Response("Not found", { status: 404 });

  const baseHeaders: Record<string, string> = {
    "Content-Type": media.contentType,
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
  };

  const range = request.headers.get("range");
  if (range && media.size > 0) {
    const parsed = parseRange(range, media.size);
    if (parsed) {
      const { start, end } = parsed;
      const stream = Readable.toWeb(
        createReadStream(media.filePath, { start, end }),
      ) as ReadableStream;
      return new Response(stream, {
        status: 206,
        headers: {
          ...baseHeaders,
          "Content-Length": String(end - start + 1),
          "Content-Range": `bytes ${start}-${end}/${media.size}`,
        },
      });
    }
  }

  const stream = Readable.toWeb(createReadStream(media.filePath)) as ReadableStream;
  return new Response(stream, {
    status: 200,
    headers: { ...baseHeaders, "Content-Length": String(media.size) },
  });
}
