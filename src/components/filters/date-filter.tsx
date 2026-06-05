"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Calendar, X } from "lucide-react";

interface DateFilterProps {
  className?: string;
}

export function DateFilter({ className }: DateFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = searchParams.get("start") || "";
  const endDate = searchParams.get("end") || "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("start");
    params.delete("end");
    params.delete("userId");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const hasFilter = startDate || endDate;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4" />
        <span>Filter:</span>
      </div>
      <input
        type="date"
        value={startDate}
        onChange={(e) => updateParam("start", e.target.value)}
        className="h-9 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
      <span className="text-muted-foreground text-sm">s/d</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => updateParam("end", e.target.value)}
        className="h-9 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
      {hasFilter && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Reset
        </button>
      )}
    </div>
  );
}
