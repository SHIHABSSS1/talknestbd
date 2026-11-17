"use client";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Reply,
  Send,
  ShieldCheck,
  Smile,
  Users,
  X,
} from "lucide-react";
import {
  currentUser,
  demoComments,
  demoUsers,
  findDemoUser,
  roleClass,
  type DemoComment,
} from "@/data/comment-demo";

function Avatar({
  initials,
  avatarClass,
  small = false,
}: {
  initials: string;
  avatarClass: string;
  small?: boolean;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-bold text-white ${
        small ? "h-6 w-6 text-[8px]" : "h-8 w-8 text-[9px]"
      } ${avatarClass}`}
    >
      {initials}
    </span>
  );
}

function CommentItem({
  comment,
  comments,
  liked,
  onLike,
  onReply,
  depth = 0,
}: {
  comment: DemoComment;
  comments: DemoComment[];
  liked: string[];
  onLike: (id: string) => void;
  onReply: (id: string, name: string) => void;
  depth?: number;
}) {
  const user = findDemoUser(comment.userId);
  const replies = comments.filter((item) => item.parentId === comment.id);
  const isLiked = liked.includes(comment.id);

  return (
    <li className={depth > 0 ? "ml-4 border-l-2 border-brand-100 pl-3 sm:ml-7" : ""}>
      <div className="flex gap-2.5 py-3">
        <Avatar initials={user.initials} avatarClass={user.avatarClass} small={depth > 0} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[11px] font-semibold text-ink">{user.name}</span>
            <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-medium ${roleClass(user.role)}`}>
              {user.role}
            </span>
            <span className="text-[9px] text-muted">{comment.time}</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-body">{comment.text}</p>
          <div className="mt-1.5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => onLike(comment.id)}
              aria-label={isLiked ? "Unlike comment" : "Like comment"}
              className={`inline-flex items-center gap-1 text-[9px] font-medium transition-colors ${
                isLiked ? "text-clay-600" : "text-muted hover:text-clay-600"
              }`}
            >
              <Heart size={11} className={isLiked ? "fill-current" : ""} />
              {comment.likes + (isLiked ? 1 : 0)}
            </button>
            <button
              type="button"
              onClick={() => onReply(comment.id, user.name)}
              className="inline-flex items-center gap-1 text-[9px] font-medium text-muted transition-colors hover:text-brand-700"
            >
              <Reply size={11} /> Reply
            </button>
          </div>
        </div>
      </div>

      {replies.length > 0 && (
        <ul className="divide-y divide-line">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              comments={comments}
              liked={liked}
              onLike={onLike}
              onReply={onReply}
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
  title,
  compact = false,
}: {
  target: "video" | "quiz";
  title?: string;
  compact?: boolean;
}) {
  const [comments, setComments] = useState<DemoComment[]>(() => [
    ...demoComments[target],
  ]);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [liked, setLiked] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  const ordered = sort === "newest" ? [...comments].reverse() : comments;
  const topLevel = ordered.filter((comment) => !comment.parentId);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setComments((current) => [
      ...current,
      {
        id: `local-${current.length}-${text.length}`,
        userId: currentUser.id,
        text,
        time: "Just now",
        likes: 0,
        parentId: replyTo?.id,
      },
    ]);
    setDraft("");
    setReplyTo(null);
    setNotice("Design preview — your comment is visible for this session only.");
  };

  return (
    <section className="rounded-[10px] border border-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle size={15} className="text-brand-700" />
          <h3 className="text-[12px] font-semibold text-ink">
            {title ?? (target === "video" ? "Episode discussion" : "Quiz discussion")}
          </h3>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[9px] font-semibold text-brand-700">
            {comments.length}
          </span>
        </div>
        <div className="flex overflow-hidden rounded-[4px] border border-line">
          {(["newest", "oldest"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSort(value)}
              className={`px-2.5 py-1.5 text-[9px] font-medium capitalize transition-colors ${
                sort === value
                  ? "bg-brand-600 text-white"
                  : "bg-white text-muted hover:text-brand-700"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Demo users */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-canvas/50 px-4 py-2.5">
        <Users size={12} className="text-muted" />
        <span className="text-[9px] font-medium text-muted">Demo readers here</span>
        <div className="flex -space-x-2">
          {demoUsers.slice(0, compact ? 3 : 5).map((user) => (
            <span key={user.id} title={`${user.name} · ${user.role}`}>
              <Avatar initials={user.initials} avatarClass={user.avatarClass} small />
            </span>
          ))}
        </div>
        <span className="text-[9px] text-muted">
          + you · <span className="font-medium text-brand-700">demo users only</span>
        </span>
      </div>

      {/* Composer */}
      <form onSubmit={submit} className="flex gap-2.5 px-4 py-3">
        <Avatar initials={currentUser.initials} avatarClass={currentUser.avatarClass} />
        <div className="min-w-0 flex-1">
          {replyTo && (
            <div className="mb-1.5 flex items-center gap-1.5 text-[9px] text-muted">
              Replying to <span className="font-semibold text-brand-700">{replyTo.name}</span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                aria-label="Cancel reply"
                className="text-muted hover:text-ink"
              >
                <X size={11} />
              </button>
            </div>
          )}
          <textarea
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setNotice("");
            }}
            rows={compact ? 2 : 2}
            placeholder="Add to the conversation…"
            aria-label="Write a comment"
            className="w-full resize-none rounded-[6px] border border-line bg-white px-3 py-2 text-[11px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[9px] text-muted">
              <span className="inline-flex items-center gap-1">
                <Smile size={11} /> Emoji
              </span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck size={11} /> Moderated demo
              </span>
            </div>
            <button
              type="submit"
              disabled={!draft.trim()}
              className="inline-flex h-8 items-center gap-1.5 rounded-[4px] bg-brand-600 px-3.5 text-[10px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:pointer-events-none disabled:opacity-50"
            >
              <Send size={11} /> Post comment
            </button>
          </div>
          {notice && (
            <p className="mt-2 text-[9px] text-brand-700">{notice}</p>
          )}
        </div>
      </form>

      {/* Comments */}
      <ul className="max-h-72 divide-y divide-line overflow-y-auto border-t border-line px-4">
        {topLevel.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            comments={comments}
            liked={liked}
            onLike={(id) =>
              setLiked((current) =>
                current.includes(id)
                  ? current.filter((item) => item !== id)
                  : [...current, id],
              )
            }
            onReply={(id, name) => setReplyTo({ id, name })}
          />
        ))}
      </ul>

      <div className="border-t border-line px-4 py-2.5 text-center text-[9px] text-muted">
        Design preview — comments use demo users and are not stored on a server.
      </div>
    </section>
  );
}
