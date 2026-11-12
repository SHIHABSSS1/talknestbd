import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "forest" | "gold" | "clay" | "cream" | "outline";

const tones: Record<Tone, string> = {
  forest: "bg-brand-50 text-brand-700",
  gold: "bg-sale text-ink",
  clay: "bg-brand-600 text-white",
  cream: "border border-line bg-canvas text-body",
  outline: "border border-hairline bg-white text-brand-700",
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
        "inline-flex items-center gap-1 rounded-[3px] px-2 py-1 text-[10px] font-medium leading-none sm:text-[11px]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
