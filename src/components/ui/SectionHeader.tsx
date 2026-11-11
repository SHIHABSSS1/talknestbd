import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "সব দেখুন",
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-7 flex flex-wrap items-end justify-between gap-4 sm:mb-9",
        align === "center" && "flex-col items-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <span
            className={cn(
              "inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]",
              light ? "text-gold-300" : "text-clay-500",
            )}
          >
            <span
              className={cn(
                "h-px w-6",
                light ? "bg-gold-400/70" : "bg-clay-500/60",
              )}
            />
            {eyebrow}
          </span>
        )}
        <h2
          className={cn(
            "mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-[2rem]",
            light ? "text-cream-50" : "text-forest-950",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-2 text-sm leading-relaxed sm:text-[15px]",
              light ? "text-cream-100/65" : "text-muted",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className={cn(
            "group inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-colors sm:text-sm",
            light
              ? "border-white/20 text-cream-100 hover:border-gold-400 hover:text-gold-300"
              : "border-forest-900/15 text-forest-800 hover:border-forest-900 hover:bg-forest-900 hover:text-cream-50",
          )}
        >
          {linkLabel}
          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      )}
    </div>
  );
}
