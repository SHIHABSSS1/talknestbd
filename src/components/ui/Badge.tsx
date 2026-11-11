import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "forest" | "gold" | "clay" | "cream" | "outline";

const tones: Record<Tone, string> = {
  forest: "bg-forest-100 text-forest-800",
  gold: "bg-gold-500 text-forest-950",
  clay: "bg-clay-500 text-cream-50",
  cream: "bg-cream-100 text-forest-800 border border-cream-300",
  outline: "border border-forest-900/15 bg-white/60 text-forest-800",
};

export function Badge({
  children,
  tone = "forest",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold leading-none tracking-wide sm:text-[11px]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
