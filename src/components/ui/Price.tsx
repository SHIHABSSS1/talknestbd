import { formatPrice } from "@/lib/utils";

export function Price({
  price,
  oldPrice,
  size = "md",
}: {
  price: number;
  oldPrice?: number;
  size?: "sm" | "md" | "lg";
}) {
  const priceClass =
    size === "lg"
      ? "text-2xl sm:text-3xl"
      : size === "sm"
        ? "text-sm"
        : "text-lg";

  return (
    <span className="flex flex-wrap items-baseline gap-2">
      <span className={`font-display font-bold text-forest-950 ${priceClass}`}>
        {formatPrice(price)}
      </span>
      {oldPrice && oldPrice > price && (
        <span className="text-xs text-muted line-through">
          {formatPrice(oldPrice)}
        </span>
      )}
    </span>
  );
}
