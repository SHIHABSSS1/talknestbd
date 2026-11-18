"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Eye,
  ImagePlus,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { useVideoQuiz } from "@/components/providers/VideoQuizProvider";
import {
  cloneVideoQuizDefaults,
  type VideoComment,
  type VideoQuizContent,
  type VideoQuizQuestion,
} from "@/lib/video-quiz-content";
import { dataUrlSizeLabel, fileToDataUrl } from "@/lib/image";
import type { TalkVideo } from "@/lib/types";
import { cn, toBn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";

type Notice = { text: string; error?: boolean };
type Tab = "videos" | "quizzes" | "comments" | "homepage" | "videoPage" | "quizPage";

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-[10px] border border-line bg-white">
      <div className="border-b border-line px-4 py-3.5 sm:px-5">
        <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
        {description && <p className="text-[10px] text-muted">{description}</p>}
      </div>
      <div className="space-y-3 p-4 sm:p-5">{children}</div>
    </section>
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
            <button type="button" onClick={() => onChange(values.filter((_, i) => i !== index))} className="rounded-[4px] p-2 text-muted hover:text-brand-700">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function newVideo(index: number): TalkVideo {
  return {
    id: `v-${Date.now()}`,
    title: "New episode",
    category: "Interview",
    duration: "18:00",
    views: "1.0K views",
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=640&q=80",
    youtubeId: "M7lc1UVf-VE",
    host: "TalkNest",
    episode: index + 1,
    featured: false,
  };
}

function newQuestion(videoId = ""): VideoQuizQuestion {
  return {
    id: `q-${Date.now()}`,
    question: "New question?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    answerIndex: 0,
    explanation: "",
    videoId,
  };
}

export function VideoQuizEditor({ label }: { label: string }) {
  const { content, save, reset } = useVideoQuiz();
  const [draft, setDraft] = useState<VideoQuizContent>(content);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [tab, setTab] = useState<Tab>("videos");
  const [editingVideo, setEditingVideo] = useState<TalkVideo | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => setDraft(content), [content]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(content);

  const updateVideo = (id: string, patch: Partial<TalkVideo>) => {
    setDraft((current) => ({
      ...current,
      videos: current.videos.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
    setNotice(null);
  };

  const addVideo = () => {
    const video = newVideo(draft.videos.length);
    setDraft((current) => ({ ...current, videos: [...current.videos, video] }));
    setEditingVideo(video);
    setNotice(null);
  };

  const removeVideo = (id: string) => {
    setDraft((current) => ({
      ...current,
      videos: current.videos.filter((item) => item.id !== id),
      quizzes: current.quizzes.filter((item) => item.videoId !== id),
    }));
    setNotice(null);
  };

  const updateQuestion = (id: string, patch: Partial<VideoQuizQuestion>) => {
    setDraft((current) => ({
      ...current,
      quizzes: current.quizzes.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
    setNotice(null);
  };

  const addQuestion = (videoId: string) => {
    setDraft((current) => ({ ...current, quizzes: [...current.quizzes, newQuestion(videoId)] }));
    setNotice(null);
  };

  const removeQuestion = (id: string) => {
    setDraft((current) => ({
      ...current,
      quizzes: current.quizzes.filter((item) => item.id !== id),
    }));
    setNotice(null);
  };

  const removeComment = (id: string) => {
    setDraft((current) => ({
      ...current,
      comments: current.comments.filter((item) => item.id !== id),
    }));
    setNotice(null);
  };

  const uploadThumbnail = async (file: File | undefined) => {
    if (!file || !editingVideo) return;
    setUploading(true);
    setNotice(null);
    try {
      const thumbnail = await fileToDataUrl(file);
      setEditingVideo((current) => (current ? { ...current, thumbnail } : current));
      setNotice({ text: `Cover compressed (${dataUrlSizeLabel(thumbnail)}). Save the video to publish.` });
    } catch (error) {
      setNotice({ error: true, text: error instanceof Error ? error.message : "Could not read image." });
    } finally {
      setUploading(false);
    }
  };

  const setGroup = <K extends keyof VideoQuizContent>(
    key: K,
    value: VideoQuizContent[K],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setNotice(null);
  };

  const handleSave = () => {
    const result = save(draft);
    setNotice({ text: result.message, error: !result.ok });
  };

  const handleReset = () => {
    const result = reset();
    setDraft(cloneVideoQuizDefaults());
    setEditingVideo(null);
    setNotice({ text: result.message, error: !result.ok });
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "videos", label: "Videos", count: draft.videos.length },
    { key: "quizzes", label: "Quizzes", count: draft.quizzes.length },
    { key: "comments", label: "Comments", count: draft.comments.length },
    { key: "homepage", label: "Homepage" },
    { key: "videoPage", label: "/video page" },
    { key: "quizPage", label: "/quiz page" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
        <Link href="/admin" className="hover:text-brand-700">Dashboard</Link>
        <span>/</span>
        <span>Homepage sections</span>
        <span>/</span>
        <span className="font-semibold text-ink">{label}</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{label}</h1>
          <p className="mt-1 text-[12px] text-muted">
            Manage episodes, attach quizzes to each video, and moderate the discussion.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/video" className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700">
            <Eye size={13} /> View videos
          </Link>
          <Link href="/admin" className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700">
            <ArrowLeft size={13} /> Back to dashboard
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 overflow-x-auto rounded-[8px] border border-line bg-white p-1">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cn(
              "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[5px] px-3 text-[11px] font-semibold transition-colors",
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
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {tab === "videos" && (
            <Section title="Episodes" description="Add, edit and remove videos. Each can carry its own quiz questions.">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] text-muted">{draft.videos.length} episodes</p>
                <button type="button" onClick={addVideo} className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100">
                  <Plus size={12} /> Add video
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line text-[9px] uppercase tracking-wide text-muted">
                      <th className="px-2 py-2 font-semibold">Episode</th>
                      <th className="px-2 py-2 font-semibold">Category</th>
                      <th className="px-2 py-2 font-semibold">Questions</th>
                      <th className="px-2 py-2 font-semibold">Featured</th>
                      <th className="px-2 py-2 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.videos.map((video) => (
                      <tr key={video.id} className="border-b border-line/70 last:border-0">
                        <td className="px-2 py-2">
                          <button type="button" onClick={() => setEditingVideo(video)} className="flex items-center gap-2 text-left">
                            <span className="h-10 w-16 shrink-0 overflow-hidden rounded-[3px] bg-brand-100">
                              {video.thumbnail.startsWith("data:") ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={video.thumbnail} alt="" className="h-full w-full object-cover" />
                              ) : null}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-[11px] font-semibold text-ink">#{toBn(video.episode)} {video.title}</span>
                              <span className="block text-[9px] text-muted">{video.duration} · {video.host}</span>
                            </span>
                          </button>
                        </td>
                        <td className="px-2 py-2 text-[10px] text-muted">{video.category}</td>
                        <td className="px-2 py-2 text-[10px] text-muted">{draft.quizzes.filter((q) => q.videoId === video.id).length}</td>
                        <td className="px-2 py-2">
                          <input type="checkbox" checked={video.featured} onChange={(event) => updateVideo(video.id, { featured: event.target.checked })} className="h-3.5 w-3.5 accent-brand-600" />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <div className="inline-flex gap-1">
                            <button type="button" onClick={() => { setTab("quizzes"); }} className="rounded-[4px] border border-line px-2 py-1.5 text-[9px] font-medium text-ink hover:border-brand-300">Quiz</button>
                            <button type="button" onClick={() => setEditingVideo(video)} className="rounded-[4px] border border-line px-2 py-1.5 text-[9px] font-medium text-ink hover:border-brand-300">Edit</button>
                            <button type="button" onClick={() => removeVideo(video.id)} className="rounded-[4px] p-1.5 text-muted hover:text-brand-700" title="Delete video">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {editingVideo && tab === "videos" && (
            <Section title={draft.videos.some((item) => item.id === editingVideo.id) ? "Edit video" : "New video"}>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block">
                  <span className={subLabel}>Title</span>
                  <input value={editingVideo.title} onChange={(event) => setEditingVideo({ ...editingVideo, title: event.target.value })} className={fieldClass} />
                </label>
                <label className="block">
                  <span className={subLabel}>Category</span>
                  <input value={editingVideo.category} onChange={(event) => setEditingVideo({ ...editingVideo, category: event.target.value })} className={fieldClass} />
                </label>
                <label className="block">
                  <span className={subLabel}>Duration</span>
                  <input value={editingVideo.duration} onChange={(event) => setEditingVideo({ ...editingVideo, duration: event.target.value })} className={fieldClass} />
                </label>
                <label className="block">
                  <span className={subLabel}>Views</span>
                  <input value={editingVideo.views} onChange={(event) => setEditingVideo({ ...editingVideo, views: event.target.value })} className={fieldClass} />
                </label>
                <label className="block">
                  <span className={subLabel}>YouTube ID</span>
                  <input value={editingVideo.youtubeId} onChange={(event) => setEditingVideo({ ...editingVideo, youtubeId: event.target.value })} className={fieldClass} />
                </label>
                <label className="block">
                  <span className={subLabel}>Host</span>
                  <input value={editingVideo.host} onChange={(event) => setEditingVideo({ ...editingVideo, host: event.target.value })} className={fieldClass} />
                </label>
                <label className="block">
                  <span className={subLabel}>Episode #</span>
                  <input type="number" min={1} value={editingVideo.episode} onChange={(event) => setEditingVideo({ ...editingVideo, episode: Number(event.target.value) })} className={fieldClass} />
                </label>
              </div>
              <label className="block">
                <span className={subLabel}>Thumbnail URL</span>
                <input value={editingVideo.thumbnail.startsWith("data:") ? "Uploaded image" : editingVideo.thumbnail} onChange={(event) => setEditingVideo({ ...editingVideo, thumbnail: event.target.value })} className={fieldClass} />
              </label>
              <div className="rounded-[8px] border border-line bg-canvas/60 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-ink">Thumbnail</span>
                  <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[4px] border border-line bg-white px-2.5 text-[10px] font-medium text-ink hover:border-brand-300">
                    <ImagePlus size={12} />
                    {uploading ? "Compressing…" : "Upload image"}
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => uploadThumbnail(event.target.files?.[0])} />
                  </label>
                </div>
                {editingVideo.thumbnail.startsWith("data:") && (
                  <p className="text-[9px] text-muted">Uploaded · {dataUrlSizeLabel(editingVideo.thumbnail)}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 border-t border-line pt-3">
                <button
                  type="button"
                  onClick={() => {
                    const exists = draft.videos.some((item) => item.id === editingVideo.id);
                    setDraft((current) => ({
                      ...current,
                      videos: exists
                        ? current.videos.map((item) => (item.id === editingVideo.id ? editingVideo : item))
                        : [...current.videos, editingVideo],
                    }));
                    setEditingVideo(null);
                    setNotice({ text: "Video saved. Save all changes to publish." });
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700"
                >
                  <Save size={13} /> Save video
                </button>
                <button type="button" onClick={() => setEditingVideo(null)} className="inline-flex h-9 items-center rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300">
                  Cancel
                </button>
              </div>
            </Section>
          )}

          {tab === "quizzes" && (
            <Section title="Quiz questions" description="Attach questions to a specific video, or leave video blank for the general book quiz.">
              {draft.videos.map((video) => {
                const questions = draft.quizzes.filter((item) => item.videoId === video.id);
                return (
                  <div key={video.id} className="rounded-[8px] border border-line p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-[11px] font-semibold text-ink">{video.title}</p>
                      <button type="button" onClick={() => addQuestion(video.id)} className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 hover:underline">
                        <Plus size={11} /> Add question
                      </button>
                    </div>
                    <div className="space-y-2">
                      {questions.map((question) => (
                        <div key={question.id} className="rounded-[6px] border border-line bg-canvas/50 p-2">
                          <div className="flex items-start gap-1.5">
                            <textarea
                              value={question.question}
                              onChange={(event) => updateQuestion(question.id, { question: event.target.value })}
                              rows={2}
                              className={`${fieldClass} resize-y`}
                            />
                            <button type="button" onClick={() => removeQuestion(question.id)} className="rounded-[4px] p-2 text-muted hover:text-brand-700">
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                            {question.options.map((option, index) => (
                              <input
                                key={index}
                                value={option}
                                onChange={(event) => {
                                  const options = [...question.options];
                                  options[index] = event.target.value;
                                  updateQuestion(question.id, { options });
                                }}
                                className={fieldClass}
                              />
                            ))}
                          </div>
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            <label className="block">
                              <span className={subLabel}>Correct option</span>
                              <select value={question.answerIndex} onChange={(event) => updateQuestion(question.id, { answerIndex: Number(event.target.value) })} className={fieldClass}>
                                {question.options.map((_, index) => (
                                  <option key={index} value={index}>Option {String.fromCharCode(65 + index)}</option>
                                ))}
                              </select>
                            </label>
                            <label className="block">
                              <span className={subLabel}>Explanation</span>
                              <input value={question.explanation} onChange={(event) => updateQuestion(question.id, { explanation: event.target.value })} className={fieldClass} />
                            </label>
                          </div>
                        </div>
                      ))}
                      {questions.length === 0 && <p className="text-[9px] text-muted">No questions for this video yet.</p>}
                    </div>
                  </div>
                );
              })}
              <button type="button" onClick={() => addQuestion("")} className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100">
                <Plus size={12} /> Add general question
              </button>
              {draft.quizzes.filter((item) => !item.videoId).length > 0 && (
                <div className="rounded-[8px] border border-line p-3">
                  <p className="mb-2 text-[11px] font-semibold text-ink">General book quiz</p>
                  {draft.quizzes.filter((item) => !item.videoId).map((question) => (
                    <div key={question.id} className="mb-2 flex items-center gap-2 rounded-[6px] border border-line bg-canvas/50 p-2">
                      <input value={question.question} onChange={(event) => updateQuestion(question.id, { question: event.target.value })} className={fieldClass} />
                      <select value={question.answerIndex} onChange={(event) => updateQuestion(question.id, { answerIndex: Number(event.target.value) })} className={`${fieldClass} w-24`}>
                        {question.options.map((_, index) => <option key={index} value={index}>{String.fromCharCode(65 + index)}</option>)}
                      </select>
                      <button type="button" onClick={() => removeQuestion(question.id)} className="rounded-[4px] p-2 text-muted hover:text-brand-700"><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          )}

          {tab === "comments" && (
            <Section title="Discussion" description="All video and quiz comments. Delete spam or reply from the storefront discussion.">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line text-[9px] uppercase tracking-wide text-muted">
                      <th className="px-2 py-2 font-semibold">Author</th>
                      <th className="px-2 py-2 font-semibold">Target</th>
                      <th className="px-2 py-2 font-semibold">Comment</th>
                      <th className="px-2 py-2 font-semibold">Replies</th>
                      <th className="px-2 py-2 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.comments.map((comment: VideoComment) => (
                      <tr key={comment.id} className="border-b border-line/70 last:border-0 align-top">
                        <td className="px-2 py-2">
                          <p className="text-[11px] font-semibold text-ink">{comment.userName}</p>
                          <p className="text-[9px] text-muted">{comment.time}</p>
                        </td>
                        <td className="px-2 py-2 text-[10px] text-muted">{comment.target}</td>
                        <td className="max-w-[280px] px-2 py-2 text-[10px] leading-relaxed text-muted">{comment.text}</td>
                        <td className="px-2 py-2 text-[10px] text-muted">
                          {draft.comments.filter((item) => item.parentId === comment.id).length}
                        </td>
                        <td className="px-2 py-2 text-right">
                          <button type="button" onClick={() => removeComment(comment.id)} className="rounded-[4px] p-1.5 text-muted hover:text-brand-700" title="Delete comment">
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {tab === "homepage" && (
            <Section title="Homepage Watch & Quiz copy">
              {(["title", "description", "progressPrefix", "progressSuffix", "quizTitle", "quizText", "quizNote", "allWatchedNote", "watchedSoFarNote", "demoNote"] as const).map((key) => (
                <label className="block" key={key}>
                  <span className={subLabel}>{key}</span>
                  <textarea
                    value={draft.home[key]}
                    onChange={(event) => setGroup("home", { ...draft.home, [key]: event.target.value })}
                    rows={key === "description" || key === "quizNote" ? 3 : 1}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
              ))}
            </Section>
          )}

          {tab === "videoPage" && (
            <Section title="/video page copy">
              {(["eyebrow", "title", "description", "promoEyebrow", "promoTitle", "promoText"] as const).map((key) => (
                <label className="block" key={key}>
                  <span className={subLabel}>{key}</span>
                  <textarea
                    value={draft.videoPage[key]}
                    onChange={(event) => setGroup("videoPage", { ...draft.videoPage, [key]: event.target.value })}
                    rows={key === "description" || key === "promoText" ? 3 : 1}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
              ))}
              <StringList label="Header pills" values={draft.videoPage.pills} onChange={(values) => setGroup("videoPage", { ...draft.videoPage, pills: values })} />
            </Section>
          )}

          {tab === "quizPage" && (
            <Section title="/quiz page copy">
              {(["eyebrow", "title", "description"] as const).map((key) => (
                <label className="block" key={key}>
                  <span className={subLabel}>{key}</span>
                  <textarea
                    value={draft.quizPage[key]}
                    onChange={(event) => setGroup("quizPage", { ...draft.quizPage, [key]: event.target.value })}
                    rows={key === "description" ? 3 : 1}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
              ))}
              <StringList label="Header pills" values={draft.quizPage.pills} onChange={(values) => setGroup("quizPage", { ...draft.quizPage, pills: values })} />
            </Section>
          )}

          {notice && (
            <div className={cn("flex items-start gap-2 rounded-[8px] border px-3 py-2.5", notice.error ? "border-gold-300 bg-gold-300/15" : "border-brand-100 bg-brand-50")}>
              {notice.error ? <AlertCircle size={13} className="mt-0.5 shrink-0 text-gold-600" /> : <Check size={13} className="mt-0.5 shrink-0 text-brand-700" />}
              <p className="text-[10px] leading-relaxed text-ink">{notice.text}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-line bg-white p-4">
            <button type="button" onClick={handleSave} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700">
              <Save size={13} /> Save all changes
            </button>
            <button type="button" onClick={handleReset} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300">
              <RotateCcw size={13} /> Restore default
            </button>
            {dirty && <span className="ml-auto text-[10px] font-semibold text-gold-600">Unsaved changes</span>}
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5 sm:px-5">
              <Eye size={14} className="text-brand-700" />
              <h2 className="text-[13px] font-semibold text-ink">Live preview</h2>
              <span className="ml-auto text-[9px] text-muted">Watch & Quiz</span>
            </div>
            <div className="brand-wash p-4 sm:p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-700">{draft.section.eyebrow}</p>
              <h3 className="mt-1 font-display text-base font-bold text-ink">{draft.home.title}</h3>
              <p className="mt-1 text-[10px] leading-relaxed text-muted">{draft.home.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {draft.videos.slice(0, 6).map((video) => (
                  <div key={video.id} className="overflow-hidden rounded-[6px] border border-line bg-white">
                    {video.thumbnail.startsWith("data:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={video.thumbnail} alt="" className="h-14 w-full object-cover" />
                    ) : (
                      <div className="grid h-14 place-items-center bg-brand-100 text-[9px] text-brand-700">#{toBn(video.episode)}</div>
                    )}
                    <p className="truncate px-1.5 py-1 text-[8px] font-semibold text-ink">{video.title}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[9px] text-muted">
                {draft.videos.length} videos · {draft.quizzes.length} questions · {draft.comments.length} comments
              </p>
            </div>
          </section>
          <p className="text-[10px] leading-relaxed text-muted">
            Demo note: videos, quizzes and comments are stored in this browser only — nothing reaches a server.
          </p>
        </div>
      </div>
    </div>
  );
}
