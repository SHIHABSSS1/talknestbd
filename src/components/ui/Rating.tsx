import { Star } from "lucide-react";
import { formatCount } from "@/lib/utils";

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
    <div className={`flex items-center gap-1 text-xs ${className}`}>
      <Star
        size={12}
        className="fill-sale text-sale"
        aria-hidden="true"
      />
      <span className="font-medium text-body">{value.toFixed(1)}</span>
      {typeof count === "number" && (
        <span className="text-muted">({formatCount(count)})</span>
      )}
    </div>
  );
}
