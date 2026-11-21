import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { rejectCrossSite } from "@/lib/admin-api";
import { saveImageDataUrl, savePrivateFile } from "@/lib/storage/local";

const MAX_PDF = 15 * 1024 * 1024;
const MAX_AUDIO = 25 * 1024 * 1024;
const MAX_IMAGE_BODY = 6_000_000;

function audioExtension(bytes: Buffer): "webm" | "mp3" | "m4a" | null {
  if (bytes.length >= 4 && bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) {
    return "webm";
  }
  if (bytes.length >= 3 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return "mp3";
  if (bytes.length >= 2 && bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) return "mp3";
  if (bytes.length >= 8 && bytes.toString("ascii", 4, 8) === "ftyp") return "m4a";
  return null;
}

/**
 * Signed-in story assets. Images are stored as compressed data URLs (like the
 * other editors); PDFs and recordings are streamed as raw request bodies into
 * the private media tree and are never assigned a public URL.
 */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Sign in to upload story files." }, { status: 401 });
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;

  const kind = new URL(request.url).searchParams.get("kind");

  if (kind === "image") {
    const declared = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(declared) && declared > MAX_IMAGE_BODY) {
      return NextResponse.json({ error: "Image is too large." }, { status: 413 });
    }
    let payload: { src?: unknown } | null = null;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
    }
    try {
      const stored = await saveImageDataUrl(String(payload?.src ?? ""), "stories");
      return NextResponse.json(stored, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Could not store the image." },
        { status: 400 },
      );
    }
  }

  if (kind !== "pdf" && kind !== "audio") {
    return NextResponse.json({ error: "Unknown upload kind." }, { status: 400 });
  }

  const limit = kind === "pdf" ? MAX_PDF : MAX_AUDIO;
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > limit + 1024 * 1024) {
    return NextResponse.json({ error: "File is too large." }, { status: 413 });
  }
  if (!request.body) return NextResponse.json({ error: "No file received." }, { status: 400 });

  try {
    const data = Buffer.from(await request.arrayBuffer());
    if (data.length > limit) return NextResponse.json({ error: "File is too large." }, { status: 413 });
    if (data.length === 0) return NextResponse.json({ error: "That file is empty." }, { status: 400 });

    if (kind === "pdf") {
      if (data.subarray(0, 5).toString("ascii") !== "%PDF-") {
        return NextResponse.json({ error: "Only valid PDF files are accepted." }, { status: 400 });
      }
      const stored = await savePrivateFile(data, "pdf");
      return NextResponse.json(stored, { status: 201 });
    }

    const extension = audioExtension(data);
    if (!extension) {
      return NextResponse.json(
        { error: "Only WebM, MP3 or M4A audio is accepted." },
        { status: 400 },
      );
    }
    const stored = await savePrivateFile(data, extension);
    return NextResponse.json(stored, { status: 201 });
  } catch (error) {
    console.error("[stories] upload failed:", error);
    return NextResponse.json({ error: "Could not store the file." }, { status: 500 });
  }
}
