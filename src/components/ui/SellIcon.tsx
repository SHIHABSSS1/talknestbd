import {
  Banknote,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Package,
  Recycle,
  Repeat2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { SellIconKey } from "@/lib/sell-content";

const icons: Record<SellIconKey, LucideIcon> = {
  book: BookOpenCheck,
  package: Package,
  shield: ShieldCheck,
  banknote: Banknote,
  repeat: Repeat2,
  check: CheckCircle2,
  clock: Clock3,
  recycle: Recycle,
};

export function SellIcon({
  icon,
  size = 17,
  className,
}: {
  icon: SellIconKey;
  size?: number;
  className?: string;
}) {
  const Component = icons[icon] ?? CheckCircle2;
  return <Component size={size} className={className} />;
}
