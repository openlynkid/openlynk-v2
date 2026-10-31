"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function LoginPage() {
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-neutral-800">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="size-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">
              OL
            </div>
            <span className="font-bold text-xl tracking-tight text-white">OpenLynk</span>
          </Link>
          <p className="text-sm text-neutral-400">
            Autentikasi aman dengan Better Auth, Drizzle ORM, & PostgreSQL
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border border-neutral-800 bg-neutral-900/70 backdrop-blur-xl shadow-2xl rounded-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold text-white">
              {isSignUp ? "Buat Akun Baru" : "Masuk ke Akun Anda"}
            </CardTitle>
            <CardDescription className="text-neutral-400 text-sm">
              {isSignUp
                ? "Isi formulir di bawah untuk mendaftarkan akun baru"
                : "Masukkan email dan kata sandi Anda untuk melanjutkan"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-200 text-xs">
                ⚠️ {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-200 text-xs">
                ✓ {success}
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
                    placeholder="Contoh: Thoth User"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                    disabled={loading}
                    className="border-neutral-700 bg-neutral-950 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-sky-500"
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
                  className="border-neutral-700 bg-neutral-950 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-sky-500"
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
                      className="text-xs text-sky-400 hover:text-sky-300 underline underline-offset-4"
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
                  className="border-neutral-700 bg-neutral-950 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-sky-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold shadow-lg shadow-sky-500/20 mt-2"
                disabled={loading}
              >
                {loading ? "Memproses..." : isSignUp ? "Daftar Sekarang" : "Masuk"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-2 pb-6 flex flex-col items-center border-t border-neutral-800/80 text-xs text-neutral-400">
            <p>
              {isSignUp ? "Sudah memiliki akun?" : "Belum punya akun?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccess(null);
                }}
                className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-4 ml-1"
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
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors inline-flex items-center gap-1"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
