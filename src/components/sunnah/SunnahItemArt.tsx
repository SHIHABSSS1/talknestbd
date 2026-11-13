import {
  CircleDot,
  Droplets,
  Gem,
  Gift,
  Moon,
  PenLine,
  Sparkles,
  Sun,
} from "lucide-react";
import type { SunnahIcon, SunnahItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const icons = {
  sparkles: Sparkles,
  "circle-dot": CircleDot,
  droplets: Droplets,
  moon: Moon,
  "notebook-pen": PenLine,
  gem: Gem,
  gift: Gift,
  sun: Sun,
} satisfies Record<SunnahIcon, typeof Sparkles>;

/**
 * CSS-generated product art keeps the Sunnah catalogue consistent with the
 * book covers: no external photography, just the item icon and its accent.
 */
export function SunnahItemArt({
  item,
  size = "card",
  showBadge = true,
  className,
}: {
  item: SunnahItem;
  size?: "card" | "detail";
  showBadge?: boolean;
  className?: string;
}) {
  const Icon = icons[item.icon];
  const detail = size === "detail";

  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden",
        detail
          ? "aspect-square rounded-[14px] border border-brand-900/8"
          : "aspect-[4/3] rounded-[4px]",
        className,
      )}
      style={{ backgroundColor: `${item.accent}40` }}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-900/10",
          detail ? "h-[68%] w-[68%]" : "h-24 w-24",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-900/10",
          detail ? "h-[44%] w-[44%]" : "h-16 w-16",
        )}
      />
      <span
        className={cn(
          "relative grid place-items-center rounded-full bg-white/75",
          detail ? "h-28 w-28 sm:h-32 sm:w-32" : "h-14 w-14",
        )}
      >
        <Icon
          size={detail ? 56 : 28}
          strokeWidth={1.5}
          className={cn(
            "text-brand-800",
            !detail && "transition-transform duration-500 group-hover:scale-110",
          )}
        />
      </span>
      {showBadge && item.badge && (
        <span
          className={cn(
            "absolute left-2 top-2 rounded-[3px] bg-brand-600 px-2 py-1 font-medium leading-none text-white",
            detail ? "text-[10px]" : "text-[8px]",
          )}
        >
          {item.badge}
        </span>
      )}
      {detail && (
        <span className="absolute bottom-3 left-0 right-0 text-center text-[9px] font-medium uppercase tracking-[0.18em] text-brand-900/45">
          Sunnah Essentials
        </span>
      )}
    </div>
  );
}
