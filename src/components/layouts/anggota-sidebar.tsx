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
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const navItems = [
  { href: "/anggota", label: "Dashboard", icon: LayoutDashboard },
  { href: "/anggota/setor", label: "Setor Sampah", icon: Trash2 },
  { href: "/anggota/histori", label: "Histori", icon: ScrollText },
  { href: "/anggota/pencairan", label: "Pencairan", icon: Wallet },
];

export function AnggotaSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

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
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-gradient-to-b from-sky-900 to-sky-950 text-white transition-transform duration-300 lg:relative lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sky-700/50">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-400/20">
            <Recycle className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Bank Sampah</h1>
            <p className="text-xs text-sky-300">Panel Anggota</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-sky-400/15 text-sky-200 shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-sky-800/50"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", active && "text-sky-300")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sky-700/50">
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
