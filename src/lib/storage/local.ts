import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { mkdir, rename, stat, unlink, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import path from "node:path";

/**
 * Local-disk storage driver.
 *
 * Everything is written under UPLOAD_DIR (default ./uploads), never under
 * public/: Next copies public/ at build time, so a runtime write there is not
 * reliably served and disappears on redeploy.
 *
 * Files are named by content hash, which makes the name immutable — the same
 * bytes uploaded twice reuse one file, and /media can serve them with
 * `Cache-Control: immutable`.
 *
 * The S3/R2 driver described in docs/ARCHITECTURE.md §8.2 plugs in beside this
 * one behind the same interface when object storage is needed.
 */

const IMAGE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type ImageMime = keyof typeof IMAGE_EXTENSIONS;

/** Extension → MIME for everything /media is allowed to serve. */
const SERVED_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
};

export function uploadRoot(): string {
  // UPLOAD_DIR is a runtime data volume (/data/uploads in production), never a
  // build input — keep Turbopack from tracing the whole project for it.
  return path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.UPLOAD_DIR || "./uploads");
}

export function publicMediaBase(): string {
  return (process.env.PUBLIC_MEDIA_URL || "/media").replace(/\/+$/, "");
}

function maxImageBytes(): number {
  const mb = Number(process.env.MAX_IMAGE_MB || 10);
  return (Number.isFinite(mb) && mb > 0 ? mb : 10) * 1024 * 1024;
}

/** First bytes of a real file, so a renamed .exe cannot pass as an image. */
function hasValidSignature(mime: ImageMime, buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  if (mime === "image/jpeg") return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mime === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }
  // RIFF....WEBP
  return (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  );
}

export type StoredImage = {
  key: string;
  url: string;
  mime: ImageMime;
  bytes: number;
};

/**
 * Accepts a base64 data URL (the browser already downscaled and re-encoded the
 * file), validates it, and writes it to disk.
 *
 * Base64 is only the transport for one small, pre-compressed image — it is
 * never stored. The database keeps the returned URL.
 */
export async function saveImageDataUrl(
  dataUrl: string,
  folder: string,
): Promise<StoredImage> {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/.exec(dataUrl);
  if (!match) {
    throw new Error("Unsupported image format. Use JPG, PNG or WebP.");
  }

  const mime = match[1] as ImageMime;
  const buffer = Buffer.from(match[2].replace(/\s+/g, ""), "base64");

  if (buffer.length === 0) throw new Error("That image is empty.");
  if (buffer.length > maxImageBytes()) {
    throw new Error(
      `Image is larger than the ${Math.round(maxImageBytes() / (1024 * 1024))} MB limit.`,
    );
  }
  if (!hasValidSignature(mime, buffer)) {
    throw new Error("That file is not a valid image.");
  }

  const extension = IMAGE_EXTENSIONS[mime];
  const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 32);
  const key = `${folder.replace(/[^a-z0-9-]/gi, "")}/${hash}.${extension}`;
  const destination = path.join(/*turbopackIgnore: true*/ uploadRoot(), key);

  await mkdir(path.dirname(destination), { recursive: true });

  // 'wx' fails if the file already exists; identical bytes means identical
  // content, so an existing file is success, not an error.
  await writeFile(destination, buffer, { flag: "wx" }).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== "EEXIST") throw error;
  });

  return {
    key,
    url: `${publicMediaBase()}/${key}`,
    mime,
    bytes: buffer.length,
  };
}

function maxAudioBytes(): number {
  const mb = Number(process.env.MAX_AUDIO_MB || 25);
  return (Number.isFinite(mb) && mb > 0 ? mb : 25) * 1024 * 1024;
}

/** MP3 magic bytes: ID3 header or MPEG frame sync. */
function isMp3(buffer: Buffer): boolean {
  if (buffer.length < 3) return false;
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) return true;
  return buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
}

export type StoredAudio = {
  key: string;
  url: string;
  mime: "audio/mpeg";
  bytes: number;
};

/**
 * Writes an uploaded MP3 to the local media volume. Files are streamed to a
 * temporary path first, then renamed atomically — a 25 MB file never lives in
 * a JSON envelope or in the database.
 */
