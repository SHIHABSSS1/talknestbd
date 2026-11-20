"use client";

import { useState, useTransition } from "react";
import { Check, Database, RotateCcw, Save, AlertCircle } from "lucide-react";

import {
  createSnapshot,
  restoreSnapshot,
} from "@/lib/actions/snapshots";
import type { SnapshotSummary } from "@/lib/snapshots";
import { cn } from "@/lib/utils";

type Notice = { text: string; error?: boolean };

/** Deterministic UTC label — no locale-dependent hydration mismatch. */
function formatCreatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.toISOString().slice(0, 16).replace("T", " ")} UTC`;
}

/**
 * Admin-only backup screen for the editable homepage content (hero, trust
 * strip, categories). The seeded `demo` snapshot is the frozen copy of the
 * shipped demo data; manual snapshots capture the live documents on demand.
 */
export function DemoSnapshots({
  initialSnapshots,
}: {
  initialSnapshots: SnapshotSummary[];
}) {
  const [snapshots, setSnapshots] = useState(initialSnapshots);
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pending, startTransition] = useTransition();

  const handleCreate = () => {
    setNotice(null);
    startTransition(async () => {
      try {
        const result = await createSnapshot({ label, note });
        setNotice({ text: result.message, error: !result.ok });
        if (result.ok) {
          setSnapshots(result.snapshots ?? snapshots);
          setLabel("");
          setNote("");
        }
      } catch (error) {
        setNotice({
          error: true,
          text: error instanceof Error ? error.message : "Could not create the snapshot.",
        });
      }
    });
  };

  const handleRestore = (id: string) => {
    setNotice(null);
    startTransition(async () => {
      try {
        const result = await restoreSnapshot(id);
        setNotice({ text: result.message, error: !result.ok });
        if (result.ok) setSnapshots(result.snapshots ?? snapshots);
      } catch (error) {
        setNotice({
          error: true,
          text: error instanceof Error ? error.message : "Could not restore the snapshot.",
        });
      }
    });
  };

  return (
    <section className="rounded-[10px] border border-line bg-white">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3.5 sm:px-5">
        <Database size={14} className="text-brand-700" />
        <div>
          <h3 className="text-[13px] font-semibold text-ink">Database snapshots</h3>
          <p className="text-[10px] text-muted">
            Frozen copies of the hero, trust strip and category documents.
          </p>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold text-ink">
              Snapshot name
            </span>
            <input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="e.g. Before the autumn sale"
              maxLength={80}
              className="w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold text-ink">
              Note (optional)
            </span>
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Why this snapshot was taken"
              maxLength={300}
              className="w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          disabled={pending}
          className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          <Save size={13} /> {pending ? "Working…" : "Create snapshot"}
        </button>

        <div className="space-y-2">
          {snapshots.length === 0 && (
            <p className="rounded-[8px] border border-dashed border-line px-3 py-5 text-center text-[11px] text-muted">
              No snapshots yet. Run <code>npm run db:seed</code> to store the demo
              backup, or create one above.
            </p>
          )}
          {snapshots.map((snapshot) => (
            <div
              key={snapshot.id}
              className="flex flex-wrap items-center gap-2 rounded-[8px] border border-line bg-cream-50/60 px-3 py-2.5"
            >
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                  snapshot.kind === "demo"
                    ? "bg-forest-100 text-forest-700"
                    : "bg-brand-50 text-brand-700",
                )}
              >
                {snapshot.kind}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-ink">
                  {snapshot.label}
                </p>
                <p className="text-[9px] text-muted">
                  {formatCreatedAt(snapshot.createdAt)}
                  {snapshot.note ? ` · ${snapshot.note}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRestore(snapshot.id)}
                disabled={pending}
                className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[10px] font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700 disabled:opacity-50"
              >
                <RotateCcw size={12} /> Restore
              </button>
            </div>
          ))}
        </div>

        {notice && (
          <div
            role="status"
            aria-live="polite"
            className={cn(
              "flex items-start gap-2 rounded-[8px] border px-3 py-2.5",
              notice.error
                ? "border-gold-300 bg-gold-300/15"
                : "border-brand-100 bg-brand-50",
            )}
          >
            {notice.error ? (
              <AlertCircle size={13} className="mt-0.5 shrink-0 text-gold-600" />
            ) : (
              <Check size={13} className="mt-0.5 shrink-0 text-brand-700" />
            )}
            <p className="text-[10px] leading-relaxed text-ink">{notice.text}</p>
          </div>
        )}
      </div>
    </section>
  );
}
