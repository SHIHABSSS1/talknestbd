import Link from "next/link";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5">
      <span
        className={cn(
          "relative grid h-10 w-10 place-items-center rounded-xl shadow-sm transition-transform duration-300 group-hover:-rotate-3 sm:h-11 sm:w-11",
          light ? "bg-gold-500 text-forest-950" : "bg-forest-900 text-cream-50",
        )}
      >
        <BookOpen size={20} strokeWidth={1.8} aria-hidden="true" />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-clay-500 ring-2 ring-cream-50" />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-[20px] font-bold tracking-tight sm:text-[22px]",
            light ? "text-cream-50" : "text-forest-950",
          )}
        >
          talknest<span className="text-clay-500">bd</span>
        </span>
        <span
          className={cn(
            "mt-1 block text-[8px] font-semibold uppercase tracking-[0.2em] sm:text-[9px]",
            light ? "text-cream-100/50" : "text-forest-700/55",
          )}
        >
          Books · Stories · Community
        </span>
      </span>
    </Link>
  );
}
