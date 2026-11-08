"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  Plus,
  Palette,
  Share2,
  ExternalLink,
  Settings,
  Check,
  Copy,
} from "lucide-react";
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
  const viewportOptions: { mode: ViewportMode; label: string; icon: typeof Smartphone }[] = [
    { mode: "mobile", label: "Mobile", icon: Smartphone },
    { mode: "tablet", label: "Tablet", icon: Tablet },
    { mode: "desktop", label: "Desktop", icon: Monitor },
  ];

  return (
    <header className="shrink-0 z-40 w-full h-16 bg-neutral-950/85 border-b border-white/10 backdrop-blur-2xl px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 select-none">
      {/* Left: Back Link & Page Context */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link
          href="/dashboard/pages"
          title="Kembali ke Daftar Halaman"
          className="size-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition shrink-0 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        </Link>

        {/* Page Title & Status */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[120px] sm:max-w-[200px] md:max-w-[260px]">
              {pageTitle}
            </h1>

            {/* Status Pill */}
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 flex items-center gap-1 ${
                isPublished
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-neutral-800 text-neutral-400 border-white/10"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isPublished ? "bg-emerald-400 animate-pulse" : "bg-neutral-500"
                }`}
              />
              <span className="hidden sm:inline">{isPublished ? "Live" : "Draft"}</span>
            </span>

            {/* Auto-saving pulse */}
            {isSaving && (
              <span className="text-[10px] text-indigo-400 font-mono flex items-center gap-1 shrink-0">
                <span className="size-1.5 rounded-full bg-indigo-400 animate-ping" />
                <span className="hidden sm:inline">Menyimpan...</span>
              </span>
            )}
          </div>

          {/* URL Pill */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono">
            <span className="truncate max-w-[150px] md:max-w-[220px]">
              openlynk.id/{pageSlug}
            </span>
            <button
              type="button"
              onClick={onCopyLink}
              title="Salin tautan"
              className="text-neutral-400 hover:text-indigo-300 transition cursor-pointer flex items-center"
            >
              {copied ? (
                <Check size={11} className="text-emerald-400" />
              ) : (
                <Copy size={11} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Center: Device Viewport Switcher */}
      <div className="hidden md:flex items-center bg-black/40 border border-white/10 p-1 rounded-xl shadow-inner gap-0.5">
        {viewportOptions.map(({ mode, label, icon: Icon }) => {
          const isActive = viewportMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onViewportChange(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-white/15 text-white font-semibold border border-white/15 shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon size={14} className={isActive ? "text-indigo-400" : "text-neutral-500"} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Studio Actions Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Primary Action: Tambah Blok */}
        <Button
          type="button"
          onClick={onOpenAddBlock}
          className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs h-9 px-3 sm:px-3.5 shadow-lg flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Tambah Blok</span>
        </Button>

        {/* Secondary Toolset Group */}
        <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-xl p-0.5 gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenThemes}
            title="Kustomisasi Tema & Warna"
            className="text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg text-xs h-8 px-2 sm:px-2.5 flex items-center gap-1.5"
          >
            <Palette size={15} className="text-violet-400" />
            <span className="hidden xl:inline">Tema</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenShare}
            title="QR Code & Bagikan Micro-site"
            className="text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg text-xs h-8 px-2 sm:px-2.5 flex items-center gap-1.5"
          >
            <Share2 size={15} className="text-emerald-400" />
            <span className="hidden xl:inline">Bagikan</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            title="Pengaturan Halaman"
            className="text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg text-xs h-8 px-2 sm:px-2.5 flex items-center gap-1.5"
          >
            <Settings size={15} className="text-neutral-400" />
            <span className="hidden xl:inline">Setelan</span>
          </Button>
        </div>

        {/* Live Preview Button */}
        <Link
          href={`/${pageSlug}`}
          target="_blank"
          rel="noreferrer"
          title="Buka halaman publik di tab baru"
          className="size-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition shrink-0"
        >
          <ExternalLink size={15} />
        </Link>
      </div>
    </header>
  );
}
