import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { saveImageDataUrl } from "@/lib/storage/local";

/** JSON body ceiling: base64 of a 4 MB image plus envelope. */
const MAX_BODY_BYTES = 6_000_000;

/** Folders the browser is allowed to write into. */
const ALLOWED_FOLDERS = new Set([
  "hero",
  "avatars",
  "trust-strip",
  "categories",
  "books",
  "authors",
  "publishers",
]);

/**
 * Local image upload for the admin editors.
 *
 * The browser downscales and re-encodes the file first (src/lib/image.ts), then
 * posts a base64 data URL. The server validates the bytes, writes the file to
 * UPLOAD_DIR and returns a /media URL — the database only ever stores that URL.
 *
 * Requires a real Better Auth admin session. The check runs before the body is
 * read, so an anonymous caller cannot make the server buffer an image.
 */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  // Cookie-authenticated write endpoint: reject cross-site POSTs explicitly.
  const origin = request.headers.get("origin");
  if (origin) {
    const appOrigin = new URL(
      process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    ).origin;
    if (origin !== appOrigin) {
      return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
    }
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