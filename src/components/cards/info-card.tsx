import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface InfoCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  label: string;
  value: string | number;
}

export function InfoCard({ icon, label, value, className, ...props }: InfoCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-4 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-xl">{icon}</span>}
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
