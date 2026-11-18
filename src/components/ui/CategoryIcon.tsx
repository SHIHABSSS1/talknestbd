import { BookOpen, Feather, Globe2, GraduationCap, Headphones, Landmark, BadgeCheck, Users, type LucideIcon } from "lucide-react";
import type { CategoryIconKey } from "@/lib/category-content";

const icons: Record<CategoryIconKey, LucideIcon> = {
  book: BookOpen,
  feather: Feather,
  landmark: Landmark,
  users: Users,
  graduation: GraduationCap,
  globe: Globe2,
  headphones: Headphones,
  sparkles: BadgeCheck,
};

export function CategoryIcon({
  icon,
  size = 22,
  className,
  strokeWidth = 1.6,
}: {
  icon: CategoryIconKey;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  const Component = icons[icon] ?? BadgeCheck;
  return (
    <Component size={size} strokeWidth={strokeWidth} className={className} />
  );
}
