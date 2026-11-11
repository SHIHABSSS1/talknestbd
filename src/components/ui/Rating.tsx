import { Star } from "lucide-react";
import { toBn } from "@/lib/utils";

export function Rating({
  value,
  count,
  className = "",
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 text-xs ${className}`}>
      <Star
        size={13}
        className="fill-gold-500 text-gold-500"
        aria-hidden="true"
      />
      <span className="font-semibold text-forest-950">{toBn(value.toFixed(1))}</span>
      {typeof count === "number" && (
        <span className="text-muted">({toBn(count)})</span>
      )}
    </div>
  );
}
