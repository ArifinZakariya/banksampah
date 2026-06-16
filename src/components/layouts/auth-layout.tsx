// ImageKit transformations: auto format (webp/avif), compressed quality,
// capped width and progressive rendering so the background loads fast.
const BG_URL =
  "https://ik.imagekit.io/fuagv7oun/IMG-20260602-WA0018.jpg?updatedAt=1780406243703&tr=w-1920,q-60,f-auto,pr-true";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Fetch the background early with high priority instead of waiting for CSS */}
      <link rel="preload" as="image" href={BG_URL} fetchPriority="high" />
      <style>{`
        .auth-glass {
          position: relative;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 0.75rem;
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.35);
          overflow: hidden;
          background-color: rgba(0,0,0,0.25);
        }
        .auth-glass-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0,0,0,0.55);
          border-radius: inherit;
        }
        .auth-glass-content {
          position: relative;
          z-index: 10;
        }
      `}</style>
      <div
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
        style={{ backgroundImage: `url(${BG_URL})`, backgroundColor: "#0c1f33" }}
      >
        <div className="relative z-10 w-full max-w-md mx-auto">
          {children}
        </div>
        <footer className="absolute bottom-4 z-10 text-center text-sm text-white font-medium bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
          &copy; 2026 Gusdurian Mojokerto
        </footer>
      </div>
    </>
  );
}
