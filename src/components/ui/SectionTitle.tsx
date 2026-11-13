import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The house style for every section headline on the storefront: a small
 * eyebrow pill, a bold title and an optional supporting line. Keeping it in
 * one component makes the homepage rhythm identical across sections.
 */
export function SectionTitle({
  eyebrow,
  title,
  description,
  light = false,
  align = "left",
  size = "md",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  light?: boolean;
  align?: "left" | "center";
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
            light
              ? "border-white/20 bg-white/10 text-brand-100"
              : "border-brand-100 bg-brand-50 text-brand-700",
          )}
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-sale"
          />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "mt-2.5 text-balance font-bold leading-[1.16] tracking-[-0.015em]",
          size === "lg"
            ? "text-[24px] sm:text-[30px]"
            : "text-[21px] sm:text-[27px]",
          light ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-2 max-w-xl text-pretty text-[13px] leading-relaxed sm:text-sm",
            light ? "text-white/70" : "text-muted",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
