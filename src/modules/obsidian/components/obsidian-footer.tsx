import Link from "next/link";

export function ObsidianFooter() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950/80 backdrop-blur-xl mt-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
        <div className="flex items-center gap-3">
          <div className="size-7 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#A78BFA"
              strokeWidth="1.75"
              strokeLinejoin="round"
            >
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
            </svg>
          </div>
          <span>
            &copy; 2026 <strong>Obsidian Design System</strong> &bull; Tactile Glassmorphism &amp; High-Precision Engineering.
          </span>
        </div>

        <div className="flex items-center gap-4 text-neutral-400">
          <a href="#overview" className="hover:text-white transition">
            Overview
          </a>
          <a href="#logo" className="hover:text-white transition">
            Identity
          </a>
          <a href="#colors" className="hover:text-white transition">
            Colors
          </a>
          <a href="#typography" className="hover:text-white transition">
            Typography
          </a>
          <a href="#components" className="hover:text-white transition">
            Components
          </a>
          <Link href="/" className="hover:text-white transition">
            Beranda
          </Link>
        </div>
      </div>
    </footer>
  );
}
