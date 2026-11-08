"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Download, Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialIcon } from "@/components/ui/social-icon";

interface QrShareCardProps {
  username: string;
  displayName: string;
  baseUrl?: string;
}

export function QrShareCard({
  username,
  displayName,
  baseUrl = "https://openlynk.id",
}: QrShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const publicUrl = `${baseUrl}/${username}`;

  useEffect(() => {
    if (publicUrl) {
      QRCode.toDataURL(publicUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#0b0b10",
          light: "#ffffff",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch(() => setQrDataUrl(null));
    }
  }, [publicUrl]);

  const handleCopy = async () => {
    const currentUrl =
      typeof window !== "undefined" && window.location.origin
        ? `${window.location.origin}/${username}`
        : publicUrl;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `openlynk-${username}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareText = `Kunjungi halaman bio dan karya resmi ${displayName} di OpenLynk: ${publicUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="rounded-2xl rune-glass border-white/10 p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between">
      {/* Glow accent */}
      <div className="absolute -top-16 -right-16 size-40 bg-indigo-500/10 blur-2xl pointer-events-none rounded-full" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-indigo-400">
              <Share2 size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                QR Code &amp; Bagikan Bio
              </h3>
              <p className="text-[11px] text-neutral-400">
                Akses cepat untuk audiens dan media sosial
              </p>
            </div>
          </div>

          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            Live QR
          </span>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-3 rounded-2xl w-fit mx-auto shadow-2xl border-4 border-neutral-900/40 relative group my-2">
          {qrDataUrl ? (
            <Image
              src={qrDataUrl}
              alt={`QR Code ${username}`}
              width={140}
              height={140}
              className="rounded-lg object-contain"
              unoptimized
            />
          ) : (
            <div className="size-[140px] flex items-center justify-center bg-neutral-100 rounded-lg text-neutral-400 text-xs">
              Menyiapkan QR...
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-neutral-400 font-mono mt-2 truncate">
          openlynk.id/{username}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="w-full bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs h-9 gap-1.5 shadow"
          >
            <Download size={13} />
            <span>Unduh QR</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className={`w-full rounded-xl text-xs h-9 gap-1.5 border-white/10 transition-all ${
              copied
                ? "bg-emerald-500 text-black font-semibold border-emerald-400"
                : "text-white hover:bg-white/5"
            }`}
          >
            {copied ? (
              <>
                <Check size={13} />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Salin Link</span>
              </>
            )}
          </Button>
        </div>

        {/* Quick Share to Socials */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            suppressHydrationWarning
            className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/50 text-[11px] font-medium transition"
          >
            <SocialIcon platform="whatsapp" size={13} />
            <span>WhatsApp</span>
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            suppressHydrationWarning
            className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl bg-sky-950/30 border border-sky-500/20 text-sky-400 hover:bg-sky-950/50 text-[11px] font-medium transition"
          >
            <SocialIcon platform="twitter" size={13} />
            <span>Twitter/X</span>
          </a>
        </div>
      </div>
    </div>
  );
}
