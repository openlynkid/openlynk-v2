"use client";

import { useState } from "react";
import Link from "next/link";
import { Share2, Copy, Check } from "lucide-react";
import { RuneIcon } from "@/components/ui/rune-icon";
import type { PublicPageData } from "../types";
import { getThemePreset } from "../types/themes";
import { PageHeader } from "./page-header";
import { BentoGrid } from "./bento-grid";
import { PageShareModal } from "./page-share-modal";

interface PublicPageViewProps {
  data: PublicPageData;
}

export function PublicPageView({ data }: PublicPageViewProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const preset = getThemePreset(data.themeConfig?.themePreset);

  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${data.slug}`
      : `https://openlynk.id/${data.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      style={
        {
          "--theme-accent": preset.accentColor,
        } as React.CSSProperties
      }
      className="min-h-screen bg-neutral-950 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] text-neutral-100 relative selection:bg-neutral-800 overflow-x-hidden flex flex-col justify-between w-full"
    >
      {/* Dynamic Ambient Theme Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[380px] ${preset.glows.primary} blur-[130px] rounded-full transition-all duration-700`}
        />
        <div
          className={`absolute top-1/3 -right-48 w-[420px] h-[420px] ${preset.glows.secondary} blur-[150px] rounded-full transition-all duration-700`}
        />
        <div
          className={`absolute bottom-1/4 -left-48 w-[420px] h-[420px] ${preset.glows.tertiary} blur-[150px] rounded-full transition-all duration-700`}
        />
      </div>

      {/* Top Floating Glass Action Dock (Share & Copy Link) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-1 p-1 rounded-full rune-glass border border-white/10 shadow-xl backdrop-blur-2xl">
        <button
          type="button"
          onClick={handleCopyLink}
          title={copied ? "Tautan Tersalin!" : "Salin Tautan Halaman"}
          aria-label="Salin Tautan Halaman"
          className="size-9 rounded-full hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-95 cursor-pointer"
        >
          {copied ? (
            <Check size={16} className="text-emerald-400 animate-in zoom-in-75 duration-200" />
          ) : (
            <Copy size={16} />
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsShareOpen(true)}
          title="Bagikan & QR Code"
          aria-label="Bagikan Halaman Ini"
          className="size-9 rounded-full hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-95 cursor-pointer"
        >
          <Share2 size={16} />
        </button>
      </div>

      {/* Copied Feedback Toast */}
      {copied && (
        <div className="fixed top-16 right-4 sm:top-20 sm:right-6 z-30 animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/95 border border-emerald-500/30 px-3.5 py-1.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-1.5">
            <Check size={12} className="text-emerald-400" />
            <span>Tautan tersalin ke papan klip!</span>
          </span>
        </div>
      )}

      {/* Main Content Container (Proportionally optimized for 4-column Bento) */}
      <main className="w-full max-w-xl sm:max-w-2xl md:max-w-[740px] lg:max-w-[780px] mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 flex flex-col items-center relative z-10">
        {/* Page Header */}
        <PageHeader page={data} profile={data.profile} />

        {/* Bento Grid */}
        <section className="w-full mt-8" aria-label="Bento Grid Halaman">
          {data.blocks.length > 0 ? (
            <BentoGrid blocks={data.blocks} />
          ) : (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-neutral-500 text-sm">
              Belum ada blok konten di halaman ini.
            </div>
          )}
        </section>
      </main>

      {/* OpenLynk Watermark Footer */}
      <footer className="w-full py-8 flex flex-col items-center justify-center relative z-10 border-t border-white/5 mt-10">
        <Link
          href="/"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full rune-glass border border-white/10 hover:border-white/20 hover:bg-white/[0.06] text-xs text-neutral-400 hover:text-white transition duration-200 shadow-md group active:scale-95"
        >
          <div className="size-4 rounded-md bg-white/[0.08] flex items-center justify-center text-white">
            <RuneIcon name="glass-chain-link-3-1" type="glass" size={13} />
          </div>
          <span>
            Dibuat dengan{" "}
            <strong className="font-semibold text-neutral-200 group-hover:text-white tracking-tight">
              OpenLynk
            </strong>
          </span>
        </Link>
      </footer>

      {/* Share & QR Code Modal */}
      <PageShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={pageUrl}
        title={data.title}
      />
    </div>
  );
}
