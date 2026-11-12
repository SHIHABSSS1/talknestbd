import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
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
        "mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-7",
        align === "center" && "flex-col items-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <span
            className={cn(
              "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em]",
              light ? "text-brand-200" : "text-brand-600",
            )}
          >
            {eyebrow}
          </span>
        )}
        <div
          className={cn(
            "flex items-center gap-2.5",
            align === "center" && "justify-center",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "block h-5 w-1 shrink-0 rounded-full",
              light ? "bg-sale" : "bg-brand-500",
            )}
          />
          <h2
            className={cn(
              "text-[22px] font-bold leading-tight sm:text-2xl",
              light ? "text-white" : "text-ink",
            )}
          >
            {title}
          </h2>
        </div>
        {description && (
          <p
            className={cn(
              "mt-2 text-[13px] leading-relaxed sm:text-sm",
              align === "center" && "mx-auto",
              light ? "text-white/65" : "text-muted",
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
            "group inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors",
            light
              ? "text-white/80 hover:text-white"
              : "text-brand-600 hover:text-brand-700",
          )}
        >
          {linkLabel}
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
