"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Heart,
  ImagePlus,
  Loader2,
  Mic,
  Pause,
  PenLine,
  Play,
  Send,
  Square,
  Trash2,
  Upload,
} from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import { useStories } from "@/components/providers/StoriesProvider";
import { fileToDataUrl } from "@/lib/image";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Mode = "text" | "voice" | "pdf";

const modes: Array<{ key: Mode; label: string; icon: typeof Mic; detail: string }> = [
  { key: "text", label: "Write & share", icon: PenLine, detail: "Tell your story in your own words" },
  { key: "voice", label: "Voice recording", icon: Mic, detail: "Narrate your story in your own voice" },
  { key: "pdf", label: "Upload PDF", icon: FileText, detail: "Upload a diary or written piece" },
];

const inputClass =
  "h-11 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

export function StoryShareForm() {
  const { copy, signedIn, loading: sessionLoading } = useStories();
  const [mode, setMode] = useState<Mode>("text");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Community");
  const [text, setText] = useState("");
  const [categories, setCategories] = useState<string[]>(["Community"]);
  const [coverUrl, setCoverUrl] = useState("");
  const [coverName, setCoverName] = useState("");
  const [pdfKey, setPdfKey] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [audioKey, setAudioKey] = useState("");
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [recording, setRecording] = useState(false);
  const [recordingReady, setRecordingReady] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [micError, setMicError] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    accountFetch<{ categories: string[] }>("/api/stories/categories")
      .then((data) => {
        if (data.categories?.length) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    };
  }, [recordingUrl]);

  const uploadFile = async (file: File | Blob, kind: "pdf" | "audio") => {
    setBusy(kind);
    setNotice("");
    try {
      const response = await fetch(`/api/story-upload?kind=${kind}`, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      const data = (await response.json().catch(() => null)) as
        | { key?: string; error?: string }
        | null;
      if (!response.ok || !data?.key) throw new Error(data?.error ?? "Upload failed.");
      return data.key;
    } finally {
      setBusy("");
    }
  };

  const uploadCover = async (file: File | undefined) => {
    if (!file) return;
    setBusy("cover");
    setNotice("");
    try {
      const src = await fileToDataUrl(file);
      const data = await accountFetch<{ url?: string; error?: string }>("/api/story-upload?kind=image", {
        method: "POST",
        body: JSON.stringify({ src }),
      });
      if (!data.url) throw new Error(data.error ?? "Could not store the cover.");
      setCoverUrl(data.url);
      setCoverName(file.name);
    } catch (reason) {
      setNotice(reason instanceof Error ? reason.message : "Could not store the cover.");
    } finally {
      setBusy("");
    }
  };

  const onPdfChange = async (file: File | undefined) => {
    setNotice("");
    setErrors((current) => ({ ...current, pdf: "" }));
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrors((current) => ({ ...current, pdf: "Choose a PDF file." }));
      return;
    }
    try {
      const key = await uploadFile(file, "pdf");
      setPdfKey(key);
      setPdfName(file.name);
    } catch (reason) {
      setNotice(reason instanceof Error ? reason.message : "Could not upload the PDF.");
    }
  };

  const start = async () => {
    setMicError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError("Voice recording is not supported in this browser. Choose text or PDF instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (recordingUrl) URL.revokeObjectURL(recordingUrl);
        setRecordingUrl(URL.createObjectURL(blob));
        setRecordingReady(true);
        stream.getTracks().forEach((track) => track.stop());
        setAudioSeconds(Math.max(1, seconds));
        try {
          const key = await uploadFile(blob, "audio");
          setAudioKey(key);
        } catch (reason) {
          setMicError(reason instanceof Error ? reason.message : "Could not upload the recording.");
        }
      };
      recorder.start();
      recorderRef.current = recorder;
      setSeconds(0);
      setRecording(true);
      timerRef.current = setInterval(() => setSeconds((value) => value + 1), 1000);
    } catch {
      setMicError("Microphone permission was denied. Allow access in your browser settings.");
    }
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setRecording(false);
  };

  const discard = () => {
    if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    setRecordingUrl(null);
    setRecordingReady(false);
    setAudioKey("");
    setSeconds(0);
    setPlaying(false);
  };

  const formatTime = (value: number) =>
    `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Enter your name";
    if (title.trim().length < 4) next.title = "Give your story a title";
    if (mode === "text" && text.trim().length < 40) next.text = "Write at least 40 characters";
    if (mode === "voice" && !audioKey) next.voice = "Record a voice story before submitting";
    if (mode === "pdf" && !pdfKey) next.pdf = "Upload a PDF file before submitting";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setBusy("submit");
    setNotice("");
    try {
      const result = await accountFetch<{ ok: boolean; message: string }>("/api/stories", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          title: title.trim(),
          category,
          type: mode,
          excerpt: text.trim().slice(0, 240) || (mode === "voice" ? "A story told in the author's own voice." : "A PDF diary shared by a reader."),
          body: text.trim(),
          coverUrl,
          duration: mode === "voice" ? formatTime(audioSeconds) : "",
          audioKey: mode === "voice" ? audioKey : null,
          attachmentKey: mode === "pdf" ? pdfKey : null,
          attachmentName: mode === "pdf" ? pdfName : null,
        }),
      });
      setNotice(result.message);
      if (result.ok) setSubmitted(true);
    } catch (reason) {
      setNotice(reason instanceof Error ? reason.message : "Could not submit your story.");
    } finally {
      setBusy("");
    }
  };

  if (!sessionLoading && !signedIn) {
    return (
      <div className="rounded-3xl border border-forest-900/10 bg-cream-50 p-8 text-center sm:p-10">
        <Mic size={30} className="mx-auto text-clay-500" />
        <h2 className="mt-4 font-display text-2xl font-bold text-forest-950">Sign in to share your story</h2>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">
          Everyone can read and listen to reader stories. Sharing your own story needs an account so
          our editors can follow up and you can track its status.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button href="/login?callbackUrl=/stories/share" size="sm">Sign in</Button>
          <Button href="/register?callbackUrl=/stories/share" variant="outline" size="sm">Create an account</Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-forest-900/10 bg-cream-50 p-7 text-center sm:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-clay-500/10 text-clay-600">
          <Heart size={28} className="fill-clay-500/20" />
        </span>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-500">
          {copy.share.badge}
        </p>
        <h2 className="mt-1.5 font-display text-2xl font-bold text-forest-950 sm:text-3xl">
          {copy.share.successTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">{copy.share.successText}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button href="/account/stories" size="sm">My submissions</Button>
          <Button href="/stories" variant="outline" size="sm">Read all stories</Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setSubmitted(false)}>Share another</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 lg:grid-cols-[1fr_300px] lg:items-start">
      <div className="space-y-4">
        <div className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-clay-500">
            How would you like to share?
          </p>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
            {modes.map((item) => {
              const Icon = item.icon;
              const active = mode === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setMode(item.key)}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-colors",
                    active
                      ? "border-forest-800 bg-forest-900 text-cream-50"
                      : "border-forest-900/10 bg-cream-50 text-forest-900 hover:border-forest-900/25",
                  )}
                >
                  <span className="flex items-center gap-2 text-[11px] font-semibold">
                    <Icon size={14} className={active ? "text-gold-300" : "text-forest-600"} />
                    {item.label}
                  </span>
                  <span className={cn("mt-1 block text-[8px]", active ? "text-cream-100/50" : "text-muted")}>
                    {item.detail}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-forest-900">Your name *</span>
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Rumana Islam" className={cn(inputClass, errors.name && "border-clay-500/70")} />
              {errors.name && <span className="mt-1 block text-[10px] text-clay-600">{errors.name}</span>}
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-forest-900">Story title *</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your story a name" className={cn(inputClass, errors.title && "border-clay-500/70")} />
              {errors.title && <span className="mt-1 block text-[10px] text-clay-600">{errors.title}</span>}
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-[11px] font-semibold text-forest-900">Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className={inputClass}>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-4">
            <span className="mb-1 block text-[11px] font-semibold text-forest-900">Cover image (optional)</span>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-forest-900/20 bg-cream-100/50 px-3 py-3">
              <ImagePlus size={18} className="shrink-0 text-forest-700/60" />
              <span className="min-w-0 flex-1 truncate text-[10px] text-forest-900">
                {busy === "cover" ? "Uploading…" : coverName || "Choose a JPG, PNG or WebP image"}
              </span>
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => void uploadCover(event.target.files?.[0])} />
            </label>
          </div>

          <div className="mt-4">
            {mode === "text" && (
              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold text-forest-900">Your story *</span>
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  rows={9}
                  placeholder="Write down a small moment, memory or feeling from life..."
                  className={cn(
                    "w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 py-3 text-[13px] leading-relaxed text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25",
                    errors.text && "border-clay-500/70",
                  )}
                />
                <span className="mt-1 flex items-center justify-between text-[9px] text-muted">
                  <span>{errors.text && <span className="text-clay-600">{errors.text}</span>}</span>
                  <span>{text.trim().length} characters</span>
                </span>
              </label>
            )}

            {mode === "voice" && (
              <div>
                <span className="mb-1 block text-[11px] font-semibold text-forest-900">Voice recording *</span>
                <div className="rounded-2xl border border-dashed border-forest-900/15 bg-cream-100/50 p-4">
                  {!recordingReady ? (
                    <div className="text-center">
                      <span className={cn("mx-auto grid h-14 w-14 place-items-center rounded-full", recording ? "animate-pulse bg-clay-500 text-cream-50" : "bg-forest-900 text-gold-300")}>
                        <Mic size={22} />
                      </span>
                      <p className="mt-2 text-xs font-semibold text-forest-950">
                        {recording ? "Recording…" : "Tell your story into the microphone"}
                      </p>
                      <p className="mt-1 text-[10px] text-muted">
                        {recording ? formatTime(seconds) : "Keep it under 5 minutes · audio is stored on our server"}
                      </p>
                      <div className="mt-3 flex justify-center gap-2">
                        {!recording ? (
                          <Button type="button" size="sm" onClick={() => void start()}><Mic size={13} /> Start recording</Button>
                        ) : (
                          <Button type="button" size="sm" variant="clay" onClick={stop}><Square size={12} className="fill-cream-50" /> Stop recording</Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPlaying((value) => !value)}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-900 text-gold-300"
                        aria-label={playing ? "Pause" : "Play"}
                      >
                        {playing ? <Pause size={15} className="fill-gold-300" /> : <Play size={15} className="ml-0.5 fill-gold-300" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold text-forest-950">Your recording is ready</p>
                        <p className="text-[9px] text-muted">{formatTime(audioSeconds)} · {busy === "audio" ? "Uploading…" : "Stored securely"}</p>
                      </div>
                      <button type="button" onClick={discard} aria-label="Delete recording" className="grid h-8 w-8 place-items-center rounded-full text-clay-600 hover:bg-clay-500/10">
                        <Trash2 size={14} />
                      </button>
                      {recordingUrl && (
                        <audio
                          src={recordingUrl}
                          controls
                          onPlay={() => setPlaying(true)}
                          onPause={() => setPlaying(false)}
                          onEnded={() => setPlaying(false)}
                          className="sr-only"
                        />
                      )}
                    </div>
                  )}
                  {micError && <p className="mt-2 rounded-lg bg-clay-500/10 px-2.5 py-2 text-[9px] text-clay-600">{micError}</p>}
                  {errors.voice && <p className="mt-2 text-[9px] text-clay-600">{errors.voice}</p>}
                </div>
              </div>
            )}

            {mode === "pdf" && (
              <div>
                <span className="mb-1 block text-[11px] font-semibold text-forest-900">PDF diary *</span>
                <label className="flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-forest-900/20 bg-cream-100/50 px-4 py-7 text-center transition-colors hover:border-forest-900/40 hover:bg-cream-100">
                  <Upload size={24} className="text-forest-700/50" />
                  <span className="mt-2 text-[11px] font-semibold text-forest-900">
                    {busy === "pdf" ? "Uploading…" : pdfName || "Choose a PDF file"}
                  </span>
                  <span className="mt-0.5 text-[9px] text-muted">Max 15 MB · stored securely</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="sr-only"
                    onChange={(event) => void onPdfChange(event.target.files?.[0])}
                  />
                </label>
                {errors.pdf && <span className="mt-1 block text-[10px] text-clay-600">{errors.pdf}</span>}
              </div>
            )}
          </div>
        </div>

        {notice && (
          <p role="status" className="rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-[10px] text-brand-800">
            {notice}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-3">
          <Link href="/stories" className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-forest-800 hover:text-clay-600">
            <ArrowLeft size={12} /> Back to all stories
          </Link>
          <Button type="submit" size="sm" disabled={Boolean(busy)}>
            {busy === "submit" ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            Submit story
          </Button>
        </div>
        <p className="text-center text-[8px] text-muted">
          By submitting, you confirm this story is your own and give permission for it to be published.
        </p>
      </div>

      <aside className="space-y-3 lg:sticky lg:top-[88px]">
        <div className="rounded-3xl bg-forest-950 p-5 text-cream-50">
          <PenLine size={19} className="text-gold-400" />
          <h2 className="mt-2 font-display text-lg font-bold leading-snug">{copy.share.tipsTitle}</h2>
          <ul className="mt-3 space-y-2 text-[10px] leading-relaxed text-cream-100/60">
            {copy.share.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-1.5">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-gold-500/20 bg-gold-500/8 p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-950">
            <CheckCircle2 size={13} className="text-gold-600" /> {copy.share.reviewTitle}
          </p>
          <p className="mt-1 text-[9px] leading-relaxed text-muted">{copy.share.reviewText}</p>
        </div>
      </aside>
    </form>
  );
}
