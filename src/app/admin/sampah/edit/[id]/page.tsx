"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import { PageHeader } from "@/components/shared";
import { SampahForm } from "@/features/sampah/components/sampah-form";
import { LoadingSpinner } from "@/components/shared";
import type { Sampah } from "@/types";

export default function EditSampahPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: sampah, isLoading } = useSWR<Sampah>(`/api/sampah`, fetcher);

  const allSampah: Sampah[] = Array.isArray(sampah) ? sampah : [];
  const initialData = allSampah.find((s) => s.id === id);

  if (isLoading) return <LoadingSpinner />;
  if (!initialData) return <p className="text-muted-foreground">Data tidak ditemukan</p>;

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader
        title="Edit Sampah"
        description="Ubah data jenis sampah"
      />
      <SampahForm
        initialData={initialData}
        onSuccess={() => router.push("/admin/sampah")}
      />
    </div>
  );
}
