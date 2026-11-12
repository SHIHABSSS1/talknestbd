import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "gold"
  | "outline"
  | "light"
  | "white"
  | "ghost"
  | "clay"
  | "dark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  gold: "bg-sale text-ink hover:bg-gold-400",
  outline:
    "border border-line bg-white text-ink hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
  light:
    "border border-white/25 bg-white/10 text-white hover:bg-white/20",
  white: "bg-white text-brand-800 hover:bg-brand-50",
  ghost: "bg-transparent text-brand-700 hover:bg-brand-50",
  clay: "bg-brand-500 text-white hover:bg-brand-600",
  dark: "bg-ink text-white hover:bg-brand-800",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-10 px-5 text-[13px]",
  lg: "h-11 px-6 text-sm sm:h-12 sm:px-7 sm:text-[15px]",
};

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  target?: string;
  rel?: string;
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-[4px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} target={rest.target} rel={rest.rel}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
