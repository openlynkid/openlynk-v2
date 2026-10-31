"use client";

import { useState } from "react";
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

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: err } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    setLoading(false);

    if (err) {
      setError(err.message ?? "Gagal mengirim email. Silakan coba lagi.");
    } else {
      setSent(true);
    }
  };

  return (
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
          <CardTitle className="text-xl font-bold text-white">Lupa Kata Sandi</CardTitle>
          <CardDescription className="text-neutral-400 text-sm">
            Masukkan email Anda dan kami akan mengirimkan tautan reset kata sandi.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {sent ? (
            <div className="p-4 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-200 text-sm text-center space-y-2">
              <p className="text-lg">✉️</p>
              <p className="font-semibold">Email terkirim!</p>
              <p className="text-xs text-emerald-300">
                Cek kotak masuk Anda untuk tautan reset kata sandi. Tautan berlaku selama 1 jam.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-200 text-xs">
                  ⚠️ {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold shadow-lg shadow-sky-500/20 mt-2"
                >
                  {loading ? "Mengirim..." : "Kirim Tautan Reset"}
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
  );
}
