"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
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

export default function DashboardPage() {
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
          <div className="size-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-400 text-sm">Memeriksa sesi autentikasi...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
        <Card className="max-w-md w-full border border-neutral-800 bg-neutral-900/80 backdrop-blur-xl p-6 text-center">
          <CardHeader>
            <div className="size-12 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center mx-auto text-xl mb-2">
              🔒
            </div>
            <CardTitle className="text-xl font-bold text-white">Akses Ditolak</CardTitle>
            <CardDescription className="text-neutral-400 text-sm">
              Anda belum masuk. Silakan login terlebih dahulu untuk mengakses halaman dashboard.
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-4 flex justify-center gap-3">
            <Link href="/login">
              <Button className="bg-sky-500 hover:bg-sky-400 text-black font-semibold">
                Menuju Halaman Login
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Beranda</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">
              OL
            </div>
            <span className="font-semibold text-lg tracking-tight">OpenLynk</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-400 hidden sm:inline">
              Login sebagai: <strong className="text-neutral-200">{session.user.name}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="border-neutral-700 text-neutral-300 hover:bg-red-950/40 hover:text-red-300 hover:border-red-800"
            >
              Keluar (Sign Out)
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-900/60 bg-emerald-950/30 text-emerald-400 text-xs mb-3">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Sesi Autentikasi Aktif
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Selamat Datang, {session.user.name}! 👋
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Data Anda diambil langsung dari database PostgreSQL melalui Drizzle ORM dan Better Auth.
          </p>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-neutral-800 bg-neutral-900/50 p-6 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-white">Profil Pengguna</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Informasi identitas dari tabel <code className="text-sky-300">user</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-neutral-800/80">
                <span className="text-neutral-400">Nama:</span>
                <span className="font-medium text-white">{session.user.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800/80">
                <span className="text-neutral-400">Email:</span>
                <span className="font-medium text-white">{session.user.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800/80">
                <span className="text-neutral-400">User ID:</span>
                <span className="font-mono text-xs text-neutral-300 truncate max-w-[200px]" title={session.user.id}>
                  {session.user.id}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-400">Email Verified:</span>
                <span className="text-emerald-400 text-xs font-semibold">
                  {session.user.emailVerified ? "Ya" : "Belum verifikasi"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-800 bg-neutral-900/50 p-6 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-white">Detail Sesi Aktif</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Informasi token sesi dari tabel <code className="text-sky-300">session</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-neutral-800/80">
                <span className="text-neutral-400">Session ID:</span>
                <span className="font-mono text-xs text-neutral-300 truncate max-w-[180px]" title={session.session.id}>
                  {session.session.id}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800/80">
                <span className="text-neutral-400">Kedaluwarsa:</span>
                <span className="text-xs text-neutral-300">
                  {new Date(session.session.expiresAt).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-400">IP Address:</span>
                <span className="font-mono text-xs text-neutral-300">
                  {session.session.ipAddress || "127.0.0.1"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps / Quick Info */}
        <div className="mt-8 p-6 rounded-2xl border border-neutral-800 bg-neutral-900/30">
          <h3 className="font-semibold text-white text-sm mb-2">🎉 Arsitektur Autentikasi Berhasil Diterapkan</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Anda dapat menggunakan hook <code className="text-sky-300 font-mono">authClient.useSession()</code> di sisi Client Component atau helper <code className="text-sky-300 font-mono">auth.api.getSession()</code> di sisi Server Component / Route Handler untuk memproteksi endpoint dan halaman Anda.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-6 text-center text-xs text-neutral-500">
        <p>OpenLynk Dashboard &copy; 2026</p>
      </footer>
    </div>
  );
}
