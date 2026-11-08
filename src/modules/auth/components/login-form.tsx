"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export function LoginForm() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError("Silakan masukkan nama Anda.");
          setLoading(false);
          return;
        }

        await authClient.signUp.email(
          {
            email,
            password,
            name,
          },
          {
            onSuccess: () => {
              setSuccess("Pendaftaran berhasil! Mengalihkan ke dashboard...");
              setTimeout(() => {
                router.push("/dashboard");
              }, 1000);
            },
            onError: (ctx) => {
              setError(ctx.error.message || "Gagal mendaftar. Silakan coba lagi.");
            },
          }
        );
      } else {
        await authClient.signIn.email(
          {
            email,
            password,
          },
          {
            onSuccess: () => {
              setSuccess("Login berhasil! Mengalihkan ke dashboard...");
              setTimeout(() => {
                router.push("/dashboard");
              }, 1000);
            },
            onError: (ctx) => {
              setError(ctx.error.message || "Email atau kata sandi tidak valid.");
            },
          }
        );
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : null) ?? "Terjadi kesalahan yang tidak terduga.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative">
      {/* Background ambient glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Logo & Header */}
      <div className="text-center mb-8 relative">
        <Link href="/" className="inline-flex items-center gap-3 mb-3 group">
          <div className="size-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-white/25 transition">
            <RuneIcon name="glass-chain-link-3-1" type="glass" size={26} />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">OpenLynk</span>
        </Link>
        <p className="text-xs text-neutral-400 mt-1">
          Autentikasi akun aman &amp; terverifikasi
        </p>
      </div>

      {/* Auth Card */}
      <Card className="rune-glass border-white/10 text-white rounded-2xl relative shadow-2xl p-1 sm:p-2">
        <CardHeader className="space-y-1.5 pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-5">
          <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <RuneIcon
              name={isSignUp ? "identity-user-plus" : "glass-lock-1"}
              type={isSignUp ? "duotone" : "glass"}
              size={20}
            />
            {isSignUp ? "Buat Akun Baru" : "Masuk ke Akun Anda"}
          </CardTitle>
          <CardDescription className="text-neutral-400 text-xs">
            {isSignUp
              ? "Daftar untuk mulai mengelola tautan dan identitas Anda"
              : "Masukkan email dan kata sandi untuk mengakses dashboard"}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-4">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2">
              <span className="text-sm">✓</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-neutral-300 text-xs font-medium">
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Contoh: Alex Rivers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  disabled={loading}
                  className="border-white/10 bg-black/40 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-indigo-500 rounded-xl"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-neutral-300 text-xs font-medium">
                Alamat Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="border-white/10 bg-black/40 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-indigo-500 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-neutral-300 text-xs font-medium">
                  Kata Sandi
                </Label>
                {!isSignUp && (
                  <Link
                    href="/forgot-password"
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-4 py-1 inline-block"
                  >
                    Lupa kata sandi?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="border-white/10 bg-black/40 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-indigo-500 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-white hover:bg-neutral-200 text-black font-semibold shadow-lg shadow-white/5 rounded-xl transition mt-2 h-11 sm:h-10 text-sm"
              disabled={loading}
            >
              {loading ? "Memproses..." : isSignUp ? "Daftar Sekarang →" : "Masuk ke Akun →"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pt-3 pb-5 px-4 sm:px-6 flex flex-col items-center border-t border-white/5 text-xs text-neutral-400">
          <p>
            {isSignUp ? "Sudah memiliki akun?" : "Belum punya akun?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 ml-1"
            >
              {isSignUp ? "Masuk di sini" : "Daftar sekarang"}
            </button>
          </p>
        </CardFooter>
      </Card>

      {/* Back Link */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors inline-flex items-center gap-1.5"
        >
          <span>←</span> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
