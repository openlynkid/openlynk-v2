"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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

function ResetPasswordForm() {
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="size-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">
              OL
            </div>
            <span className="font-bold text-xl tracking-tight text-white">OpenLynk</span>
          </Link>
        </div>

        <Card className="border border-neutral-800 bg-neutral-900/70 backdrop-blur-xl shadow-2xl rounded-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold text-white">Buat Kata Sandi Baru</CardTitle>
            <CardDescription className="text-neutral-400 text-sm">
              Masukkan kata sandi baru untuk akun Anda.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success ? (
              <div className="p-4 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-200 text-sm text-center space-y-2">
                <p className="text-lg">✓</p>
                <p className="font-semibold">Kata sandi berhasil diubah!</p>
                <p className="text-xs text-emerald-300">Mengalihkan ke halaman login...</p>
              </div>
            ) : (
              <>
                {activeError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-200 text-xs">
                    ⚠️ {activeError}
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
                      className="border-neutral-700 bg-neutral-950 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-sky-500"
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
                      className="border-neutral-700 bg-neutral-950 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-sky-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading || !token}
                    className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold shadow-lg shadow-sky-500/20 mt-2"
                  >
                    {loading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
                  </Button>
                </form>
              </>
            )}
          </CardContent>

          <CardFooter className="pt-2 pb-6 flex justify-center border-t border-neutral-800/80 text-xs text-neutral-400">
            <Link href="/login" className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-4">
              ← Kembali ke Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
          <div className="size-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
