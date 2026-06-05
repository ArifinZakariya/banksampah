import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const variants = {
  default: "bg-primary-light text-primary border-transparent",
  secondary: "bg-secondary text-secondary-foreground border-transparent",
  destructive: "bg-red-50 text-red-700 border-transparent",
  success: "bg-green-50 text-green-700 border-transparent",
  warning: "bg-amber-50 text-amber-700 border-transparent",
  outline: "bg-white text-foreground border-border",
};

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
