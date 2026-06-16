"use client";

import { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AjukanPencairanForm } from "@/features/pencairan/components/ajukan-pencairan-form";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { PendingPopup } from "@/components/shared/pending-popup";

interface PencairanFormWrapperProps {
  saldo: number;
  hasPending: boolean;
}

export function PencairanFormWrapper({ saldo, hasPending }: PencairanFormWrapperProps) {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(hasPending);

  const handleSuccess = useCallback(() => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000);
    router.refresh();
  }, [router]);

  return (
    <>
      <PendingPopup
        message="Menunggu konfirmasi admin untuk pencairan"
        show={showPopup}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-muted-foreground" />
            Ajukan Pencairan
          </CardTitle>
          <CardDescription>
            Masukkan jumlah yang ingin dicairkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AjukanPencairanForm
            saldo={saldo}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>
    </>
  );
}
