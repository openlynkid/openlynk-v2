"use client";

import { useState } from "react";
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

      <Card className="rune-glass border-white/10 text-white rounded-2xl relative shadow-2xl">
        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <RuneIcon name="glass-email" type="glass" size={20} />
            Lupa Kata Sandi
          </CardTitle>
          <CardDescription className="text-neutral-400 text-xs">
            Masukkan email Anda dan kami akan mengirimkan tautan reset kata sandi.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {sent ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 text-sm text-center space-y-2">
              <div className="flex justify-center">
                <RuneIcon name="glass-circle-check-1" type="glass" size={32} />
              </div>
              <p className="font-semibold text-white">Email terkirim!</p>
              <p className="text-xs text-neutral-300">
                Cek kotak masuk Anda untuk tautan reset kata sandi. Tautan berlaku selama 1 jam.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
                  <span className="text-sm">⚠️</span>
                  <span>{error}</span>
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
                    className="border-white/10 bg-black/40 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-indigo-500 rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-neutral-200 text-black font-semibold shadow-lg shadow-white/5 rounded-xl transition mt-2 h-10"
                >
                  {loading ? "Mengirim..." : "Kirim Tautan Reset →"}
                </Button>
              </form>
            </>
          )}
        </CardContent>

        <CardFooter className="pt-2 pb-6 flex justify-center border-t border-white/5 text-xs text-neutral-400">
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
            ← Kembali ke Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
