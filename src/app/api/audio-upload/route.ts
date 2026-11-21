import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { saveAudioFile } from "@/lib/storage/local";

const MAX_BYTES = (Number(process.env.MAX_AUDIO_MB || 25) || 25) * 1024 * 1024;

/** Admin-only MP3 upload. Multipart form data keeps large files out of JSON. */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const origin = request.headers.get("origin");
  if (origin) {
    const appOrigin = new URL(
      process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    ).origin;
    if (origin !== appOrigin) {
      return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
    }
  }

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BYTES + 1024 * 1024) {
    return NextResponse.json({ error: "Audio file is too large." }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an MP3 file." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Audio file is too large." }, { status: 413 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const stored = await saveAudioFile(buffer, "audio-book");
    return NextResponse.json(stored, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not store the audio.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
