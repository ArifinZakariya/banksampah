"use client";

import type { Log } from "@/types";

interface LogTableProps {
  logs: Log[];
}

export function LogTable({ logs }: LogTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 font-medium">User</th>
            <th className="pb-3 font-medium">Aksi</th>
            <th className="pb-3 font-medium">Detail</th>
            <th className="pb-3 font-medium">Waktu</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b last:border-0">
              <td className="py-3">{log.user?.nama ?? "-"}</td>
              <td className="py-3">{log.aksi}</td>
              <td className="py-3">{log.detail ?? "-"}</td>
              <td className="py-3">
                {new Date(log.createdAt).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
