import { BookOpen, Clock, Gift, GraduationCap, Headphones, Heart, Library, Mic, PlayCircle, Radio, Repeat2, ShieldCheck, BadgeCheck, Star, Store, Tag, Truck, Users, type LucideIcon } from "lucide-react";
import type { TrustIconKey } from "@/lib/trust-content";

const icons: Record<TrustIconKey, LucideIcon> = {
  headphones: Headphones,
  repeat: Repeat2,
  mic: Mic,
  store: Store,
  book: BookOpen,
  truck: Truck,
  gift: Gift,
  shield: ShieldCheck,
  star: Star,
  heart: Heart,
  users: Users,
  sparkles: BadgeCheck,
  radio: Radio,
  play: PlayCircle,
  clock: Clock,
  tag: Tag,
  library: Library,
  graduation: GraduationCap,
};

export function TrustIcon({
  icon,
  size = 18,
  className,
  strokeWidth = 1.8,
}: {
  icon: TrustIconKey;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  const Component = icons[icon] ?? BadgeCheck;
  return (
    <Component size={size} strokeWidth={strokeWidth} className={className} />
  );
}
