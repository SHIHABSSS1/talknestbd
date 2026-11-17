import {
  Building2,
  Headphones,
  LibraryBig,
  PackageCheck,
  Percent,
  Store,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { WholesaleIconKey } from "@/lib/wholesale-content";

const icons: Record<WholesaleIconKey, LucideIcon> = {
  percent: Percent,
  truck: Truck,
  package: PackageCheck,
  support: Headphones,
  library: LibraryBig,
  school: Building2,
  store: Store,
  users: Users,
};

export function WholesaleIcon({
  icon,
  size = 17,
  className,
}: {
  icon: WholesaleIconKey;
  size?: number;
  className?: string;
}) {
  const Component = icons[icon] ?? Percent;
  return <Component size={size} className={className} />;
}
