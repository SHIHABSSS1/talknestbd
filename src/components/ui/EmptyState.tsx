import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-forest-900/15 bg-cream-100/50 px-6 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-forest-100 text-forest-700">
          {icon}
        </div>
      )}
      <h3 className="font-display text-xl font-bold text-forest-950">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
