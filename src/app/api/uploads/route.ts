import { NextResponse } from "next/server";

import { saveImageDataUrl } from "@/lib/storage/local";

/** JSON body ceiling: base64 of a 4 MB image plus envelope. */
const MAX_BODY_BYTES = 6_000_000;

/** Folders the browser is allowed to write into. */
const ALLOWED_FOLDERS = new Set(["hero"]);

/**
 * Local image upload for the admin editors.
 *
 * The browser downscales and re-encodes the file first (src/lib/image.ts), then
 * posts a base64 data URL. The server validates the bytes, writes the file to
 * UPLOAD_DIR and returns a /media URL — the database only ever stores that URL.
 *
 * TODO(auth): this is the one endpoint that must not ship open. Writes are
 * refused in production until `requireAdmin()` exists (Better Auth phase); in
 * development the editor works without a session. Add the session check as the
 * first statement, before the body is read, and delete the NODE_ENV branch.
 * See AGENTS.md and docs/ARCHITECTURE.md §9.1.
 */
function isUploadAllowed(): boolean {
  // Read only to gate the handler — no env value is ever returned to the client.
  return process.env.NODE_ENV !== "production";
}

export async function POST(request: Request) {
  if (!isUploadAllowed()) {
    return NextResponse.json(
      { error: "Uploads are disabled until admin authentication is implemented." },
      { status: 403 },
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Image is too large." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const body = payload as { src?: unknown; folder?: unknown } | null;
  const src = typeof body?.src === "string" ? body.src : "";
  const folder = typeof body?.folder === "string" ? body.folder : "hero";

  if (!src.startsWith("data:image/")) {
    return NextResponse.json({ error: "Expected a base64 image data URL." }, { status: 400 });
  }
  if (!ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Unknown upload folder." }, { status: 400 });
  }

  try {
    const stored = await saveImageDataUrl(src, folder);
    return NextResponse.json(stored, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The image could not be stored.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}