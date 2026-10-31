import Link from "next/link";
import { RuneIcon } from "runeicons-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between relative selection:bg-neutral-800 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] bg-cyan-500/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 -left-48 w-[500px] h-[500px] bg-violet-500/5 blur-[160px] pointer-events-none rounded-full" />

      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-neutral-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-white/20 transition">
              <RuneIcon name="glass-chain-link-3-1" type="glass" size={22} />
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">OpenLynk</span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-white/10 bg-white/[0.03] text-neutral-400 hidden sm:inline">
              Runeicon Theme
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button size="sm" className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs h-9 px-4">
                Masuk / Daftar
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-white/10 text-neutral-300 hover:bg-white/5 rounded-xl text-xs h-9">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-20 flex-1 flex flex-col items-center justify-center text-center relative z-10">
        <div className="rune-pill mb-8">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-neutral-200">
            Adopsi Desain UI & Tema Runeicon Resmi
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.15] text-white">
          Infrastruktur Modern dengan{" "}
          <span className="bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
            Estetika Runeicon
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-lg text-neutral-400 max-w-2xl leading-relaxed">
          OpenLynk dibangun menggunakan arsitektur <strong className="text-neutral-200">Modular Monolith</strong>, Next.js 16, Better Auth, Drizzle ORM, serta paket ikon <strong className="text-neutral-200">Runeicons</strong> berkategori Glass, Duotone, dan Outline.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="bg-white hover:bg-neutral-200 text-black font-semibold shadow-xl shadow-white/5 rounded-xl px-6 h-11 text-sm transition">
              Coba Sekarang →
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="border-white/10 text-white hover:bg-white/5 rounded-xl px-6 h-11 text-sm transition">
              Akses Dashboard
            </Button>
          </Link>
        </div>

        {/* Runeicon 5-Styles Showcase Grid */}
        <div className="mt-20 w-full text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">5 Gaya Visual Ikon Runeicon</h2>
              <p className="text-xs text-neutral-400">Runeicons menghadirkan fleksibilitas desain untuk berbagai kebutuhan antarmuka</p>
            </div>
            <span className="text-xs text-neutral-500 font-mono hidden sm:inline">runeicons-react</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Style 1: Glass */}
            <div className="rune-glass rune-glass-hover p-5 rounded-2xl border-white/10 text-center flex flex-col items-center">
              <div className="size-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-3 shadow-inner">
                <RuneIcon name="glass-chain-link-3-1" type="glass" size={32} />
              </div>
              <h3 className="text-sm font-semibold text-white">Glass</h3>
              <p className="text-[11px] text-neutral-400 mt-1 leading-snug">Efek kaca tembus pandang dengan pantulan cahaya halus.</p>
            </div>

            {/* Style 2: Duotone */}
            <div className="rune-glass rune-glass-hover p-5 rounded-2xl border-white/10 text-center flex flex-col items-center">
              <div className="size-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-3">
                <RuneIcon name="identity-shield-check" type="duotone" size={28} />
              </div>
              <h3 className="text-sm font-semibold text-white">Duotone</h3>
              <p className="text-[11px] text-neutral-400 mt-1 leading-snug">Dua lapisan kedalaman nada warna berpadu harmonis.</p>
            </div>

            {/* Style 3: Outline */}
            <div className="rune-glass rune-glass-hover p-5 rounded-2xl border-white/10 text-center flex flex-col items-center">
              <div className="size-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-3">
                <RuneIcon name="identity-shield" type="normal" size={28} />
              </div>
              <h3 className="text-sm font-semibold text-white">Outline</h3>
              <p className="text-[11px] text-neutral-400 mt-1 leading-snug">Garis tipis minimalis 24px yang tajam dan presisi.</p>
            </div>

            {/* Style 4: Fill */}
            <div className="rune-glass rune-glass-hover p-5 rounded-2xl border-white/10 text-center flex flex-col items-center">
              <div className="size-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-3">
                <RuneIcon name="identity-shield-check" type="fill" size={28} />
              </div>
              <h3 className="text-sm font-semibold text-white">Fill</h3>
              <p className="text-[11px] text-neutral-400 mt-1 leading-snug">Ikon solid untuk penekanan visual yang kuat.</p>
            </div>

            {/* Style 5: Pixelated */}
            <div className="rune-glass rune-glass-hover p-5 rounded-2xl border-white/10 text-center flex flex-col items-center">
              <div className="size-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-3">
                <RuneIcon name="identity-shield" type="pixelated" size={28} />
              </div>
              <h3 className="text-sm font-semibold text-white">Pixelated</h3>
              <p className="text-[11px] text-neutral-400 mt-1 leading-snug">Sentuhan retro 8-bit bergaya nostalgia klasik.</p>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="rune-glass p-6 rounded-2xl border-white/10">
            <div className="flex items-center gap-2.5 mb-2 text-white font-semibold text-sm">
              <RuneIcon name="glass-circle-info-1" type="glass" size={20} />
              <span>Modular Monolith</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Arsitektur terstruktur dalam domain terisolasi (<code className="text-neutral-300 font-mono">src/modules/</code>) dengan batas Public API yang ketat.
            </p>
          </div>

          <div className="rune-glass p-6 rounded-2xl border-white/10">
            <div className="flex items-center gap-2.5 mb-2 text-white font-semibold text-sm">
              <RuneIcon name="glass-lock-1" type="glass" size={20} />
              <span>Better Auth & Resend</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Autentikasi sesi aman, verifikasi email otomatis, dan reset kata sandi menggunakan Drizzle ORM adapter.
            </p>
          </div>

          <div className="rune-glass p-6 rounded-2xl border-white/10">
            <div className="flex items-center gap-2.5 mb-2 text-white font-semibold text-sm">
              <RuneIcon name="glass-email" type="glass" size={20} />
              <span>ImageKit CDN Ready</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Provider media bawaan untuk optimasi gambar dan video secara real-time di seluruh rute aplikasi.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-neutral-500 relative z-10">
        <p>OpenLynk &copy; 2026 — Didukung oleh Next.js, Base UI, & Runeicons</p>
      </footer>
    </div>
  );
}
