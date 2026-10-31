"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { RuneIcon } from "runeicons-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DashboardView() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="size-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-400 text-xs">Memeriksa sesi autentikasi...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4 relative overflow-hidden w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 blur-[120px] pointer-events-none rounded-full" />
        <Card className="rune-glass max-w-md w-full border-white/10 p-6 text-center rounded-2xl relative shadow-2xl">
          <CardHeader>
            <div className="size-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <RuneIcon name="glass-lock-1" type="glass" size={32} />
            </div>
            <CardTitle className="text-xl font-bold text-white tracking-tight">Akses Ditolak</CardTitle>
            <CardDescription className="text-neutral-400 text-xs mt-1">
              Anda belum masuk. Silakan login terlebih dahulu untuk mengakses halaman dashboard.
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-4 flex justify-center gap-3">
            <Link href="/login">
              <Button className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs h-9">
                Menuju Halaman Login →
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl text-xs h-9">
                Beranda
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between relative selection:bg-neutral-800 overflow-x-hidden w-full">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-cyan-500/5 blur-[140px] rounded-full" />
      </div>

      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-neutral-950/70 backdrop-blur-xl sticky top-0 z-50 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between min-w-0">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="size-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-white/20 transition">
                <RuneIcon name="glass-chain-link-3-1" type="glass" size={20} />
              </div>
              <span className="font-semibold text-base sm:text-lg tracking-tight text-white">OpenLynk</span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1 shrink-0">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-white/[0.08] border border-white/10 transition"
              >
                Overview
              </Link>
              <Link
                href="/dashboard/bio"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/[0.04] transition"
              >
                Halaman Bio
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="text-xs text-neutral-400 hidden md:inline truncate max-w-[200px]">
              Login sebagai: <strong className="text-neutral-200 font-medium">{session.user.name}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="border-white/10 text-neutral-300 hover:bg-red-950/30 hover:text-red-300 hover:border-red-800/80 rounded-xl text-xs h-9 px-3"
            >
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full relative min-w-0">
        <div className="mb-8 sm:mb-10">
          <div className="rune-pill mb-3 sm:mb-4">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-300">Sesi Autentikasi Aktif</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Selamat Datang, {session.user.name}! 👋
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Data Anda terhubung langsung dengan PostgreSQL via Drizzle ORM dan Better Auth bergaya tema Runeicon.
          </p>
        </div>

        {/* Feature 01 Quick Action Callout */}
        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-neutral-900/60 to-neutral-900/60 border border-indigo-500/20 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
              <RuneIcon name="glass-chain-link-3-1" type="glass" size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">Kelola Halaman Bio</h2>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Fitur 01
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Atur username publik Anda (openlynk.id/username), profil diri, dan daftar tautan bio.
              </p>
            </div>
          </div>
          <Link href="/dashboard/bio">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs h-10 px-5 min-h-[44px] w-full sm:w-auto">
              Buka Editor Bio →
            </Button>
          </Link>
        </div>

        {/* Profile Card & Session Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card className="rune-glass rune-glass-hover border-white/10 rounded-2xl p-5 sm:p-6">
            <CardHeader className="pb-3 px-0 pt-0">
              <div className="flex items-center gap-3 mb-1">
                <div className="size-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">
                  <RuneIcon name="glass-circle-person" type="glass" size={24} />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-white">Profil Pengguna</CardTitle>
                  <CardDescription className="text-xs text-neutral-400">
                    Data tersimpan di tabel <code className="text-indigo-300">user</code>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-0 pt-3 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5 gap-2">
                <span className="text-neutral-400 shrink-0">Nama:</span>
                <span className="font-medium text-white text-right truncate">{session.user.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 gap-2">
                <span className="text-neutral-400 shrink-0">Email:</span>
                <span className="font-medium text-white text-right truncate">{session.user.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 gap-2">
                <span className="text-neutral-400 shrink-0">User ID:</span>
                <span className="font-mono text-neutral-300 truncate max-w-[150px] sm:max-w-[200px]" title={session.user.id}>
                  {session.user.id}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-400">Status Verifikasi:</span>
                <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                  ✓ {session.user.emailVerified ? "Terverifikasi" : "Belum verifikasi"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rune-glass rune-glass-hover border-white/10 rounded-2xl p-5 sm:p-6">
            <CardHeader className="pb-3 px-0 pt-0">
              <div className="flex items-center gap-3 mb-1">
                <div className="size-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">
                  <RuneIcon name="glass-shield-check-1" type="glass" size={24} />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-white">Detail Sesi Aktif</CardTitle>
                  <CardDescription className="text-xs text-neutral-400">
                    Token aktif dari tabel <code className="text-indigo-300">session</code>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-0 pt-3 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5 gap-2">
                <span className="text-neutral-400 shrink-0">Session ID:</span>
                <span className="font-mono text-neutral-300 truncate max-w-[150px] sm:max-w-[180px]" title={session.session.id}>
                  {session.session.id}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 gap-2">
                <span className="text-neutral-400 shrink-0">Kedaluwarsa:</span>
                <span className="text-neutral-300 text-right">
                  {new Date(session.session.expiresAt).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between py-2 gap-2">
                <span className="text-neutral-400 shrink-0">IP Address:</span>
                <span className="font-mono text-neutral-300">
                  {session.session.ipAddress || "127.0.0.1"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature showcase callout */}
        <div className="mt-8 p-6 rounded-2xl rune-glass border-white/10">
          <div className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
              <RuneIcon name="glass-circle-info-1" type="glass" size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm mb-1">Tema Runeicon & Modular Monolith Aktif</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Antarmuka ini menggunakan sistem visual kaca tembus pandang (*glassmorphism*) khas Runeicon dengan integrasi komponen berbasis Base UI dan Tailwind CSS v4.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-neutral-500">
        <p>OpenLynk Dashboard &copy; 2026 — Desain UI terinspirasi oleh Runeicon</p>
      </footer>
    </div>
  );
}
