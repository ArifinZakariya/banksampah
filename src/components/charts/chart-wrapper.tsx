"use client";

import { useEffect, useRef } from "react";

interface ChartWrapperProps {
  title: string;
  children?: React.ReactNode;
}

export function ChartWrapper({ title, children }: ChartWrapperProps) {
  return (
    <div className="rounded-lg border bg-gradient-to-br from-white to-gray-50 p-4">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        {children ?? "Chart akan tersedia"}
      </div>
    </div>
  );
}