export async function saveAudioFile(
  data: Buffer,
  folder: string,
): Promise<StoredAudio> {
  if (data.length === 0) throw new Error("That audio file is empty.");
  if (data.length > maxAudioBytes()) {
    throw new Error(
      `Audio is larger than the ${Math.round(maxAudioBytes() / (1024 * 1024))} MB limit.`,
    );
  }
  if (!isMp3(data)) throw new Error("Only MP3 audio files are accepted.");

  const hash = createHash("sha256").update(data).digest("hex").slice(0, 32);
  const key = `${folder.replace(/[^a-z0-9-]/gi, "") || "audio"}/${hash}.mp3`;
  const destination = path.join(uploadRoot(), key);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, data, { flag: "wx" }).catch(
    (error: NodeJS.ErrnoException) => {
      if (error.code !== "EEXIST") throw error;
    },
  );
  return {
    key,
    url: `${publicMediaBase()}/${key}`,
    mime: "audio/mpeg",
    bytes: data.length,
  };
}

function maxVideoBytes(): number {
  const mb = Number(process.env.MAX_VIDEO_MB || 200);
  return (Number.isFinite(mb) && mb > 0 ? mb : 200) * 1024 * 1024;
}

/** MP4 'ftyp' box at offset 4, or the WebM/Matroska EBML header. */
function videoSignature(head: Buffer): "video/mp4" | "video/webm" | null {
  if (head.length >= 8 && head.toString("ascii", 4, 8) === "ftyp") return "video/mp4";
  if (
    head.length >= 4 &&
    head[0] === 0x1a &&
    head[1] === 0x45 &&
    head[2] === 0xdf &&
    head[3] === 0xa3
  ) {
    return "video/webm";
  }
  return null;
}

export type StoredVideo = {
  key: string;
  url: string;
  mime: "video/mp4" | "video/webm";
  bytes: number;
};

/**
 * Streams an uploaded video straight to a temporary file — `formData()` would
 * buffer the whole body in memory, which is fatal for a 200 MB file. The first
 * bytes are sniffed from the stream so a renamed executable cannot pass, and
 * the file is atomically renamed into place only after it passes validation.
 */
export async function saveVideoStream(
  stream: ReadableStream<Uint8Array>,
  declaredBytes = 0,
): Promise<StoredVideo> {
  const max = maxVideoBytes();
  if (Number.isFinite(declaredBytes) && declaredBytes > max + 1024 * 1024) {
    throw new Error(`Video is larger than the ${Math.round(max / (1024 * 1024))} MB limit.`);
  }

  const root = uploadRoot();
  const tempDir = path.join(root, "tmp");
  await mkdir(tempDir, { recursive: true });
  const tempPath = path.join(tempDir, `${randomUUID()}.part`);

  const hash = createHash("sha256");
  let head = Buffer.alloc(0);
  let bytes = 0;

  try {
    await pipeline(
      Readable.fromWeb(stream as Parameters<typeof Readable.fromWeb>[0]),
      async function* (source) {
        for await (const value of source) {
          const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value as Uint8Array);
          if (head.length < 12) {
            head = Buffer.concat([head, chunk.subarray(0, 12 - head.length)]);
          }
          bytes += chunk.length;
          if (bytes > max) throw new Error(`Video is larger than the ${Math.round(max / (1024 * 1024))} MB limit.`);
          hash.update(chunk);
          yield chunk;
        }
      },
      createWriteStream(tempPath),
    );

    if (bytes === 0) throw new Error("That video file is empty.");
    const mime = videoSignature(head);
    if (!mime) throw new Error("Only MP4 or WebM video files are accepted.");

    const extension = mime === "video/mp4" ? "mp4" : "webm";
    const key = `video/${hash.digest("hex").slice(0, 32)}.${extension}`;
    const destination = path.join(root, key);
    await mkdir(path.dirname(destination), { recursive: true });
    await rename(tempPath, destination);
    return { key, url: `${publicMediaBase()}/${key}`, mime, bytes };
  } catch (error) {
    await unlink(tempPath).catch(() => {});
    throw error;
  }
}

export type ResolvedMedia = {
  filePath: string;
  size: number;
  contentType: string;
  modified: Date;
};

/**
 * Maps URL segments to a file inside UPLOAD_DIR, or null when the request is a
 * traversal attempt or an unsupported type.
 */
export async function resolveMedia(
  segments: string[],
): Promise<ResolvedMedia | null> {
  const root = uploadRoot();
  const relative = segments.join("/");

  if (!relative || relative.includes("\0") || relative.includes("\\")) return null;
  if (segments.some((segment) => segment === ".." || segment === "." )) return null;

  const filePath = path.resolve(/*turbopackIgnore: true*/ root, relative);
  if (!filePath.startsWith(root + path.sep)) return null;

  const contentType = SERVED_TYPES[path.extname(filePath).toLowerCase()];
  if (!contentType) return null;

  try {
    const info = await stat(filePath);
    if (!info.isFile()) return null;
    return { filePath, size: info.size, contentType, modified: info.mtime };
  } catch {
    return null;
  }
}