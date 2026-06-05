"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AjukanPencairanForm } from "@/features/pencairan/components/ajukan-pencairan-form";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";

interface PencairanFormWrapperProps {
  saldo: number;
}

export function PencairanFormWrapper({ saldo }: PencairanFormWrapperProps) {
  const router = useRouter();

  return (
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
          onSuccess={() => {
            router.refresh();
          }}
        />
      </CardContent>
    </Card>
  );
}
