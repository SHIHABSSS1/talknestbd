import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({
  items,
  light = false,
  className,
}: {
  items: Crumb[];
  light?: boolean;
  className?: string;
}) {
  return (
    <nav aria-label="ব্রেডক্রাম্ব" className={className}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px]",
          light ? "text-cream-100/50" : "text-muted",
        )}
      >
        <li>
          <Link href="/" className="transition-colors hover:text-clay-500">
            হোম
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            <ChevronRight size={11} className="opacity-50" aria-hidden="true" />
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-clay-500">
                {item.label}
              </Link>
            ) : (
              <span className={light ? "text-cream-100/80" : "text-forest-800"}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
