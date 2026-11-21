"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Heart,
  MessageCircle,
  Reply,
  Send,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import type { DiscussionView } from "@/lib/video-quiz-api";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-brand-600",
  "bg-forest-700",
  "bg-gold-600",
  "bg-clay-600",
  "bg-brand-800",
];

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "R";
}

function colorFor(name: string): string {
  let total = 0;
  for (let index = 0; index < name.length; index += 1) total += name.charCodeAt(index);
  return AVATAR_COLORS[total % AVATAR_COLORS.length]!;
}

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (Math.abs(seconds) < 60) return "just now";
  if (Math.abs(minutes) < 60) return relative.format(minutes, "minute");
  if (Math.abs(hours) < 24) return relative.format(hours, "hour");
  if (Math.abs(days) < 30) return relative.format(days, "day");
  return new Intl.DateTimeFormat("en-BD", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function Avatar({ comment, small }: { comment: DiscussionView; small?: boolean }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full font-bold text-white",
        small ? "h-6 w-6 text-[8px]" : "h-8 w-8 text-[9px]",
        colorFor(comment.userName),
      )}
    >
      {comment.userImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={comment.userImage} alt="" className="h-full w-full object-cover" />
      ) : (
        initials(comment.userName)
      )}
    </span>
  );
}

function CommentItem({
  comment,
  all,
  viewerId,
  onLike,
  onReply,
  onDelete,
  depth = 0,
}: {
  comment: DiscussionView;
  all: DiscussionView[];
  viewerId: string | null;
  onLike: (id: string) => void;
  onReply: (comment: DiscussionView) => void;
  onDelete: (id: string) => void;
  depth?: number;
}) {
  const replies = all.filter((item) => item.parentId === comment.id);
  return (
    <li className={depth > 0 ? "ml-3 border-l-2 border-brand-100 pl-3 sm:ml-7" : ""}>
      <article className="flex gap-2.5 py-3">
        <Avatar comment={comment} small={depth > 0} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[11px] font-semibold text-ink">{comment.userName}</span>
            {comment.isAdmin && (
              <span className="rounded-full bg-forest-900 px-1.5 py-0.5 text-[8px] font-semibold text-gold-300">
                Admin reply
              </span>
            )}
            <time className="text-[9px] text-muted" dateTime={comment.createdAt}>
              {formatTime(comment.createdAt)}
            </time>
          </div>
          <p className="mt-1 break-words text-pretty text-[11px] leading-relaxed text-body">
            {comment.body}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onLike(comment.id)}
              aria-label={comment.likedByMe ? `Unlike comment by ${comment.userName}` : `Like comment by ${comment.userName}`}
              aria-pressed={comment.likedByMe}
              className={cn(
                "inline-flex min-h-8 items-center gap-1 rounded-[4px] px-1 text-[9px] font-medium transition-colors",
                comment.likedByMe ? "text-clay-600" : "text-muted hover:text-clay-600",
              )}
            >
              <Heart size={11} className={comment.likedByMe ? "fill-current" : ""} />
              <span className="tabular-nums">{comment.likes}</span>
            </button>
            {viewerId && (
              <button
                type="button"
                onClick={() => onReply(comment)}
                aria-label={`Reply to ${comment.userName}`}
                className="inline-flex min-h-8 items-center gap-1 rounded-[4px] px-1 text-[9px] font-medium text-muted transition-colors hover:text-brand-700"
              >
                <Reply size={11} /> Reply
              </button>
            )}
            {viewerId && comment.userId === viewerId && (
              <button
                type="button"
                onClick={() => onDelete(comment.id)}
                aria-label="Delete your comment"
                className="inline-flex min-h-8 items-center gap-1 rounded-[4px] px-1 text-[9px] font-medium text-muted transition-colors hover:text-clay-600"
              >
                <Trash2 size={11} /> Delete
              </button>
            )}
          </div>
        </div>
      </article>
      {replies.length > 0 && (
        <ul className="divide-y divide-line">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              all={all}
              viewerId={viewerId}
              onLike={onLike}
              onReply={onReply}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function CommentThread({
  target,
  targetId,
  title,
  compact = false,
}: {
  target: "video" | "quiz";
  targetId: string;
  title?: string;
  compact?: boolean;
}) {
  const [comments, setComments] = useState<DiscussionView[]>([]);
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<DiscussionView | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!targetId) return;
    setLoading(true);
    try {
      const [thread, session] = await Promise.all([
        accountFetch<{ comments: DiscussionView[] }>(
          `/api/discussions?target=${target}&targetId=${encodeURIComponent(targetId)}`,
        ),
        fetch("/api/auth/get-session")
          .then((response) => response.json().catch(() => null))
          .catch(() => null),
      ]);
      setComments(thread.comments ?? []);
      setViewerId((session as { user?: { id?: string } } | null)?.user?.id ?? null);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [target, targetId]);

  useEffect(() => {
    void load();
  }, [load]);

  const ordered = useMemo(
    () => (sort === "newest" ? [...comments].reverse() : comments),
    [comments, sort],
  );
  const topLevel = ordered.filter((comment) => !comment.parentId);
  const participants = new Set(comments.map((comment) => comment.userName)).size;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || busy) return;
    setBusy(true);
    setNotice("");
    try {
      await accountFetch("/api/discussions", {
        method: "POST",
        body: JSON.stringify({ target, targetId, body, parentId: replyTo?.id ?? null }),
      });
      setDraft("");
      setReplyTo(null);
      setNotice("Your comment was added.");
      await load();
    } catch (reason) {
      setNotice(reason instanceof Error ? reason.message : "Could not post your comment.");
    } finally {
      setBusy(false);
    }
  };

  const like = async (id: string) => {
    if (!viewerId) return;
    try {
      await accountFetch(`/api/discussions/${id}/like`, { method: "POST" });
      await load();
    } catch {
      setNotice("Could not update your like.");
    }
  };

  const remove = async (id: string) => {
    try {
      await accountFetch(`/api/discussions/${id}`, { method: "DELETE" });
      await load();
    } catch (reason) {
      setNotice(reason instanceof Error ? reason.message : "Could not delete the comment.");
    }
  };

  return (
    <section className="rounded-[10px] border border-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle size={15} className="text-brand-700" />
          <h3 className="text-[12px] font-semibold text-ink">
            {title ?? (target === "video" ? "Episode discussion" : "Quiz discussion")}
          </h3>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[9px] font-semibold tabular-nums text-brand-700">
            {comments.length}
          </span>
        </div>
        <div className="flex overflow-hidden rounded-[4px] border border-line">
          {(["newest", "oldest"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSort(value)}
              className={cn(
                "px-2.5 py-1.5 text-[9px] font-medium capitalize transition-colors",
                sort === value ? "bg-brand-600 text-white" : "bg-white text-muted hover:text-brand-700",
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {!loading && participants > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-canvas/50 px-4 py-2.5">
          <ShieldCheck size={12} className="text-muted" />
          <span className="text-[9px] text-muted">{participants} readers in this discussion</span>
        </div>
      )}

      {viewerId ? (
        <form onSubmit={submit} className="flex gap-2.5 px-4 py-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-[9px] font-bold text-white">
            YO
          </span>
          <div className="min-w-0 flex-1">
            {replyTo && (
              <div className="mb-1.5 flex items-center gap-1.5 rounded-[4px] bg-brand-50 px-2 py-1.5 text-[9px] text-muted">
                Replying to <span className="font-semibold text-brand-700">{replyTo.userName}</span>
                <button type="button" onClick={() => setReplyTo(null)} aria-label="Cancel reply" className="ml-auto rounded p-1 hover:text-ink">
                  <X size={11} />
                </button>
              </div>
            )}
            <label htmlFor={`comment-draft-${target}-${targetId}`} className="sr-only">
              {replyTo ? `Reply to ${replyTo.userName}` : "Write a comment"}
            </label>
            <textarea
              id={`comment-draft-${target}-${targetId}`}
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                setNotice("");
              }}
              rows={compact ? 2 : 3}
              maxLength={2000}
              placeholder={replyTo ? `Reply to ${replyTo.userName}…` : "Add to the conversation…"}
              className="w-full resize-none rounded-[6px] border border-line bg-white px-3 py-2 text-[11px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[9px] text-muted">Be kind and specific · moderated discussion</span>
              <button
                type="submit"
                disabled={!draft.trim() || busy}
                className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-3.5 text-[10px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:pointer-events-none disabled:opacity-50"
              >
                <Send size={11} /> {busy ? "Posting…" : replyTo ? "Post reply" : "Post comment"}
              </button>
            </div>
            <p aria-live="polite" className="mt-2 min-h-3 text-[9px] text-brand-700">{notice}</p>
          </div>
        </form>
      ) : (
        <div className="px-4 py-4 text-center text-[10px] text-muted">
          <a href="/login?callbackUrl=/quiz" className="font-semibold text-brand-700 hover:underline">
            Sign in
          </a>{" "}
          to join the discussion.
        </div>
      )}

      {loading ? (
        <div className="space-y-2 px-4 py-4" aria-hidden="true">
          {[0, 1].map((item) => (
            <div key={item} className="h-10 animate-pulse rounded bg-canvas" />
          ))}
        </div>
      ) : topLevel.length ? (
        <ul className="max-h-80 divide-y divide-line overflow-y-auto border-t border-line px-4">
          {topLevel.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              all={comments}
              viewerId={viewerId}
              onLike={(id) => void like(id)}
              onReply={setReplyTo}
              onDelete={(id) => void remove(id)}
            />
          ))}
        </ul>
      ) : (
        <p className="border-t border-line px-4 py-6 text-center text-[10px] text-muted">
          No comments yet — start the conversation.
        </p>
      )}
    </section>
  );
}
