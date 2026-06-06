const BG_URL =
  "https://ik.imagekit.io/fuagv7oun/IMG-20260602-WA0018.jpg?updatedAt=1780406243703";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .auth-glass {
          position: relative;
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border-radius: 0.75rem;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
          overflow: hidden;
        }
        .auth-glass-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(5,150,105,0.3) 0%, rgba(16,185,129,0.2) 50%, rgba(52,211,153,0.1) 100%);
          border-radius: inherit;
        }
        .auth-glass-content {
          position: relative;
          z-index: 10;
        }
      `}</style>
      <div
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
        style={{ backgroundImage: `url(${BG_URL})` }}
      >
        <div className="relative z-10 w-full max-w-md mx-auto">
          {children}
        </div>
        <footer className="absolute bottom-4 z-10 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} Gusdurian Mojokerto
        </footer>
      </div>
    </>
  );
}
