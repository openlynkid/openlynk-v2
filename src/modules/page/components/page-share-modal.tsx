"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Send } from "lucide-react";
import { RuneIcon } from "@/components/ui/rune-icon";
import { SocialIcon } from "@/components/ui/social-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PageShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export function PageShareModal({
  isOpen,
  onClose,
  url,
  title,
}: PageShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && url) {
      QRCode.toDataURL(url, {
        width: 280,
        margin: 2,
        color: {
          dark: "#0a0a0c",
          light: "#ffffff",
        },
      })
        .then((data) => setQrDataUrl(data))
        .catch(() => setQrDataUrl(null));
    }
  }, [isOpen, url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const shareWhatsapp = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Lihat halaman ${title} di OpenLynk: ${url}`
  )}`;

  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Lihat halaman ${title} di @OpenLynk`
  )}&url=${encodeURIComponent(url)}`;

  const shareTelegram = `https://t.me/share/url?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(title)}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-sm rounded-3xl bg-neutral-900/95 border-white/15 p-6 shadow-2xl backdrop-blur-2xl flex flex-col items-center text-center space-y-3">
        <div className="size-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <RuneIcon name="glass-chain-link-3-1" type="glass" size={22} />
        </div>

        <DialogHeader className="text-center items-center">
          <DialogTitle className="text-lg font-bold text-white tracking-tight">
            Bagikan Halaman Ini
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
            {title}
          </DialogDescription>
        </DialogHeader>

        {/* QR Code Container */}
        <div className="p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-white/20">
          {qrDataUrl ? (
            <Image
              src={qrDataUrl}
              alt={`QR Code untuk ${url}`}
              width={160}
              height={160}
              className="rounded-lg"
              unoptimized
            />
          ) : (
            <div className="size-40 flex items-center justify-center text-neutral-400 text-xs">
              Membuat QR Code...
            </div>
          )}
        </div>

        {/* Direct Link & Copy */}
        <div className="w-full">
          <div className="flex items-center rounded-xl border border-white/10 bg-neutral-950/70 p-1.5 min-w-0">
            <span className="text-xs text-neutral-400 truncate px-2.5 font-mono select-all flex-1 text-left">
              {url}
            </span>
            <Button
              type="button"
              onClick={handleCopy}
              className={`rounded-lg text-xs font-semibold h-8 px-3 transition ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-black hover:bg-neutral-200"
              }`}
            >
              {copied ? "Tersalin! ✓" : "Salin Link"}
            </Button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="w-full pt-2 border-t border-white/5 flex items-center justify-center gap-3">
          <a
            href={shareWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            title="Bagikan ke WhatsApp"
            className="flex-1 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center justify-center gap-1.5 transition"
          >
            <SocialIcon platform="whatsapp" size={14} />
            <span>WhatsApp</span>
          </a>

          <a
            href={shareTwitter}
            target="_blank"
            rel="noopener noreferrer"
            title="Bagikan ke X"
            className="flex-1 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 text-xs font-medium flex items-center justify-center gap-1.5 transition"
          >
            <SocialIcon platform="x" size={14} />
            <span>X (Twitter)</span>
          </a>

          <a
            href={shareTelegram}
            target="_blank"
            rel="noopener noreferrer"
            title="Bagikan ke Telegram"
            className="flex-1 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 text-xs font-medium flex items-center justify-center gap-1.5 transition"
          >
            <Send size={14} />
            <span>Telegram</span>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
