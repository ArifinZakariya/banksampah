"use client";

import { useEffect, useState } from "react";
import { Clock, X } from "lucide-react";

interface PendingPopupProps {
  message: string;
  show: boolean;
  duration?: number;
}

export function PendingPopup({ message, show: initialShow, duration = 5000 }: PendingPopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (initialShow) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timer);
    }
  }, [initialShow, duration]);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-amber-50 border border-amber-200 shadow-lg shadow-amber-100/50 text-amber-700">
        <Clock className="w-5 h-5 flex-shrink-0 animate-pulse" />
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={() => setShow(false)}
          className="ml-2 p-0.5 rounded-full hover:bg-amber-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
