import { MessageSquareReply } from "lucide-react";

/** Storefront-facing admin reply attached to a reader review. */
export function ReviewReply({
  reply,
  date,
  compact = false,
}: {
  reply: string;
  date?: string;
  compact?: boolean;
}) {
  return (
    <aside
      aria-label="Reply from TalkNest BD"
      className={`mt-3 rounded-lg border-l-2 border-brand-400 bg-brand-50/70 ${
        compact ? "px-2.5 py-2" : "px-3 py-2.5"
      }`}
    >
      <p className="flex items-center gap-1.5 text-[9px] font-semibold text-brand-700">
        <MessageSquareReply size={11} aria-hidden="true" />
        Reply from TalkNest BD
        {date ? (
          <time className="font-normal text-muted" dateTime={date}>
            {formatReplyDate(date)}
          </time>
        ) : null}
      </p>
      <p className="mt-1 break-words text-pretty text-[10px] leading-relaxed text-forest-800/80">
        {reply}
      </p>
    </aside>
  );
}

function formatReplyDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}
