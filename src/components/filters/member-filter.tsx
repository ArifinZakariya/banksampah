"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Users, X } from "lucide-react";

interface Member {
  id: string;
  nama: string;
}

interface MemberFilterProps {
  members: Member[];
  className?: string;
}

export function MemberFilter({ members, className }: MemberFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedUserId = searchParams.get("userId") || "";

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

  const hasFilter = selectedUserId;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>Anggota:</span>
      </div>
      <select
        value={selectedUserId}
        onChange={(e) => updateParam("userId", e.target.value)}
        className="h-9 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        <option value="">Semua Anggota</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nama}
          </option>
        ))}
      </select>
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
