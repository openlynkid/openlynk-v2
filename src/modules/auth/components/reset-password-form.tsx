"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RuneIcon } from "runeicons-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const activeError = error ?? (!token ? "Token reset tidak valid atau sudah kedaluwarsa." : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok.");
      return;
    }
    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    setLoading(true);
    const { error: err } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    setLoading(false);

    if (err) {
      setError(err.message ?? "Gagal mereset kata sandi. Silakan coba lagi.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="w-full max-w-md relative">
      {/* Background ambient glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Logo */}
      <div className="text-center mb-8 relative">
        <Link href="/" className="inline-flex items-center gap-3 mb-3 group">
          <div className="size-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-white/25 transition">
            <RuneIcon name="glass-chain-link-3-1" type="glass" size={26} />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">OpenLynk</span>
        </Link>
      </div>

      <Card className="rune-glass border-white/10 text-white rounded-2xl relative shadow-2xl p-1 sm:p-2">
        <CardHeader className="space-y-1.5 pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-5">
          <CardTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <RuneIcon name="glass-lock-1" type="glass" size={20} />
            Buat Kata Sandi Baru
          </CardTitle>
          <CardDescription className="text-neutral-400 text-xs">
            Masukkan kata sandi baru untuk akun Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-4">
          {success ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 text-sm text-center space-y-2">
              <div className="flex justify-center">
                <RuneIcon name="glass-circle-check-1" type="glass" size={32} />
              </div>
              <p className="font-semibold text-white">Kata sandi berhasil diubah!</p>
              <p className="text-xs text-neutral-300">Mengalihkan ke halaman login...</p>
            </div>
          ) : (
            <>
              {activeError && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
                  <span className="text-sm">⚠️</span>
                  <span>{activeError}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-neutral-300 text-xs font-medium">
                    Kata Sandi Baru
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || !token}
                    className="border-white/10 bg-black/40 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-indigo-500 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-neutral-300 text-xs font-medium">
                    Konfirmasi Kata Sandi
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Ulangi kata sandi"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading || !token}
                    className="border-white/10 bg-black/40 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-indigo-500 rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full bg-white hover:bg-neutral-200 text-black font-semibold shadow-lg shadow-white/5 rounded-xl transition mt-2 h-11 sm:h-10 text-sm"
                >
                  {loading ? "Menyimpan..." : "Simpan Kata Sandi Baru →"}
                </Button>
              </form>
            </>
          )}
        </CardContent>

        <CardFooter className="pt-3 pb-5 px-4 sm:px-6 flex justify-center border-t border-white/5 text-xs text-neutral-400">
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 py-1 inline-block">
            ← Kembali ke Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <div className="size-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
