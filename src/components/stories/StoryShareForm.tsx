"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Heart,
  Mic,
  Pause,
  Play,
  Square,
  Trash2,
  Upload,
  PenLine,
  Send,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

type Mode = "text" | "voice" | "pdf";

const modes: Array<{ key: Mode; label: string; icon: typeof Mic; detail: string }> = [
  { key: "text", label: "লিখে শেয়ার", icon: PenLine, detail: "নিজের ভাষায় গল্প লিখুন" },
  { key: "voice", label: "ভয়েস রেকর্ড", icon: Mic, detail: "নিজের কণ্ঠে গল্প বলুন" },
  { key: "pdf", label: "PDF আপলোড", icon: FileText, detail: "ডায়েরি বা লেখা আপলোড করুন" },
];

const inputClass =
  "h-11 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

export function StoryShareForm() {
  const [mode, setMode] = useState<Mode>("text");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const [recording, setRecording] = useState(false);
  const [recordingReady, setRecordingReady] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [micError, setMicError] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    };
  }, [recordingUrl]);

  const start = async () => {
    setMicError("");
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setMicError("এই ব্রাউজারে ভয়েস রেকর্ডিং সমর্থিত নয়। লেখা বা PDF বেছে নিন।");
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
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (recordingUrl) URL.revokeObjectURL(recordingUrl);
        setRecordingUrl(URL.createObjectURL(blob));
        setRecordingReady(true);
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      recorderRef.current = recorder;
      setSeconds(0);
      setRecording(true);
      timerRef.current = setInterval(() => setSeconds((value) => value + 1), 1000);
    } catch {
      setMicError("মাইক্রোফোন ব্যবহারের অনুমতি পাওয়া যায়নি। ব্রাউজার সেটিংস থেকে অনুমতি দিন।");
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
    setSeconds(0);
    setPlaying(false);
  };

  const formatTime = (value: number) =>
    `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 3) next.name = "আপনার নাম লিখুন";
    if (title.trim().length < 4) next.title = "গল্পের একটি শিরোনাম দিন";
    if (mode === "text" && text.trim().length < 40) {
      next.text = "অন্তত ৪০ অক্ষরের গল্প লিখুন";
    }
    if (mode === "voice" && !recordingReady && !recording) {
      next.voice = "একটি ভয়েস রেকর্ডিং করুন অথবা ডেমো রেকর্ডিং ব্যবহার করুন";
    }
    if (mode === "pdf" && !fileName) {
      next.pdf = "একটি PDF ফাইল বেছে নিন";
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-forest-900/10 bg-cream-50 p-7 text-center sm:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-clay-500/10 text-clay-600">
          <Heart size={28} className="fill-clay-500/20" />
        </span>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-500">
          Share to My Heart
        </p>
        <h2 className="mt-1.5 font-display text-2xl font-bold text-forest-950 sm:text-3xl">
          ধন্যবাদ, আপনার গল্প আমাদের পৌঁছেছে
        </h2>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">
          সম্পাদকীয় টিম গল্পটি পড়ে যাচাই করবে। অনুমোদনের পর এটি “হৃদয়ের গল্প”
          পাতায় প্রকাশ করা হবে। ডেমো সাইটে কোনো তথ্য সার্ভারে পাঠানো হয়নি।
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button href="/stories" size="sm">
            সব গল্প পড়ুন
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setSubmitted(false)}>
            আরেকটি গল্প লিখুন
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 lg:grid-cols-[1fr_300px] lg:items-start">
      <div className="space-y-4">
        <div className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-clay-500">
            কীভাবে শেয়ার করবেন
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
                  <span className={active ? "mt-1 block text-[8px] text-cream-100/50" : "mt-1 block text-[8px] text-muted"}>
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
              <span className="mb-1 block text-[11px] font-semibold text-forest-900">
                আপনার নাম <span className="text-clay-500">*</span>
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="যেমন: রুমানা ইসলাম"
                autoComplete="name"
                className={cn(inputClass, errors.name && "border-clay-500/70")}
              />
              {errors.name && <span className="mt-1 block text-[10px] text-clay-600">{errors.name}</span>}
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-forest-900">
                গল্পের শিরোনাম <span className="text-clay-500">*</span>
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="গল্পের একটি নাম দিন"
                className={cn(inputClass, errors.title && "border-clay-500/70")}
              />
              {errors.title && <span className="mt-1 block text-[10px] text-clay-600">{errors.title}</span>}
            </label>
          </div>

          <div className="mt-3">
            {mode === "text" && (
              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold text-forest-900">
                  আপনার গল্প <span className="text-clay-500">*</span>
                </span>
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  rows={9}
                  placeholder="জীবনের একটা ছোট মুহূর্ত, স্মৃতি বা অনুভূতি লিখে ফেলুন..."
                  className={cn(
                    "w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 py-3 text-[13px] leading-relaxed text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25",
                    errors.text && "border-clay-500/70",
                  )}
                />
                <span className="mt-1 flex items-center justify-between text-[9px] text-muted">
                  <span>{errors.text && <span className="text-clay-600">{errors.text}</span>}</span>
                  <span>{text.trim().length} অক্ষর</span>
                </span>
              </label>
            )}

            {mode === "voice" && (
              <div>
                <span className="mb-1 block text-[11px] font-semibold text-forest-900">
                  ভয়েস রেকর্ডিং <span className="text-clay-500">*</span>
                </span>
                <div className="rounded-2xl border border-dashed border-forest-900/15 bg-cream-100/50 p-4">
                  {!recordingReady ? (
                    <div className="text-center">
                      <span className={cn("mx-auto grid h-14 w-14 place-items-center rounded-full", recording ? "animate-pulse bg-clay-500 text-cream-50" : "bg-forest-900 text-gold-300")}>
                        <Mic size={22} />
                      </span>
                      <p className="mt-2 text-xs font-semibold text-forest-950">
                        {recording ? "রেকর্ডিং চলছে..." : "মাইক্রোফোনে গল্প বলুন"}
                      </p>
                      <p className="mt-1 text-[10px] text-muted">
                        {recording ? formatTime(seconds) : "৫ মিনিটের মধ্যে রাখুন · ডেমো সাইটে অডিও আপলোড হয় না"}
                      </p>
                      <div className="mt-3 flex justify-center gap-2">
                        {!recording ? (
                          <Button type="button" size="sm" onClick={start}>
                            <Mic size={13} /> রেকর্ডিং শুরু
                          </Button>
                        ) : (
                          <Button type="button" size="sm" variant="clay" onClick={stop}>
                            <Square size={12} className="fill-cream-50" /> রেকর্ডিং বন্ধ
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPlaying((value) => !value)}
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-900 text-gold-300"
                          aria-label={playing ? "পজ করুন" : "প্লে করুন"}
                        >
                          {playing ? <Pause size={15} className="fill-gold-300" /> : <Play size={15} className="ml-0.5 fill-gold-300" />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold text-forest-950">আপনার রেকর্ডিং প্রস্তুত</p>
                          <p className="text-[9px] text-muted">{formatTime(seconds)} · শুনে দেখুন তারপর জমা দিন</p>
                          <div className="mt-1.5 flex h-5 items-center gap-[2px]">
                            {[35, 65, 45, 80, 55, 70, 40, 85, 50, 75, 42, 68, 36, 72].map((height, index) => (
                              <span key={index} className={playing ? "flex-1 animate-pulse rounded-full bg-clay-500/60" : "flex-1 rounded-full bg-clay-500/30"} style={{ height: `${height}%`, animationDelay: `${index * 60}ms` }} />
                            ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={discard}
                          aria-label="রেকর্ডিং মুছুন"
                          className="grid h-8 w-8 place-items-center rounded-full text-clay-600 hover:bg-clay-500/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {recordingUrl && (
                        <audio
                          ref={audioRef}
                          src={recordingUrl}
                          controls
                          onPlay={() => setPlaying(true)}
                          onPause={() => setPlaying(false)}
                          onEnded={() => setPlaying(false)}
                          className="mt-3 h-8 w-full"
                        />
                      )}
                    </div>
                  )}
                  {micError && (
                    <p className="mt-2 rounded-lg bg-clay-500/10 px-2.5 py-2 text-[9px] text-clay-600">{micError}</p>
                  )}
                  {errors.voice && <p className="mt-2 text-[9px] text-clay-600">{errors.voice}</p>}
                  <p className="mt-2 text-center text-[8px] text-muted">
                    ডেমো: অনুমতি না পেলে “লেখা” মোডে গল্পটি লিখে জমা দিতে পারেন।
                  </p>
                </div>
              </div>
            )}

            {mode === "pdf" && (
              <div>
                <span className="mb-1 block text-[11px] font-semibold text-forest-900">
                  PDF ডায়েরি <span className="text-clay-500">*</span>
                </span>
                <label className="flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-forest-900/20 bg-cream-100/50 px-4 py-7 text-center transition-colors hover:border-forest-900/40 hover:bg-cream-100">
                  <Upload size={24} className="text-forest-700/50" />
                  <span className="mt-2 text-[11px] font-semibold text-forest-900">
                    {fileName || "PDF ফাইল বেছে নিন"}
                  </span>
                  <span className="mt-0.5 text-[9px] text-muted">
                    সর্বোচ্চ ১০ MB · ডেমোতে ফাইলটি আপলোড হয় না
                  </span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="sr-only"
                    onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
                  />
                </label>
                {errors.pdf && <span className="mt-1 block text-[10px] text-clay-600">{errors.pdf}</span>}
                <p className="mt-2 flex items-start gap-1.5 text-[9px] leading-relaxed text-muted">
                  <FileText size={11} className="mt-0.5 shrink-0" />
                  হাতে লেখা ডায়েরি হলে স্ক্যান করে PDF বানিয়ে আপলোড করুন। ছবি
                  পরিষ্কার হলে প্রকাশনার সম্ভাবনা বেশি।
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-3">
          <Link href="/stories" className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-forest-800 hover:text-clay-600">
            <ArrowLeft size={12} /> সব গল্পে ফিরুন
          </Link>
          <Button type="submit" size="sm">
            <Send size={13} /> গল্প জমা দিন
          </Button>
        </div>
        <p className="text-center text-[8px] text-muted">
          জমা দেওয়ার মাধ্যমে আপনি নিশ্চিত করছেন গল্পটি আপনার নিজের এবং প্রকাশের অনুমতি দিচ্ছেন।
        </p>
      </div>

      <aside className="space-y-3 lg:sticky lg:top-32">
        <div className="rounded-3xl bg-forest-950 p-5 text-cream-50">
          <Sparkles size={19} className="text-gold-400" />
          <h2 className="mt-2 font-display text-lg font-bold leading-snug">ভালো গল্পের ছোট্ট টিপস</h2>
          <ul className="mt-3 space-y-2 text-[10px] leading-relaxed text-cream-100/60">
            {[
              "শুরুতেই একটি দৃশ্য বা মুহূর্ত দিয়ে গল্প শুরু করুন",
              "নিজের অনুভূতি সৎভাবে লিখুন — পাঠক তা বুঝতে পারে",
              "বড় ঘটনার বদলে ছোট খুঁটিনাটি বিবরণ দিন",
              "শেষে একটি প্রশ্ন বা শিক্ষা রাখুন",
              "ভয়েসে স্বাভাবিক গতিতে ও স্পষ্ট করে বলুন",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-1.5">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-gold-500/20 bg-gold-500/8 p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-950">
            <CheckCircle2 size={13} className="text-gold-600" /> সম্পাদকীয় রিভিউ
          </p>
          <p className="mt-1 text-[9px] leading-relaxed text-muted">
            প্রতিটি গল্প প্রকাশের আগে পড়া হয়। গোপনীয়তা রক্ষা ও ভাষার শুদ্ধতার
            জন্য সামান্য সম্পাদনা হতে পারে।
          </p>
        </div>
      </aside>
    </form>
  );
}
