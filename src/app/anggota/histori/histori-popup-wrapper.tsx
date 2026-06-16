"use client";

import { useSearchParams } from "next/navigation";
import { PendingPopup } from "@/components/shared/pending-popup";

interface HistoriPopupWrapperProps {
  hasPending: boolean;
}

export function HistoriPopupWrapper({ hasPending }: HistoriPopupWrapperProps) {
  const searchParams = useSearchParams();
  const fromSubmit = searchParams.get("pending") === "1";

  return (
    <PendingPopup
      message="Menunggu konfirmasi admin untuk setoran"
      show={fromSubmit || hasPending}
    />
  );
}
