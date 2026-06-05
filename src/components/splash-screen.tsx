"use client";

import { useState, useEffect } from "react";

const BG_URL =
  "https://ik.imagekit.io/fuagv7oun/IMG-20260602-WA0018.jpg?updatedAt=1780406243703";

const words = ["Ubah", "Sampah", "Jadi", "Berkah"];

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true);
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    words.forEach((_, i) => {
      setTimeout(() => setVisible(i + 1), (i + 1) * 400);
    });
    const timer = setTimeout(() => {
      setShow(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return <>{children}</>;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${BG_URL})` }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <p className="relative z-10 text-4xl sm:text-5xl md:text-7xl font-bold text-white flex gap-3 sm:gap-4 flex-wrap justify-center px-4 select-none">
        {words.map((word, i) => (
          <span
            key={word}
            className="transition-all duration-700"
            style={{
              opacity: i < visible ? 1 : 0,
              transform: i < visible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
}
