"use client";

import { useState } from "react";
import Link from "next/link";
import { RuneIcon } from "runeicons-react";
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
  const preset = getThemePreset(data.themeConfig?.themePreset);

  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${data.slug}`
      : `https://openlynk.id/${data.slug}`;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 relative selection:bg-neutral-800 overflow-x-hidden flex flex-col justify-between w-full">
      {/* Dynamic Ambient Theme Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[350px] ${preset.glows.primary} blur-[130px] rounded-full transition-all duration-700`}
        />
        <div
          className={`absolute top-1/2 -right-48 w-[380px] h-[380px] ${preset.glows.secondary} blur-[140px] rounded-full transition-all duration-700`}
        />
        <div
          className={`absolute bottom-0 -left-48 w-[380px] h-[380px] ${preset.glows.tertiary} blur-[140px] rounded-full transition-all duration-700`}
        />
      </div>

      {/* Top Floating Share Button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          type="button"
          onClick={() => setIsShareOpen(true)}
          title="Bagikan Halaman"
          aria-label="Bagikan Halaman Ini"
          className="size-10 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition shadow-lg backdrop-blur-md active:scale-95"
        >
          <RuneIcon name="glass-chain-link-3-1" type="glass" size={18} />
        </button>
      </div>

      {/* Main Content Container */}
      <main className="w-full max-w-lg sm:max-w-xl mx-auto px-4 py-10 sm:py-14 flex-1 flex flex-col items-center relative z-10">
        {/* Page Header */}
        <PageHeader page={data} profile={data.profile} />

        {/* Bento Grid */}
        <section className="w-full mt-7" aria-label="Bento Grid Halaman">
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
      <footer className="w-full py-6 flex flex-col items-center justify-center relative z-10 border-t border-white/5">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-xs text-neutral-400 hover:text-white transition group"
        >
          <div className="size-4 rounded-md bg-white/[0.05] flex items-center justify-center">
            <RuneIcon name="glass-chain-link-3-1" type="glass" size={12} />
          </div>
          <span>
            Dibuat dengan{" "}
            <strong className="font-semibold text-neutral-200 group-hover:text-white">
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
