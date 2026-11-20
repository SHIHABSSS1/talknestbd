"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { AlertCircle, Check, X } from "lucide-react";

import { slugify, uniqueSlug } from "@/lib/slug";
import type { SaveResult } from "@/lib/book-content";
import type { Author, Publisher } from "@/lib/types";

/**
 * "Add author / publisher" dialog used from the book form dropdowns.
 *
 * It captures exactly the same fields as /admin/sections/authors and
 * /admin/sections/publishers, saves through the same provider, and immediately
 * selects the new entry in the book form.
 */
export function PersonPickerDialog({
  kind,
  slugs,
  onSave,
  onCreated,
  onClose,
}: {
  kind: "author" | "publisher";
  slugs: string[];
  onSave: (entry: Author | Publisher) => Promise<SaveResult>;
  onCreated: (entry: Author | Publisher) => void;
  onClose: () => void;
}) {
  const isAuthor = kind === "author";
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Dhaka");
  const [bio, setBio] = useState("");
  const [longBio, setLongBio] = useState("");
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState("");
  const [tagline, setTagline] = useState("");
  const [initials, setInitials] = useState("");
  const [established, setEstablished] = useState("2026");
  const [description, setDescription] = useState("");
  const [accent, setAccent] = useState("#1877F2");
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const [pending, startTransition] = useTransition();
  const nameRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setNotice({ error: true, text: "Name is required." });
      return;
    }
    const slug = uniqueSlug(name.trim(), slugs);
    const entry: Author | Publisher = isAuthor
      ? {
          slug,
          name: name.trim(),
          title: title.trim() || "Writer",
          bio: bio.trim(),
          longBio: longBio.split("\n").map((line) => line.trim()).filter(Boolean),
          location: location.trim() || "Dhaka",
          quote: quote.trim(),
          featured: false,
          ...(image.trim() ? { image: image.trim() } : {}),
        }
      : {
          slug,
          name: name.trim(),
          tagline: tagline.trim(),
          description: description.trim(),
          established: established.trim() || "2026",
          location: location.trim() || "Dhaka",
          initials: (initials.trim() || name.trim().slice(0, 2)).toUpperCase(),
          accent,
          featured: false,
          ...(image.trim() ? { imageSrc: image.trim() } : {}),
        };

    setNotice(null);
    startTransition(async () => {
      try {
        const result = await onSave(entry);
        setNotice({ text: result.message, error: !result.ok });
        if (result.ok) onCreated(entry);
      } catch (error) {
        setNotice({
          error: true,
          text: error instanceof Error ? error.message : "Could not save the entry.",
        });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4">
      <button
        type="button"
        aria-label={`Close add ${kind} dialog`}
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Add a new ${kind}`}
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[10px] border border-line bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
          <div>
            <h3 className="text-[13px] font-semibold text-ink">
              Add a new {kind}
            </h3>
            <p className="text-[10px] text-muted">
              Saved to the {kind} list and selected for this book.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-muted hover:text-ink"
          >
            <X size={14} />
          </button>
        </div>

        <form id="person-picker-form" onSubmit={submit} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold text-ink">Name</span>
            <input
              ref={nameRef}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={isAuthor ? "Author name" : "Publisher name"}
              className={inputClass}
            />
          </label>
          <p className="text-[9px] text-muted">
            Slug: <code>{uniqueSlug(name.trim() || (isAuthor ? "new-author" : "new-publisher"), slugs)}</code>
            {" · "}auto-generated from the name, just like the standalone editor.
          </p>

          {isAuthor ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Title / role</span>
                  <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Writer" className={inputClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>Location</span>
                  <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Dhaka" className={inputClass} />
                </label>
              </div>
              <label className="block">
                <span className={labelClass}>Short bio</span>
                <textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={2} className={inputClass} />
              </label>
              <label className="block">
                <span className={labelClass}>Long bio paragraphs</span>
                <textarea value={longBio} onChange={(event) => setLongBio(event.target.value)} rows={3} placeholder="One paragraph per line" className={inputClass} />
              </label>
              <label className="block">
                <span className={labelClass}>Quote</span>
                <textarea value={quote} onChange={(event) => setQuote(event.target.value)} rows={2} className={inputClass} />
              </label>
            </>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Tagline</span>
                  <input value={tagline} onChange={(event) => setTagline(event.target.value)} className={inputClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>Initials</span>
                  <input value={initials} onChange={(event) => setInitials(event.target.value)} placeholder="NP" className={inputClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>Established</span>
                  <input value={established} onChange={(event) => setEstablished(event.target.value)} className={inputClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>Accent</span>
                  <input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} className="h-[42px] w-full rounded-[4px] border border-line bg-white p-1" />
                </label>
              </div>
              <label className="block">
                <span className={labelClass}>Description</span>
                <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className={inputClass} />
              </label>
            </>
          )}

          <label className="block">
            <span className={labelClass}>
              {isAuthor ? "Photo URL (optional)" : "Logo URL (optional)"}
            </span>
            <input
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="https://… or /media/…"
              className={inputClass}
            />
            <span className="mt-1 block text-[9px] text-muted">
              A local image can be uploaded in the standalone {kind} editor first.
            </span>
          </label>

          {notice && (
            <div
              role="status"
              className={`flex items-start gap-2 rounded-[8px] border px-3 py-2.5 text-[10px] ${
                notice.error
                  ? "border-gold-300 bg-gold-300/15 text-ink"
                  : "border-brand-100 bg-brand-50 text-brand-800"
              }`}
            >
              {notice.error ? <AlertCircle size={13} /> : <Check size={13} />}
              {notice.text}
            </div>
          )}
        </form>

        <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3 sm:px-5">
          <button
            type="submit"
            form="person-picker-form"
            disabled={pending}
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            <Check size={13} /> {pending ? "Saving…" : `Add ${kind}`}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const labelClass = "mb-1.5 block text-[11px] font-semibold text-ink";
