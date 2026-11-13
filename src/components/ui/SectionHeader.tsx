import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "./SectionTitle";

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
        "flex flex-wrap items-end justify-between gap-x-6 gap-y-3",
        align === "center" && "flex-col items-center",
        className,
      )}
    >
      <SectionTitle
        eyebrow={eyebrow}
        title={title}
        description={description}
        light={light}
        align={align}
      />
      {href && (
        <Link
          href={href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[12px] font-medium transition-colors",
            light
              ? "border-white/25 text-white/85 hover:border-white hover:bg-white/10 hover:text-white"
              : "border-line bg-white text-ink hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
          )}
        >
          {linkLabel}
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
