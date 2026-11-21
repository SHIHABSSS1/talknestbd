import Link from "next/link";
import { ArrowUpRight, BookOpen, CheckCircle2, PlayCircle, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export type QuizTab = "watch" | "book" | "leaderboard";

const tabs = [
  {
    id: "watch" as const,
    label: "Watch & Quiz",
    description: "Watch an episode, then answer the questions below it.",
    href: "/quiz?tab=watch",
    icon: PlayCircle,
  },
  {
    id: "book" as const,
    label: "Book Quiz",
    description: "Jump straight into the book quiz and the leaderboard preview.",
    href: "/quiz?tab=book",
    icon: BookOpen,
  },
  {
    id: "leaderboard" as const,
    label: "Leaderboard",
    description: "See the top readers, scores and ranks across every quiz.",
    href: "/quiz?tab=leaderboard",
    icon: Trophy,
  },
];

export function QuizTabs({ active }: { active: QuizTab }) {
  return (
    <nav aria-label="Quiz options" className="grid gap-2.5 sm:grid-cols-3">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            prefetch={true}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex items-start gap-3 rounded-[8px] border p-4 transition-all duration-200",
              isActive
                ? "border-brand-500 bg-brand-50 shadow-[0_18px_40px_-34px_rgba(8,42,82,0.55)]"
                : "border-line bg-white hover:border-brand-300 hover:bg-brand-50/40",
            )}
          >
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-[6px]",
                isActive ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600 group-hover:bg-brand-100",
              )}
            >
              <Icon size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-ink">
                {tab.label}
                {isActive && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-600/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-brand-700">
                    <CheckCircle2 size={8} /> Now open
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-[10.5px] leading-relaxed text-muted">{tab.description}</span>
            </span>
            <ArrowUpRight
              size={14}
              className={cn(
                "mt-1 shrink-0 transition-transform",
                isActive
                  ? "text-brand-600"
                  : "text-brand-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
