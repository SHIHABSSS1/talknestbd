/**
 * Client-side image helpers for the demo hero editor. Uploaded images are
 * downscaled and re-encoded as JPEG data URLs so they fit in localStorage.
 */

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 900;
/** Keep each image well under the ~5 MB localStorage quota. */
const MAX_DATA_URL_CHARS = 800_000;
const QUALITY_STEPS = [0.82, 0.68, 0.55];

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that image file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("That file could not be opened as an image."));
    image.src = src;
  });
}

/**
 * Compresses an image file into a bounded JPEG data URL. Transparent areas are
 * flattened onto a light background to avoid black edges after JPEG encoding.
 */
export async function fileToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPG, PNG or WebP).");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("That image is larger than 15 MB. Please choose a smaller one.");
  }

  const original = await readAsDataUrl(file);
  const image = await loadImage(original);
  const scale = Math.min(
    1,
    MAX_WIDTH / image.naturalWidth,
    MAX_HEIGHT / image.naturalHeight,
  );
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image editing is not supported by this browser.");
  context.fillStyle = "#f5f5f4";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  let result = "";
  for (const quality of QUALITY_STEPS) {
    result = canvas.toDataURL("image/jpeg", quality);
    if (result.length <= MAX_DATA_URL_CHARS) break;
  }
  return result;
}

/** Human-friendly size of a data URL's decoded payload. */
export function dataUrlSizeLabel(dataUrl: string): string {
  const base64 = dataUrl.split(",")[1] ?? "";
  const bytes = Math.floor((base64.length * 3) / 4);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
