"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Award, Crown, Medal, Trophy } from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import { useVideoQuiz } from "@/components/providers/VideoQuizProvider";
import type { LeaderboardEntry } from "@/lib/video-quiz-api";
import { cn } from "@/lib/utils";

const MEDALS = ["🥇", "🥈", "🥉"];

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("") || "R";
}

export function QuizLeaderboard({
  mode = "preview",
  quizSlug,
  quizTitle,
  limit = 5,
}: {
  mode?: "preview" | "full";
  quizSlug?: string;
  quizTitle?: string;
  limit?: number;
}) {
  const { quizzes } = useVideoQuiz();
  const [selected, setSelected] = useState(quizSlug ?? "");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageSize = mode === "full" ? 10 : limit;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({ limit: String(pageSize), offset: String(offset) });
      const url = selected
        ? `/api/quizzes/${encodeURIComponent(selected)}/leaderboard?${query}`
        : `/api/leaderboard?${query}`;
      const data = await accountFetch<{ entries: LeaderboardEntry[]; total: number }>(url);
      setEntries(data.entries ?? []);
      setTotal(data.total ?? 0);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load the leaderboard.");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [selected, offset, pageSize]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setOffset(0);
  }, [selected]);

  const title = quizTitle ?? (selected ? quizzes.find((quiz) => quiz.slug === selected)?.title : undefined) ?? "Overall leaderboard";
  const topThree = mode === "preview" ? entries.slice(0, 3) : [];
  const list = mode === "preview" ? entries.slice(3, limit) : entries;

  return (
    <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Award size={16} className="text-gold-600" />
          <h2 className="font-display text-base font-bold text-forest-950">
            {mode === "full" ? "Quiz leaderboard" : "This week's leaderboard"}
          </h2>
        </div>
        {mode === "preview" ? (
          <Link
            href="/quiz?tab=leaderboard"
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 hover:underline"
          >
            View all <ArrowRight size={11} />
          </Link>
        ) : (
          <span className="text-[10px] text-muted">{total} ranked readers</span>
        )}
      </div>

      <p className="mt-1 text-[9px] text-muted">
        {title} · best score per reader, updated after every submission
      </p>

      {mode === "full" && (
        <div className="mt-3">
          <label htmlFor="leaderboard-quiz" className="sr-only">Filter leaderboard by quiz</label>
          <select
            id="leaderboard-quiz"
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
            className="w-full rounded-[6px] border border-line bg-white px-3 py-2 text-[11px] text-ink"
          >
            <option value="">Overall — all quizzes</option>
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.slug}>{quiz.title}</option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="mt-3 space-y-1.5" aria-hidden="true">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-12 animate-pulse rounded-xl bg-cream-100" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-3 rounded-xl bg-white px-3 py-4 text-center text-[10px] text-clay-600">{error}</p>
      ) : entries.length === 0 ? (
        <div className="mt-3 rounded-xl border border-dashed border-forest-900/15 bg-white/60 px-3 py-6 text-center">
          <Trophy size={18} className="mx-auto text-gold-500" />
          <p className="mt-2 text-[10px] font-semibold text-forest-900">No scores yet</p>
          <p className="mt-0.5 text-[9px] text-muted">
            Take a quiz to be the first on the board.
          </p>
          <Link href="/quiz?tab=book" className="mt-2 inline-flex text-[10px] font-semibold text-brand-700 hover:underline">
            Start the book quiz
          </Link>
        </div>
      ) : (
        <>
          {topThree.length > 0 && (
            <div className={cn(
              "mt-3 grid gap-1.5",
              topThree.length === 3 ? "grid-cols-3" : topThree.length === 2 ? "grid-cols-2" : "grid-cols-1",
            )}>
              {topThree.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={cn(
                    "flex flex-col items-center rounded-xl border px-1.5 py-2.5 text-center",
                    index === 0
                      ? "border-gold-400/40 bg-gold-500/15"
                      : "border-forest-900/8 bg-white",
                  )}
                >
                  <span className="text-lg leading-none">{MEDALS[index]}</span>
                  {entry.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={entry.image} alt="" className="mt-1 h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span className={cn(
                      "mt-1 grid h-8 w-8 place-items-center rounded-full text-[9px] font-bold text-cream-50",
                      index === 0 ? "bg-gold-600" : "bg-forest-800",
                    )}>
                      {initials(entry.name)}
                    </span>
                  )}
                  <span className="mt-1 w-full truncate text-[9px] font-semibold text-forest-900">{entry.name}</span>
                  <span className="text-[8px] text-muted">{entry.score}/{entry.totalMarks}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-2 space-y-1.5">
            {list.map((entry) => (
              <div key={entry.userId} className="flex items-center gap-2.5 rounded-xl bg-white/80 px-3 py-2.5">
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full font-display text-[9px] font-bold",
                    entry.rank <= 3 ? "bg-forest-900 text-gold-300" : "bg-cream-200 text-forest-800",
                  )}
                >
                  {entry.rank}
                </span>
                {entry.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={entry.image} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-100 text-[9px] font-bold text-brand-800">
                    {initials(entry.name)}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[10px] font-medium text-forest-900">{entry.name}</span>
                  <span className="block text-[8px] text-muted">{entry.city || `${entry.quizzesPlayed} ${entry.quizzesPlayed === 1 ? "quiz" : "quizzes"}`}</span>
                </span>
                <span className="shrink-0 rounded-full bg-gold-500/15 px-2 py-0.5 text-[9px] font-bold text-gold-600">
                  {entry.percentage}%
                </span>
              </div>
            ))}
          </div>

          {mode === "full" && total > pageSize && (
            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                type="button"
                disabled={offset === 0}
                onClick={() => setOffset((value) => Math.max(0, value - pageSize))}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-semibold text-ink disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-[9px] text-muted">
                {offset + 1}–{Math.min(offset + pageSize, total)} of {total}
              </span>
              <button
                type="button"
                disabled={offset + pageSize >= total}
                onClick={() => setOffset((value) => value + pageSize)}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-semibold text-ink disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}

          {mode === "full" && entries[0]?.rank === 1 && (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[9px] text-muted">
              <Crown size={11} className="text-gold-600" /> Rankings update as soon as a quiz is submitted.
            </p>
          )}
        </>
      )}
    </section>
  );
}
