"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared";
import { SampahForm } from "@/features/sampah/components/sampah-form";

export default function TambahSampahPage() {
  const router = useRouter();

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader
        title="Tambah Sampah"
        description="Masukkan jenis sampah baru"
      />
      <SampahForm onSuccess={() => router.push("/admin/sampah")} />
    </div>
  );
}
