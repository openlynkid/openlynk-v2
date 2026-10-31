import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-neutral-800">
      {/* Top Navbar */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">
              OL
            </div>
            <span className="font-semibold text-lg tracking-tight">OpenLynk</span>
            <span className="text-xs px-2 py-0.5 rounded-full border border-neutral-700 bg-neutral-800 text-neutral-300">
              Next.js 16 + ReUI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-black font-semibold">
                Masuk / Daftar
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-20 flex-1 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/90 text-xs text-neutral-400 mb-8 shadow-inner">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Lingkungan Web Development Siap Digunakan
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight">
          Selamat Datang di{" "}
          <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
            OpenLynk
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl leading-relaxed">
          Proyek Next.js modern yang dilengkapi dengan <strong className="text-neutral-200">ReUI</strong> (registry berbasis shadcn/ui), Tailwind CSS v4, dan TypeScript.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold shadow-lg shadow-sky-500/20">
              Coba Login / Daftar Sekarang →
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Dashboard Pengguna
            </Button>
          </Link>
        </div>

        {/* Feature Grid / Quick Reference */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition">
            <div className="text-sky-400 font-semibold mb-2">⚡ Menjalankan Server Dev</div>
            <p className="text-sm text-neutral-400 mb-4">
              Jalankan server pengembangan lokal dengan pnpm:
            </p>
            <pre className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-sky-300 overflow-x-auto font-mono">
              pnpm dev
            </pre>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition">
            <div className="text-indigo-400 font-semibold mb-2">🎨 Pasang Komponen ReUI</div>
            <p className="text-sm text-neutral-400 mb-4">
              Tambahkan ratusan pattern dan komponen dari ReUI:
            </p>
            <pre className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-indigo-300 overflow-x-auto font-mono">
              pnpm dlx shadcn@latest add @reui/c-button-1
            </pre>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition">
            <div className="text-teal-400 font-semibold mb-2">🧱 Pasang Komponen shadcn</div>
            <p className="text-sm text-neutral-400 mb-4">
              Pasang komponen standar shadcn/ui kapan saja:
            </p>
            <pre className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-teal-300 overflow-x-auto font-mono">
              pnpm dlx shadcn@latest add card dialog
            </pre>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-6 text-center text-xs text-neutral-500">
        <p>OpenLynk &copy; 2026 — Ditenagai oleh Next.js, shadcn/ui & ReUI</p>
      </footer>
    </div>
  );
}
