import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] cursor-pointer",
          {
            "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm": variant === "default",
            "bg-destructive text-destructive-foreground hover:bg-red-600 shadow-sm": variant === "destructive",
            "border border-border bg-white text-accent-foreground hover:bg-accent hover:border-border": variant === "outline",
            "text-muted-foreground hover:text-foreground hover:bg-accent": variant === "ghost",
            "bg-secondary text-secondary-foreground hover:bg-accent shadow-sm": variant === "secondary",
          },
          {
            "h-10 px-5 py-2 text-sm": size === "default",
            "h-9 rounded-md px-4 text-xs": size === "sm",
            "h-12 rounded-xl px-8 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
