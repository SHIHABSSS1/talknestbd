import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The closing line of a section: a hairline that fades into a centred
 * "view all" pill so long shelves always end with a way further.
 */
export function ViewAllRow({
  href,
  label = "View all",
  count,
  light = false,
  className,
}: {
  href: string;
  label?: string;
  count?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mt-7 flex items-center gap-3 sm:mt-8 sm:gap-5", className)}>
      <span
        aria-hidden="true"
        className={cn("h-px flex-1", light ? "bg-white/15" : "bg-line")}
      />
      <Link
        href={href}
        className={cn(
          "group inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-medium transition-colors",
          light
            ? "border-white/25 text-white/85 hover:border-white hover:bg-white/10 hover:text-white"
            : "border-line bg-white text-ink hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
        )}
      >
        {label}
        {count && (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
              light ? "bg-white/10 text-white/70" : "bg-brand-50 text-brand-700",
            )}
          >
            {count}
          </span>
        )}
        <ArrowRight
          size={14}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </Link>
      <span
        aria-hidden="true"
        className={cn("h-px flex-1", light ? "bg-white/15" : "bg-line")}
      />
    </div>
  );
}
