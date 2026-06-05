import { AnggotaSidebar } from "@/components/layouts/anggota-sidebar";

export const dynamic = "force-dynamic";

export default function AnggotaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AnggotaSidebar />
      <main className="flex-1 min-w-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
