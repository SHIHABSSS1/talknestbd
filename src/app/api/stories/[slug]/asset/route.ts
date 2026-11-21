import { createReadStream } from "node:fs";
import { Readable } from "node:stream";

import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getStoryRow } from "@/lib/db/queries/stories";
import { resolvePrivateFile } from "@/lib/storage/local";

function parseRange(header: string | null, size: number) {
  if (!header) return null;
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

/**
 * Authorised streaming for private story PDFs and voice recordings.
 * Published assets are public to browse; unpublished ones are visible only to
 * their author or an admin. Files are never exposed under /media.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const story = await getStoryRow(slug);
  if (!story) return new Response("Not found", { status: 404 });

  const kind = new URL(request.url).searchParams.get("kind");
  if (kind !== "pdf" && kind !== "audio") {
    return NextResponse.json({ error: "Unknown asset kind." }, { status: 400 });
  }
  const key = kind === "pdf" ? story.attachmentKey : story.audioKey;
  if (!key) return new Response("Not found", { status: 404 });

  if (story.status !== "published") {
    const session = await auth.api.getSession({ headers: request.headers });
    const allowed =
      session && (session.user.id === story.userId || session.user.role === "admin");
    if (!allowed) return new Response("Not found", { status: 404 });
  }

  const file = await resolvePrivateFile(key);
  if (!file) return new Response("Not found", { status: 404 });

  const filename = (kind === "pdf" ? story.attachmentName : "voice-story") || `story.${key.split(".").pop()}`;
  const safeName = filename.replace(/[\r\n"\\]/g, "_").slice(0, 120);
  const headers: Record<string, string> = {
    "Content-Type": file.contentType,
    "Content-Disposition": `inline; filename="${safeName}"`,
    "Cache-Control": "private, no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
  };

  const range = parseRange(request.headers.get("range"), file.size);
  if (range) {
    const stream = Readable.toWeb(
      createReadStream(file.filePath, { start: range.start, end: range.end }),
    ) as ReadableStream;
    return new Response(stream, {
      status: 206,
      headers: {
        ...headers,
        "Content-Length": String(range.end - range.start + 1),
        "Content-Range": `bytes ${range.start}-${range.end}/${file.size}`,
      },
    });
  }

  const stream = Readable.toWeb(createReadStream(file.filePath)) as ReadableStream;
  return new Response(stream, {
    status: 200,
    headers: { ...headers, "Content-Length": String(file.size) },
  });
}
