"use client";

/**
 * API-driven admin manager for videos, quizzes, discussions and results.
 * Every list and mutation goes through a Route Handler; nothing is stored in
 * the browser. Layouts are card-based so every tab works on a phone.
 */
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Eye,
  FileVideo,
  ImagePlus,
  MessageCircle,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Send,
  Trash2,
  Trophy,
  UploadCloud,
} from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import { parseYouTubeId, youtubeWatchUrl } from "@/lib/youtube";
import { cn } from "@/lib/utils";
import type {
  AttemptView,
  DiscussionView,
  QuizView,
  SaveResult,
  VideoView,
} from "@/lib/video-quiz-api";
import type { VideoQuizCopy } from "@/lib/video-quiz-content";

type Tab = "videos" | "quizzes" | "discussions" | "results" | "homepage" | "videoPage" | "quizPage";
type Notice = { text: string; ok: boolean } | null;

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-[10px] border border-line bg-white">
      <div className="border-b border-line px-4 py-3.5 sm:px-5">
        <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
        {description && <p className="mt-0.5 text-[10px] text-muted">{description}</p>}
      </div>
      <div className="space-y-3 p-4 sm:p-5">{children}</div>
    </section>
  );
}

function Pager({ offset, limit, total, onChange }: { offset: number; limit: number; total: number; onChange: (next: number) => void }) {
  if (total <= limit) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
      <button
        type="button"
        disabled={offset === 0}
        onClick={() => onChange(Math.max(0, offset - limit))}
        className="rounded-[4px] border border-line px-3 py-1.5 text-[10px] font-semibold text-ink disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-[9px] text-muted">{offset + 1}–{Math.min(offset + limit, total)} of {total}</span>
      <button
        type="button"
        disabled={offset + limit >= total}
        onClick={() => onChange(offset + limit)}
        className="rounded-[4px] border border-line px-3 py-1.5 text-[10px] font-semibold text-ink disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

function StringList({ label, values, onChange }: { label: string; values: string[]; onChange: (values: string[]) => void }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-ink">{label}</span>
        <button type="button" onClick={() => onChange([...values, ""])} className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 hover:underline">
          <Plus size={11} /> Add
        </button>
      </div>
      <div className="space-y-1.5">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <input
              value={value}
              onChange={(event) => {
                const next = [...values];
                next[index] = event.target.value;
                onChange(next);
              }}
              className={fieldClass}
            />
            <button type="button" onClick={() => onChange(values.filter((_, i) => i !== index))} aria-label={`Remove ${label} ${index + 1}`} className="rounded-[4px] p-2 text-muted hover:text-brand-700">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

type VideoForm = {
  id?: string;
  title: string;
  description: string;
  category: string;
  host: string;
  episode: string;
  duration: string;
  views: string;
  thumbnail: string;
  source: "youtube" | "upload";
  youtubeUrl: string;
  videoUrl: string;
  featured: boolean;
  status: "draft" | "published";
};

function emptyVideo(): VideoForm {
  return {
    title: "", description: "", category: "Interview", host: "TalkNest", episode: "1",
    duration: "12:00", views: "1.0K", thumbnail: "", source: "youtube", youtubeUrl: "",
    videoUrl: "", featured: false, status: "published",
  };
}

function fromVideo(video: VideoView): VideoForm {
  return {
    id: video.id,
    title: video.title,
    description: video.description,
    category: video.category,
    host: video.host,
    episode: String(video.episode),
    duration: video.duration,
    views: video.views,
    thumbnail: video.thumbnail,
    source: video.source,
    youtubeUrl: video.youtubeId ?? "",
    videoUrl: video.videoUrl ?? "",
    featured: video.featured,
    status: video.status === "draft" ? "draft" : "published",
  };
}

type QuestionDraft = {
  id?: string;
  question: string;
  options: string[];
  answerIndex: string;
  explanation: string;
  marks: string;
};

type QuizForm = {
  id?: string;
  title: string;
  description: string;
  category: string;
  instructions: string;
  type: "book" | "watch" | "general";
  videoId: string;
  durationMinutes: string;
  featured: boolean;
  status: "draft" | "published";
  questions: QuestionDraft[];
};

function emptyQuiz(): QuizForm {
  return {
    title: "", description: "", category: "General", instructions: "",
    type: "book", videoId: "", durationMinutes: "2", featured: false, status: "published",
    questions: [{ question: "", options: ["", "", "", ""], answerIndex: "0", explanation: "", marks: "1" }],
  };
}

function fromQuiz(quiz: QuizView): QuizForm {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    instructions: quiz.instructions,
    type: quiz.type,
    videoId: quiz.videoId ?? "",
    durationMinutes: String(quiz.durationMinutes),
    featured: quiz.featured,
    status: quiz.status === "draft" ? "draft" : "published",
    questions: quiz.questions.map((question) => ({
      id: question.id,
      question: question.question,
      options: [...question.options],
      answerIndex: String(question.answerIndex),
      explanation: question.explanation,
      marks: String(question.marks),
    })),
  };
}

export function AdminVideoQuizManager({
  label,
  initialTab = "videos",
  initialCopy,
}: {
  label: string;
  initialTab?: Tab;
  initialCopy: VideoQuizCopy;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [videos, setVideos] = useState<VideoView[]>([]);
  const [quizzes, setQuizzes] = useState<QuizView[]>([]);
  const [threads, setThreads] = useState<DiscussionView[]>([]);
  const [attempts, setAttempts] = useState<AttemptView[]>([]);
  const [copy, setCopy] = useState<VideoQuizCopy>(initialCopy);
  const [videoForm, setVideoForm] = useState<VideoForm>(emptyVideo);
  const [quizForm, setQuizForm] = useState<QuizForm>(emptyQuiz);
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);
  const [busyUpload, setBusyUpload] = useState("");
  const [videoQuery, setVideoQuery] = useState("");
  const [quizQuery, setQuizQuery] = useState("");
  const [discussionQuery, setDiscussionQuery] = useState("");
  const [discussionTarget, setDiscussionTarget] = useState("");
  const [discussionOffset, setDiscussionOffset] = useState(0);
  const [discussionTotal, setDiscussionTotal] = useState(0);
  const [resultsOffset, setResultsOffset] = useState(0);
  const [resultsTotal, setResultsTotal] = useState(0);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");

  const show = useCallback((result: SaveResult) => setNotice({ text: result.message, ok: result.ok }), []);

  const loadVideos = useCallback(async () => {
    try {
      const data = await accountFetch<{ videos: VideoView[] }>("/api/admin/videos");
      setVideos(data.videos ?? []);
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not load videos." });
    }
  }, [show]);

  const loadQuizzes = useCallback(async () => {
    try {
      const data = await accountFetch<{ quizzes: QuizView[] }>("/api/admin/quizzes");
      setQuizzes(data.quizzes ?? []);
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not load quizzes." });
    }
  }, [show]);

  const loadThreads = useCallback(async () => {
    const query = new URLSearchParams({ limit: "20", offset: String(discussionOffset) });
    if (discussionQuery) query.set("q", discussionQuery);
    if (discussionTarget) query.set("target", discussionTarget);
    try {
      const data = await accountFetch<{ rows: DiscussionView[]; total: number }>(`/api/admin/discussions?${query}`);
      setThreads(data.rows ?? []);
      setDiscussionTotal(data.total ?? 0);
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not load discussions." });
    }
  }, [discussionOffset, discussionQuery, discussionTarget, show]);

  const loadResults = useCallback(async () => {
    try {
      const data = await accountFetch<{ rows: AttemptView[]; total: number }>(
        `/api/admin/attempts?limit=20&offset=${resultsOffset}`,
      );
      setAttempts(data.rows ?? []);
      setResultsTotal(data.total ?? 0);
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not load results." });
    }
  }, [resultsOffset, show]);

  const loadCopy = useCallback(async () => {
    try {
      const data = await accountFetch<{ content: VideoQuizCopy }>("/api/admin/video-quiz");
      setCopy(data.content);
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not load copy." });
    }
  }, [show]);

  useEffect(() => {
    void loadVideos();
    void loadQuizzes();
    void loadCopy();
  }, [loadVideos, loadQuizzes, loadCopy]);

  useEffect(() => {
    if (tab === "discussions") void loadThreads();
    if (tab === "results") void loadResults();
  }, [tab, loadThreads, loadResults]);

  const filteredVideos = useMemo(() => {
    const q = videoQuery.trim().toLowerCase();
    return q ? videos.filter((video) => `${video.title} ${video.category} ${video.host}`.toLowerCase().includes(q)) : videos;
  }, [videos, videoQuery]);
  const filteredQuizzes = useMemo(() => {
    const q = quizQuery.trim().toLowerCase();
    return q ? quizzes.filter((quiz) => `${quiz.title} ${quiz.category}`.toLowerCase().includes(q)) : quizzes;
  }, [quizzes, quizQuery]);

  const uploadImage = async (file: File | undefined) => {
    if (!file) return;
    setBusyUpload("image");
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Could not read the image."));
        reader.readAsDataURL(file);
      });
      const data = await accountFetch<{ url?: string; error?: string }>("/api/uploads", {
        method: "POST",
        body: JSON.stringify({ src: dataUrl, folder: "video" }),
      });
      if (!data.url) throw new Error(data.error ?? "Upload failed.");
      setVideoForm((current) => ({ ...current, thumbnail: data.url! }));
      setNotice({ ok: true, text: "Thumbnail stored on the server." });
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not store the thumbnail." });
    } finally {
      setBusyUpload("");
    }
  };

  const uploadVideo = async (file: File | undefined) => {
    if (!file) return;
    if (!["video/mp4", "video/webm"].includes(file.type)) {
      show({ ok: false, message: "Choose an MP4 or WebM file." });
      return;
    }
    setBusyUpload("video");
    try {
      const response = await fetch("/api/video-upload", {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!response.ok || !data?.url) throw new Error(data?.error ?? "Video upload failed.");
      setVideoForm((current) => ({ ...current, source: "upload", videoUrl: data.url! }));
      setNotice({ ok: true, text: `Stored ${file.name} in uploads/video.` });
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not store the video." });
    } finally {
      setBusyUpload("");
    }
  };

  const saveVideo = async () => {
    if (!videoForm.title.trim()) return show({ ok: false, message: "A title is required." });
    if (videoForm.source === "youtube" && !parseYouTubeId(videoForm.youtubeUrl)) {
      return show({ ok: false, message: "Enter a valid YouTube URL or video id." });
    }
    if (videoForm.source === "upload" && !videoForm.videoUrl.startsWith("/media/")) {
      return show({ ok: false, message: "Upload a video file first." });
    }
    setBusy(true);
    try {
      const payload = {
        ...videoForm,
        episode: Number(videoForm.episode) || 0,
        youtubeUrl: videoForm.youtubeUrl,
      };
      const result = videoForm.id
        ? await accountFetch<SaveResult>(`/api/admin/videos/${videoForm.id}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await accountFetch<SaveResult>("/api/admin/videos", { method: "POST", body: JSON.stringify(payload) });
      show(result);
      if (result.ok) {
        setVideoForm(emptyVideo());
        await loadVideos();
      }
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not save the video." });
    } finally {
      setBusy(false);
    }
  };

  const removeVideo = async (id: string) => {
    if (!window.confirm("Delete this video permanently?")) return;
    try {
      show(await accountFetch<SaveResult>(`/api/admin/videos/${id}`, { method: "DELETE" }));
      await loadVideos();
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not delete the video." });
    }
  };

  const toggleVideoStatus = async (video: VideoView) => {
    try {
      const result = await accountFetch<SaveResult>(`/api/admin/videos/${video.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: video.title,
          description: video.description,
          category: video.category,
          host: video.host,
          episode: video.episode,
          duration: video.duration,
          views: video.views,
          thumbnail: video.thumbnail,
          source: video.source,
          youtubeUrl: video.youtubeId ?? "",
          videoUrl: video.videoUrl ?? "",
          featured: video.featured,
          status: video.status === "published" ? "draft" : "published",
        }),
      });
      show(result);
      if (result.ok) await loadVideos();
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not update the status." });
    }
  };

  const saveQuiz = async () => {
    if (!quizForm.title.trim()) return show({ ok: false, message: "A title is required." });
    if (!quizForm.questions.length) return show({ ok: false, message: "Add at least one question." });
    setBusy(true);
    try {
      const payload = {
        ...quizForm,
        videoId: quizForm.videoId || null,
        durationMinutes: Number(quizForm.durationMinutes) || 0,
        questions: quizForm.questions.map((question) => ({
          ...(question.id ? { id: question.id } : {}),
          question: question.question,
          options: question.options,
          answerIndex: Number(question.answerIndex) || 0,
          explanation: question.explanation,
          marks: Number(question.marks) || 1,
        })),
      };
      const result = quizForm.id
        ? await accountFetch<SaveResult>(`/api/admin/quizzes/${quizForm.id}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await accountFetch<SaveResult>("/api/admin/quizzes", { method: "POST", body: JSON.stringify(payload) });
      show(result);
      if (result.ok) {
        setQuizForm(emptyQuiz());
        await loadQuizzes();
      }
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not save the quiz." });
    } finally {
      setBusy(false);
    }
  };

  const removeQuiz = async (id: string) => {
    if (!window.confirm("Delete this quiz and its results?")) return;
    try {
      show(await accountFetch<SaveResult>(`/api/admin/quizzes/${id}`, { method: "DELETE" }));
      await loadQuizzes();
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not delete the quiz." });
    }
  };

  const moderate = async (id: string, patch: { status?: string }) => {
    try {
      show(await accountFetch<SaveResult>(`/api/admin/discussions/${id}`, { method: "PATCH", body: JSON.stringify(patch) }));
      await loadThreads();
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not update the comment." });
    }
  };

  const removeThread = async (id: string) => {
    if (!window.confirm("Delete this comment and its replies?")) return;
    try {
      show(await accountFetch<SaveResult>(`/api/admin/discussions/${id}`, { method: "DELETE" }));
      await loadThreads();
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not delete the comment." });
    }
  };

  const sendReply = async (comment: DiscussionView) => {
    if (!replyDraft.trim()) return;
    setBusy(true);
    try {
      const result = await accountFetch<SaveResult>("/api/admin/discussions", {
        method: "POST",
        body: JSON.stringify({
          body: replyDraft,
          parentId: comment.id,
          target: comment.target,
          targetId: comment.targetId,
        }),
      });
      show(result);
      if (result.ok) {
        setReplyDraft("");
        setReplyTo(null);
        await loadThreads();
      }
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not post the reply." });
    } finally {
      setBusy(false);
    }
  };

  const saveCopy = async () => {
    setBusy(true);
    try {
      show(await accountFetch<SaveResult>("/api/admin/video-quiz", { method: "PUT", body: JSON.stringify(copy) }));
      await loadCopy();
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not save the copy." });
    } finally {
      setBusy(false);
    }
  };

  const resetCopy = async () => {
    if (!window.confirm("Restore the original copy?")) return;
    try {
      show(await accountFetch<SaveResult>("/api/admin/video-quiz", { method: "DELETE" }));
      await loadCopy();
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not reset the copy." });
    }
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "videos", label: "Videos", count: videos.length },
    { key: "quizzes", label: "Quizzes", count: quizzes.length },
    { key: "discussions", label: "Discussions", count: discussionTotal },
    { key: "results", label: "Results", count: resultsTotal },
    { key: "homepage", label: "Homepage" },
    { key: "videoPage", label: "/video page" },
    { key: "quizPage", label: "/quiz page" },
  ];

  return (
    <div className="min-w-0 space-y-5">
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
        <Link href="/admin" className="hover:text-brand-700">Dashboard</Link>
        <span>/</span>
        <span className="font-semibold text-ink">{label}</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold text-ink">{label}</h1>
          <p className="mt-1 text-[12px] text-muted">
            Manage episodes, quizzes, discussions and results through the API.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/video" className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700">
            <Eye size={13} /> View videos
          </Link>
          <Link href="/quiz" className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700">
            <Trophy size={13} /> View quizzes
          </Link>
          <Link href="/admin" className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700">
            <ArrowLeft size={13} /> Dashboard
          </Link>
        </div>
      </div>

      <nav aria-label="Video and quiz sections" className="no-scrollbar flex gap-1 overflow-x-auto rounded-[8px] border border-line bg-white p-1">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => { setTab(item.key); setNotice(null); }}
            aria-current={tab === item.key ? "page" : undefined}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[5px] px-3 text-[11px] font-semibold transition-colors",
              tab === item.key ? "bg-brand-600 text-white" : "text-muted hover:bg-brand-50 hover:text-brand-700",
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className={cn("rounded-full px-1.5 py-0.5 text-[9px]", tab === item.key ? "bg-white/20" : "bg-brand-50 text-brand-700")}>
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {notice && (
        <div
          role="status"
          className={cn(
            "flex items-start gap-2 rounded-[6px] border px-4 py-3 text-[11px]",
            notice.ok ? "border-forest-600/20 bg-forest-50 text-forest-800" : "border-clay-500/25 bg-clay-500/5 text-clay-700",
          )}
        >
          {notice.ok ? <Check size={14} className="mt-0.5 shrink-0" /> : <AlertCircle size={14} className="mt-0.5 shrink-0" />}
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss" className="ml-auto text-[10px] opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {tab === "videos" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <div className="space-y-4">
            <Section title="Episodes" description="Create, edit and publish videos from YouTube or a local upload.">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <input
                  value={videoQuery}
                  onChange={(event) => setVideoQuery(event.target.value)}
                  placeholder="Search episodes…"
                  aria-label="Search episodes"
                  className={fieldClass}
                />
                <button type="button" onClick={() => setVideoForm(emptyVideo())} className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-3 text-[10px] font-semibold text-brand-700 hover:bg-brand-100">
                  <Plus size={12} /> New video
                </button>
              </div>
              <div className="grid gap-2.5">
                {filteredVideos.length === 0 && <p className="py-6 text-center text-[11px] text-muted">No episodes found.</p>}
                {filteredVideos.map((video) => (
                  <div key={video.id} className="rounded-[8px] border border-line bg-canvas/40 p-3">
                    <div className="flex gap-3">
                      <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded bg-forest-900">
                        {video.thumbnail && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={video.thumbnail} alt="" className="h-full w-full object-cover" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-[11px] font-semibold text-ink">EP {video.episode} · {video.title}</p>
                        <p className="mt-0.5 text-[9px] text-muted">{video.category} · {video.host} · {video.duration}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[9px]">
                          <span className={cn("rounded-full px-2 py-0.5 font-semibold", video.status === "published" ? "bg-forest-100 text-forest-800" : "bg-cream-200 text-muted")}>
                            {video.status}
                          </span>
                          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">{video.source}</span>
                          {video.featured && <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-gold-600">Featured</span>}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
                      <button type="button" onClick={() => setVideoForm(fromVideo(video))} className="inline-flex items-center gap-1 rounded-[4px] border border-line px-2.5 py-1.5 text-[10px] font-medium text-ink hover:border-brand-300">
                        <Pencil size={11} /> Edit
                      </button>
                      <button type="button" onClick={() => void toggleVideoStatus(video)} className="inline-flex items-center gap-1 rounded-[4px] border border-line px-2.5 py-1.5 text-[10px] font-medium text-ink hover:border-brand-300">
                        {video.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <Link href={`/videos/${video.slug}`} className="inline-flex items-center gap-1 rounded-[4px] border border-line px-2.5 py-1.5 text-[10px] font-medium text-ink hover:border-brand-300">
                        <Eye size={11} /> View
                      </Link>
                      <button type="button" onClick={() => void removeVideo(video.id)} className="inline-flex items-center gap-1 rounded-[4px] border border-line px-2.5 py-1.5 text-[10px] font-medium text-clay-600 hover:border-clay-400">
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          <Section title={videoForm.id ? "Edit video" : "New video"} description="Both sources use the same record — choose one below.">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={subLabel} htmlFor="video-title">Title</label>
                <input id="video-title" className={fieldClass} value={videoForm.title} onChange={(event) => setVideoForm({ ...videoForm, title: event.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={subLabel} htmlFor="video-description">Description</label>
                <textarea id="video-description" rows={3} className={fieldClass} value={videoForm.description} onChange={(event) => setVideoForm({ ...videoForm, description: event.target.value })} />
              </div>
              <div>
                <label className={subLabel} htmlFor="video-category">Category</label>
                <input id="video-category" className={fieldClass} value={videoForm.category} onChange={(event) => setVideoForm({ ...videoForm, category: event.target.value })} />
              </div>
              <div>
                <label className={subLabel} htmlFor="video-host">Host</label>
                <input id="video-host" className={fieldClass} value={videoForm.host} onChange={(event) => setVideoForm({ ...videoForm, host: event.target.value })} />
              </div>
              <div>
                <label className={subLabel} htmlFor="video-episode">Episode number</label>
                <input id="video-episode" type="number" min={0} className={fieldClass} value={videoForm.episode} onChange={(event) => setVideoForm({ ...videoForm, episode: event.target.value })} />
              </div>
              <div>
                <label className={subLabel} htmlFor="video-duration">Duration</label>
                <input id="video-duration" className={fieldClass} value={videoForm.duration} onChange={(event) => setVideoForm({ ...videoForm, duration: event.target.value })} />
              </div>
              <div>
                <label className={subLabel} htmlFor="video-views">Views label</label>
                <input id="video-views" className={fieldClass} value={videoForm.views} onChange={(event) => setVideoForm({ ...videoForm, views: event.target.value })} />
              </div>
              <div>
                <label className={subLabel} htmlFor="video-status">Status</label>
                <select id="video-status" className={fieldClass} value={videoForm.status} onChange={(event) => setVideoForm({ ...videoForm, status: event.target.value as VideoForm["status"] })}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <span className={subLabel}>Thumbnail</span>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[10px] font-semibold text-ink hover:border-brand-300">
                    {busyUpload === "image" ? "Uploading…" : <><ImagePlus size={12} /> Upload image</>}
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => void uploadImage(event.target.files?.[0])} />
                  </label>
                  <input className={fieldClass} placeholder="or /media path" value={videoForm.thumbnail} onChange={(event) => setVideoForm({ ...videoForm, thumbnail: event.target.value })} aria-label="Thumbnail URL" />
                </div>
                {videoForm.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={videoForm.thumbnail} alt="Thumbnail preview" className="mt-2 h-20 w-32 rounded object-cover" />
                )}
              </div>
              <div className="sm:col-span-2">
                <span className={subLabel}>Video source</span>
                <div className="flex gap-2">
                  {(["youtube", "upload"] as const).map((source) => (
                    <button
                      key={source}
                      type="button"
                      onClick={() => setVideoForm({ ...videoForm, source })}
                      className={cn("flex-1 rounded-[4px] border px-3 py-2 text-[10px] font-semibold capitalize", videoForm.source === source ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line bg-white text-muted")}
                    >
                      {source === "youtube" ? "YouTube link" : "Upload file"}
                    </button>
                  ))}
                </div>
              </div>
              {videoForm.source === "youtube" ? (
                <div className="sm:col-span-2">
                  <label className={subLabel} htmlFor="video-youtube">YouTube URL or id</label>
                  <input id="video-youtube" className={fieldClass} placeholder="https://www.youtube.com/watch?v=…" value={videoForm.youtubeUrl} onChange={(event) => setVideoForm({ ...videoForm, youtubeUrl: event.target.value })} />
                  <p className={cn("mt-1 text-[9px]", parseYouTubeId(videoForm.youtubeUrl) ? "text-forest-700" : "text-clay-600")}>
                    {parseYouTubeId(videoForm.youtubeUrl)
                      ? `Valid ID: ${parseYouTubeId(videoForm.youtubeUrl)}`
                      : "Paste a YouTube URL or an 11-character video id."}
                  </p>
                  {parseYouTubeId(videoForm.youtubeUrl) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`https://img.youtube.com/vi/${parseYouTubeId(videoForm.youtubeUrl)}/hqdefault.jpg`} alt="YouTube thumbnail preview" className="mt-2 h-20 w-32 rounded object-cover" />
                  )}
                </div>
              ) : (
                <div className="sm:col-span-2">
                  <span className={subLabel}>Video file (MP4 or WebM — size limit enforced on the server)</span>
                  <label className="inline-flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[4px] border border-dashed border-brand-300 bg-brand-50 px-3 text-[10px] font-semibold text-brand-700 hover:bg-brand-100">
                    {busyUpload === "video" ? "Uploading — please wait…" : <><UploadCloud size={12} /> Choose video file</>}
                    <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={(event) => void uploadVideo(event.target.files?.[0])} />
                  </label>
                  <input className={cn(fieldClass, "mt-2")} placeholder="uploaded /media/video/… URL" value={videoForm.videoUrl} onChange={(event) => setVideoForm({ ...videoForm, videoUrl: event.target.value })} aria-label="Video URL" />
                  {videoForm.videoUrl && (
                    <a href={videoForm.videoUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-[9px] font-semibold text-brand-700 hover:underline">
                      <FileVideo size={11} /> Open uploaded file
                    </a>
                  )}
                </div>
              )}
              <label className="flex items-center gap-2 text-[11px] text-ink">
                <input type="checkbox" checked={videoForm.featured} onChange={(event) => setVideoForm({ ...videoForm, featured: event.target.checked })} className="h-3.5 w-3.5 accent-brand-600" />
                Feature this episode
              </label>
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <button type="button" onClick={() => void saveVideo()} disabled={busy} className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
                  <Save size={13} /> {busy ? "Saving…" : videoForm.id ? "Update video" : "Create video"}
                </button>
                <button type="button" onClick={() => setVideoForm(emptyVideo())} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-semibold text-ink hover:border-brand-300">
                  <RotateCcw size={12} /> Clear
                </button>
              </div>
            </div>
          </Section>
        </div>
      )}

      {tab === "quizzes" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <div className="space-y-4">
            <Section title="Quizzes" description="Create quizzes, attach questions and configure marks.">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <input value={quizQuery} onChange={(event) => setQuizQuery(event.target.value)} placeholder="Search quizzes…" aria-label="Search quizzes" className={fieldClass} />
                <button type="button" onClick={() => setQuizForm(emptyQuiz())} className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-3 text-[10px] font-semibold text-brand-700 hover:bg-brand-100">
                  <Plus size={12} /> New quiz
                </button>
              </div>
              <div className="grid gap-2.5">
                {filteredQuizzes.length === 0 && <p className="py-6 text-center text-[11px] text-muted">No quizzes found.</p>}
                {filteredQuizzes.map((quiz) => (
                  <div key={quiz.id} className="rounded-[8px] border border-line bg-canvas/40 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-[11px] font-semibold text-ink">{quiz.title}</p>
                        <p className="mt-0.5 text-[9px] text-muted">
                          {quiz.type} · {quiz.questionCount} questions · {quiz.totalMarks} marks · {quiz.durationMinutes || 2} min
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5 text-[9px]">
                          <span className={cn("rounded-full px-2 py-0.5 font-semibold", quiz.status === "published" ? "bg-forest-100 text-forest-800" : "bg-cream-200 text-muted")}>{quiz.status}</span>
                          {quiz.featured && <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-gold-600">Featured</span>}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
                      <button type="button" onClick={() => setQuizForm(fromQuiz(quiz))} className="inline-flex items-center gap-1 rounded-[4px] border border-line px-2.5 py-1.5 text-[10px] font-medium text-ink hover:border-brand-300"><Pencil size={11} /> Edit</button>
                      <Link href={`/quiz?tab=${quiz.type === "watch" ? "watch" : "book"}`} className="inline-flex items-center gap-1 rounded-[4px] border border-line px-2.5 py-1.5 text-[10px] font-medium text-ink hover:border-brand-300"><Eye size={11} /> View</Link>
                      <button type="button" onClick={() => void removeQuiz(quiz.id)} className="inline-flex items-center gap-1 rounded-[4px] border border-line px-2.5 py-1.5 text-[10px] font-medium text-clay-600 hover:border-clay-400"><Trash2 size={11} /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          <Section title={quizForm.id ? "Edit quiz" : "New quiz"} description="Questions are saved with the quiz in one API call.">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={subLabel} htmlFor="quiz-title">Title</label>
                <input id="quiz-title" className={fieldClass} value={quizForm.title} onChange={(event) => setQuizForm({ ...quizForm, title: event.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={subLabel} htmlFor="quiz-description">Description</label>
                <textarea id="quiz-description" rows={2} className={fieldClass} value={quizForm.description} onChange={(event) => setQuizForm({ ...quizForm, description: event.target.value })} />
              </div>
              <div>
                <label className={subLabel} htmlFor="quiz-category">Category</label>
                <input id="quiz-category" className={fieldClass} value={quizForm.category} onChange={(event) => setQuizForm({ ...quizForm, category: event.target.value })} />
              </div>
              <div>
                <label className={subLabel} htmlFor="quiz-type">Type</label>
                <select id="quiz-type" className={fieldClass} value={quizForm.type} onChange={(event) => setQuizForm({ ...quizForm, type: event.target.value as QuizForm["type"] })}>
                  <option value="book">Book</option>
                  <option value="watch">Watch</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={subLabel} htmlFor="quiz-video">Related video (optional)</label>
                <select id="quiz-video" className={fieldClass} value={quizForm.videoId} onChange={(event) => setQuizForm({ ...quizForm, videoId: event.target.value })}>
                  <option value="">None</option>
                  {videos.map((video) => <option key={video.id} value={video.id}>EP {video.episode} · {video.title}</option>)}
                </select>
              </div>
              <div>
                <label className={subLabel} htmlFor="quiz-duration">Duration (minutes)</label>
                <input id="quiz-duration" type="number" min={0} className={fieldClass} value={quizForm.durationMinutes} onChange={(event) => setQuizForm({ ...quizForm, durationMinutes: event.target.value })} />
              </div>
              <div>
                <label className={subLabel} htmlFor="quiz-status">Status</label>
                <select id="quiz-status" className={fieldClass} value={quizForm.status} onChange={(event) => setQuizForm({ ...quizForm, status: event.target.value as QuizForm["status"] })}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={subLabel} htmlFor="quiz-instructions">Instructions</label>
                <textarea id="quiz-instructions" rows={2} className={fieldClass} value={quizForm.instructions} onChange={(event) => setQuizForm({ ...quizForm, instructions: event.target.value })} />
              </div>
              <label className="flex items-center gap-2 text-[11px] text-ink sm:col-span-2">
                <input type="checkbox" checked={quizForm.featured} onChange={(event) => setQuizForm({ ...quizForm, featured: event.target.checked })} className="h-3.5 w-3.5 accent-brand-600" />
                Feature this quiz
              </label>
            </div>

            <div className="border-t border-line pt-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[12px] font-semibold text-ink">Questions ({quizForm.questions.length})</h3>
                <button type="button" onClick={() => setQuizForm({ ...quizForm, questions: [...quizForm.questions, { question: "", options: ["", "", "", ""], answerIndex: "0", explanation: "", marks: "1" }] })} className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 hover:underline">
                  <Plus size={11} /> Add question
                </button>
              </div>
              <div className="mt-3 space-y-3">
                {quizForm.questions.map((question, questionIndex) => (
                  <div key={question.id ?? `new-${questionIndex}`} className="rounded-[8px] border border-line bg-canvas/40 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-muted">Question {questionIndex + 1}</span>
                      <button type="button" onClick={() => setQuizForm({ ...quizForm, questions: quizForm.questions.filter((_, i) => i !== questionIndex) })} aria-label={`Remove question ${questionIndex + 1}`} className="text-muted hover:text-clay-600"><Trash2 size={12} /></button>
                    </div>
                    <textarea
                      rows={2}
                      className={cn(fieldClass, "mt-2")}
                      placeholder="Question text"
                      value={question.question}
                      onChange={(event) => setQuizForm({ ...quizForm, questions: quizForm.questions.map((item, i) => i === questionIndex ? { ...item, question: event.target.value } : item) })}
                    />
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {question.options.map((option, optionIndex) => (
                        <input
                          key={optionIndex}
                          className={fieldClass}
                          placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                          value={option}
                          onChange={(event) => setQuizForm({ ...quizForm, questions: quizForm.questions.map((item, i) => i === questionIndex ? { ...item, options: item.options.map((value, oi) => oi === optionIndex ? event.target.value : value) } : item) })}
                        />
                      ))}
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[10px] text-muted">Correct answer</label>
                        <select
                          className={fieldClass}
                          value={question.answerIndex}
                          onChange={(event) => setQuizForm({ ...quizForm, questions: quizForm.questions.map((item, i) => i === questionIndex ? { ...item, answerIndex: event.target.value } : item) })}
                        >
                          {question.options.map((_, optionIndex) => (
                            <option key={optionIndex} value={String(optionIndex)}>{String.fromCharCode(65 + optionIndex)}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] text-muted">Marks</label>
                        <input type="number" min={1} className={fieldClass} value={question.marks} onChange={(event) => setQuizForm({ ...quizForm, questions: quizForm.questions.map((item, i) => i === questionIndex ? { ...item, marks: event.target.value } : item) })} />
                      </div>
                    </div>
                    <input className={cn(fieldClass, "mt-2")} placeholder="Explanation (optional)" value={question.explanation} onChange={(event) => setQuizForm({ ...quizForm, questions: quizForm.questions.map((item, i) => i === questionIndex ? { ...item, explanation: event.target.value } : item) })} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => void saveQuiz()} disabled={busy} className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
                <Save size={13} /> {busy ? "Saving…" : quizForm.id ? "Update quiz" : "Create quiz"}
              </button>
              <button type="button" onClick={() => setQuizForm(emptyQuiz())} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-semibold text-ink hover:border-brand-300">
                <RotateCcw size={12} /> Clear
              </button>
            </div>
          </Section>
        </div>
      )}

      {tab === "discussions" && (
        <Section title="Discussions" description="Read comments, reply as an admin, hide or delete spam.">
          <div className="grid gap-2 sm:grid-cols-[1fr_170px]">
            <input value={discussionQuery} onChange={(event) => { setDiscussionQuery(event.target.value); setDiscussionOffset(0); }} placeholder="Search comments…" aria-label="Search comments" className={fieldClass} />
            <select value={discussionTarget} onChange={(event) => { setDiscussionTarget(event.target.value); setDiscussionOffset(0); }} aria-label="Filter by target" className={fieldClass}>
              <option value="">All targets</option>
              <option value="video">Videos</option>
              <option value="quiz">Quizzes</option>
            </select>
          </div>
          <div className="grid gap-2.5">
            {threads.length === 0 && <p className="py-6 text-center text-[11px] text-muted">No comments found.</p>}
            {threads.filter((thread) => !thread.parentId).map((thread) => {
              const replies = threads.filter((item) => item.parentId === thread.id);
              return (
                <div key={thread.id} className="rounded-[8px] border border-line bg-canvas/40 p-3">
                  <div className="flex flex-wrap items-center gap-2 text-[9px]">
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">{thread.target}</span>
                    <span className="font-semibold text-ink">{thread.userName}</span>
                    {thread.isAdmin && <span className="rounded-full bg-forest-900 px-2 py-0.5 font-semibold text-gold-300">Admin</span>}
                    <span className="text-muted">{new Date(thread.createdAt).toLocaleDateString("en-BD")}</span>
                    <span className={cn("rounded-full px-2 py-0.5", thread.status === "hidden" ? "bg-clay-500/10 text-clay-700" : "bg-forest-100 text-forest-800")}>{thread.status}</span>
                  </div>
                  <p className="mt-2 break-words text-[11px] leading-relaxed text-body">{thread.body}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <button type="button" onClick={() => { setReplyTo(replyTo === thread.id ? null : thread.id); setReplyDraft(""); }} className="inline-flex items-center gap-1 rounded-[4px] border border-line bg-white px-2.5 py-1.5 text-[10px] font-medium text-ink hover:border-brand-300">
                      <MessageCircle size={11} /> Reply
                    </button>
                    <button type="button" onClick={() => void moderate(thread.id, { status: thread.status === "visible" ? "hidden" : "visible" })} className="rounded-[4px] border border-line bg-white px-2.5 py-1.5 text-[10px] font-medium text-ink hover:border-brand-300">
                      {thread.status === "visible" ? "Hide" : "Show"}
                    </button>
                    <button type="button" onClick={() => void removeThread(thread.id)} className="inline-flex items-center gap-1 rounded-[4px] border border-line bg-white px-2.5 py-1.5 text-[10px] font-medium text-clay-600 hover:border-clay-400">
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                  {replies.map((reply) => (
                    <div key={reply.id} className="ml-3 mt-2 border-l-2 border-brand-100 pl-3 sm:ml-5">
                      <div className="flex flex-wrap items-center gap-2 text-[9px]">
                        <span className="font-semibold text-ink">{reply.userName}</span>
                        {reply.isAdmin && <span className="rounded-full bg-forest-900 px-2 py-0.5 font-semibold text-gold-300">Admin reply</span>}
                        <span className="text-muted">{new Date(reply.createdAt).toLocaleDateString("en-BD")}</span>
                      </div>
                      <p className="mt-1 break-words text-[10px] leading-relaxed text-body">{reply.body}</p>
                      <button type="button" onClick={() => void removeThread(reply.id)} className="mt-1 inline-flex items-center gap-1 text-[9px] text-clay-600 hover:underline"><Trash2 size={10} /> Delete</button>
                    </div>
                  ))}
                  {replyTo === thread.id && (
                    <div className="mt-3 rounded-[6px] border border-brand-100 bg-white p-3">
                      <label className={subLabel} htmlFor={`reply-${thread.id}`}>Admin reply</label>
                      <textarea id={`reply-${thread.id}`} rows={2} className={fieldClass} value={replyDraft} onChange={(event) => setReplyDraft(event.target.value)} placeholder="Write a reply…" />
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button type="button" onClick={() => void sendReply(thread)} disabled={busy || !replyDraft.trim()} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-3 text-[10px] font-semibold text-white disabled:opacity-50"><Send size={11} /> Post reply</button>
                        <button type="button" onClick={() => setReplyTo(null)} className="h-9 rounded-[4px] border border-line px-3 text-[10px] font-semibold text-ink">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Pager offset={discussionOffset} limit={20} total={discussionTotal} onChange={setDiscussionOffset} />
        </Section>
      )}

      {tab === "results" && (
        <Section title="Quiz results" description="Every submission is scored on the server. Only the best score per reader is ranked.">
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-[8px] border border-line bg-brand-50 p-3">
              <p className="text-[9px] text-muted">Total submissions</p>
              <p className="mt-1 font-display text-xl font-bold text-ink">{resultsTotal}</p>
            </div>
            <div className="rounded-[8px] border border-line bg-cream-50 p-3">
              <p className="text-[9px] text-muted">Average score</p>
              <p className="mt-1 font-display text-xl font-bold text-ink">
                {attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.percentage, 0) / attempts.length) : 0}%
              </p>
            </div>
            <div className="rounded-[8px] border border-line bg-gold-500/10 p-3">
              <p className="text-[9px] text-muted">Top result</p>
              <p className="mt-1 font-display text-xl font-bold text-ink">
                {attempts.length ? Math.max(...attempts.map((item) => item.percentage)) : 0}%
              </p>
            </div>
          </div>
          <div className="grid gap-2.5">
            {attempts.length === 0 && <p className="py-6 text-center text-[11px] text-muted">No submissions yet.</p>}
            {attempts.map((attempt) => (
              <div key={attempt.id} className="flex flex-wrap items-center justify-between gap-2 rounded-[8px] border border-line bg-canvas/40 p-3">
                <div className="min-w-0">
                  <p className="line-clamp-1 text-[11px] font-semibold text-ink">{attempt.quizTitle}</p>
                  <p className="text-[9px] text-muted">{new Date(attempt.createdAt).toLocaleString("en-BD")}</p>
                </div>
                <span className="rounded-full bg-gold-500/15 px-3 py-1 text-[10px] font-bold text-gold-600">
                  {attempt.score}/{attempt.totalMarks} · {attempt.percentage}%
                </span>
              </div>
            ))}
          </div>
          <Pager offset={resultsOffset} limit={20} total={resultsTotal} onChange={setResultsOffset} />
        </Section>
      )}

      {(tab === "homepage" || tab === "videoPage" || tab === "quizPage") && (
        <div className="space-y-4">
          <Section
            title={tab === "homepage" ? "Homepage section" : tab === "videoPage" ? "/video page" : "/quiz page"}
            description="Copy is saved to content_blocks('video-quiz') through the admin API."
          >
            {tab === "homepage" && (
              <div className="grid gap-3 sm:grid-cols-2">
                {(["eyebrow", "title", "description", "linkLabel"] as const).map((key) => (
                  <div key={key} className={key === "description" || key === "title" ? "sm:col-span-2" : ""}>
                    <label className={subLabel} htmlFor={`section-${key}`}>{key}</label>
                    <input id={`section-${key}`} className={fieldClass} value={copy.section[key]} onChange={(event) => setCopy({ ...copy, section: { ...copy.section, [key]: event.target.value } })} />
                  </div>
                ))}
                {(Object.keys(copy.home) as (keyof typeof copy.home)[]).map((key) => (
                  <div key={key} className={key === "description" || key === "demoNote" ? "sm:col-span-2" : ""}>
                    <label className={subLabel} htmlFor={`home-${key}`}>{key}</label>
                    <input id={`home-${key}`} className={fieldClass} value={copy.home[key]} onChange={(event) => setCopy({ ...copy, home: { ...copy.home, [key]: event.target.value } })} />
                  </div>
                ))}
              </div>
            )}
            {tab === "videoPage" && (
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(copy.videoPage) as (keyof typeof copy.videoPage)[]).map((key) => {
                  if (key === "pills") {
                    return <div key={key} className="sm:col-span-2"><StringList label="pills" values={copy.videoPage.pills} onChange={(values) => setCopy({ ...copy, videoPage: { ...copy.videoPage, pills: values } })} /></div>;
                  }
                  return (
                    <div key={key} className={["description", "promoText"].includes(key) ? "sm:col-span-2" : ""}>
                      <label className={subLabel} htmlFor={`video-page-${key}`}>{key}</label>
                      <input id={`video-page-${key}`} className={fieldClass} value={copy.videoPage[key]} onChange={(event) => setCopy({ ...copy, videoPage: { ...copy.videoPage, [key]: event.target.value } })} />
                    </div>
                  );
                })}
              </div>
            )}
            {tab === "quizPage" && (
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(copy.quizPage) as (keyof typeof copy.quizPage)[]).map((key) => {
                  if (key === "pills") {
                    return <div key={key} className="sm:col-span-2"><StringList label="pills" values={copy.quizPage.pills} onChange={(values) => setCopy({ ...copy, quizPage: { ...copy.quizPage, pills: values } })} /></div>;
                  }
                  return (
                    <div key={key} className={key === "description" ? "sm:col-span-2" : ""}>
                      <label className={subLabel} htmlFor={`quiz-page-${key}`}>{key}</label>
                      <input id={`quiz-page-${key}`} className={fieldClass} value={copy.quizPage[key]} onChange={(event) => setCopy({ ...copy, quizPage: { ...copy.quizPage, [key]: event.target.value } })} />
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex flex-wrap gap-2 border-t border-line pt-4">
              <button type="button" onClick={() => void saveCopy()} disabled={busy} className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
                <Save size={13} /> {busy ? "Saving…" : "Save copy"}
              </button>
              <button type="button" onClick={() => void resetCopy()} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-semibold text-ink hover:border-brand-300">
                <RotateCcw size={12} /> Restore default
              </button>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
