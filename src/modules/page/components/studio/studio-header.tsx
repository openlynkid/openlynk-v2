"use client";

import Link from "next/link";
import { RuneIcon } from "runeicons-react";
import { Button } from "@/components/ui/button";

export type ViewportMode = "mobile" | "tablet" | "desktop";

interface StudioHeaderProps {
  pageTitle: string;
  pageSlug: string;
  viewportMode: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  onOpenAddBlock: () => void;
  onOpenSettings: () => void;
  onOpenThemes: () => void;
  onOpenShare: () => void;
  onCopyLink: () => void;
  copied: boolean;
  isSaving: boolean;
  isPublished: boolean;
}

export function StudioHeader({
  pageTitle,
  pageSlug,
  viewportMode,
  onViewportChange,
  onOpenAddBlock,
  onOpenSettings,
  onOpenThemes,
  onOpenShare,
  onCopyLink,
  copied,
  isSaving,
  isPublished,
}: StudioHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-neutral-950/80 border-b border-white/10 backdrop-blur-xl px-4 flex items-center justify-between gap-3 select-none">
      {/* Left: Back & Page Info */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/dashboard/pages"
          title="Kembali ke Daftar Halaman"
          className="size-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition shrink-0"
        >
          <span className="rotate-180 inline-flex">
            <RuneIcon name="glass-arrow-right-circle" type="glass" size={16} />
          </span>
        </Link>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white truncate max-w-[140px] sm:max-w-[220px]">
              {pageTitle}
            </h1>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                isPublished
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-neutral-800 border-white/5 text-neutral-400"
              }`}
            >
              {isPublished ? "Live" : "Draft"}
            </span>

            {isSaving && (
              <span className="text-[11px] text-neutral-400 animate-pulse hidden sm:inline">
                Menyimpan...
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] font-mono text-neutral-500 truncate max-w-[150px] sm:max-w-[200px]">
              openlynk.id/{pageSlug}
            </span>
            <button
              type="button"
              onClick={onCopyLink}
              title="Salin tautan publik"
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium ml-1 transition"
            >
              {copied ? "Tersalin! ✓" : "Salin"}
            </button>
          </div>
        </div>
      </div>

      {/* Center: Viewport Switcher */}
      <div className="hidden md:flex items-center p-1 rounded-xl bg-neutral-900/90 border border-white/10 shadow-inner">
        <button
          type="button"
          onClick={() => onViewportChange("mobile")}
          title="Tampilan Ponsel (380px)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            viewportMode === "mobile"
              ? "bg-white/15 text-white shadow-sm border border-white/15"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <RuneIcon name="glass-phone" type="glass" size={14} />
          <span>Mobile</span>
        </button>

        <button
          type="button"
          onClick={() => onViewportChange("tablet")}
          title="Tampilan Tablet (640px)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            viewportMode === "tablet"
              ? "bg-white/15 text-white shadow-sm border border-white/15"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <RuneIcon name="glass-video" type="glass" size={14} />
          <span>Tablet</span>
        </button>

        <button
          type="button"
          onClick={() => onViewportChange("desktop")}
          title="Tampilan Desktop (768px)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            viewportMode === "desktop"
              ? "bg-white/15 text-white shadow-sm border border-white/15"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <RuneIcon name="glass-code" type="glass" size={14} />
          <span>Desktop</span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          type="button"
          onClick={onOpenAddBlock}
          className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs h-9 px-3.5 shadow-lg flex items-center gap-1.5"
        >
          <RuneIcon name="glass-plus" type="glass" size={16} />
          <span className="hidden sm:inline">Tambah Blok</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onOpenThemes}
          title="Pilihan Tema & Visual"
          className="border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white rounded-xl text-xs h-9 px-3 flex items-center gap-1.5"
        >
          <RuneIcon name="glass-sparkle" type="glass" size={16} />
          <span className="hidden lg:inline">Tema</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onOpenShare}
          title="QR Code & Bagikan"
          className="border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white rounded-xl text-xs h-9 px-3 flex items-center gap-1.5"
        >
          <RuneIcon name="glass-chain-link-3-1" type="glass" size={16} />
          <span className="hidden lg:inline">Bagikan</span>
        </Button>

        <Link
          href={`/${pageSlug}`}
          target="_blank"
          title="Buka halaman live"
          className="size-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition"
        >
          <RuneIcon name="glass-arrow-right-circle" type="glass" size={16} />
        </Link>

        <Button
          type="button"
          variant="outline"
          onClick={onOpenSettings}
          title="Pengaturan Halaman"
          className="size-9 rounded-xl border-white/10 hover:bg-white/5 text-neutral-400 hover:text-white p-0 flex items-center justify-center"
        >
          <RuneIcon name="glass-edit-pen" type="glass" size={16} />
        </Button>
      </div>
    </header>
  );
}
