"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Trash2,
  ScrollText,
  Wallet,
  LogOut,
  Menu,
  X,
  Recycle,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNotificationCounts } from "@/hooks/useNotificationCounts";

const navItems = [
  { href: "/anggota", label: "Dashboard", icon: LayoutDashboard },
  { href: "/anggota/setor", label: "Setor Sampah", icon: Trash2 },
  { href: "/anggota/histori", label: "Histori", icon: ScrollText, markMenu: "histori" },
  { href: "/anggota/pencairan", label: "Pencairan", icon: Wallet, markMenu: "pencairan_anggota" },
  { href: "/anggota/leaderboard", label: "Peringkat", icon: Trophy },
];

export function AnggotaSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { hasNewHistori, hasNewPencairanAnggota, markAsRead } = useNotificationCounts();

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-md border border-border"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-md"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "glass-sidebar-sky fixed inset-y-0 left-0 z-40 w-64 flex flex-col text-white transition-transform duration-300 lg:relative lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="glass-panel flex items-center justify-center w-10 h-10 rounded-xl">
            <Recycle className="w-5 h-5 text-sky-200" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Bank Sampah</h1>
            <p className="text-xs text-sky-200/80">Panel Anggota</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            const showBadge =
              (item.markMenu === "histori" && hasNewHistori) ||
              (item.markMenu === "pencairan_anggota" && hasNewPencairanAnggota);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setMobileOpen(false);
                  if (item.markMenu) {
                    markAsRead(item.markMenu);
                  }
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "glass-item-active text-white shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", active && "text-sky-200")} />
                <span>{item.label}</span>
                {showBadge && (
                  <span className="ml-auto inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 hover:text-red-200 hover:bg-red-500/10 transition-all duration-200 w-full cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
