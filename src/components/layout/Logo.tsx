import Link from "next/link";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-[6px] bg-brand-600 text-white transition-colors duration-200 group-hover:bg-brand-700 sm:h-10 sm:w-10">
        <BookOpen size={20} strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block text-[20px] font-bold leading-none tracking-tight sm:text-[22px]",
            light ? "text-white" : "text-ink",
          )}
        >
          TalkNest<span className="text-sale">BD</span>
        </span>
        {!compact && (
          <span
            className={cn(
              "mt-1 block text-[8px] font-medium uppercase tracking-[0.16em] sm:text-[9px]",
              light ? "text-white/55" : "text-muted",
            )}
          >
            Books · Stories · Community
          </span>
        )}
      </span>
    </Link>
  );
}
