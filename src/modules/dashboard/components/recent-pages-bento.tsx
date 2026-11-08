"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Palette, ExternalLink, ArrowRight, Star, Layers, Copy, Check } from "lucide-react";
import { RuneIcon } from "@/components/ui/rune-icon";
import { Button } from "@/components/ui/button";
import { THEME_PRESETS, type ThemePresetId } from "@/modules/page";
import type { DashboardPageSummary } from "../types";

interface RecentPagesBentoProps {
  pages: DashboardPageSummary[];
  profileUsername: string;
  onOpenCreatePage?: () => void;
}

export function RecentPagesBento({
  pages,
  profileUsername,
  onOpenCreatePage,
}: RecentPagesBentoProps) {
  const [copiedPageId, setCopiedPageId] = useState<string | null>(null);
  const recentPages = pages.slice(0, 4);

  const handleCopyLink = async (slug: string, pageId: string) => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://openlynk.id";
    const url = `${origin}/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedPageId(pageId);
      setTimeout(() => setCopiedPageId(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Halaman Micro-site Anda
          </h2>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-neutral-300">
            {pages.length} Total
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onOpenCreatePage && (
            <Button
              size="sm"
              onClick={onOpenCreatePage}
              className="bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs h-8 px-3 gap-1 border border-white/10"
            >
              <Plus size={14} />
              <span className="hidden xs:inline">Buat Halaman</span>
            </Button>
          )}

          <Link
            href="/dashboard/pages"
            className="text-xs font-medium text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Semua</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Pages Grid or Empty State */}
      {recentPages.length === 0 ? (
        <div className="rounded-2xl rune-glass border-white/10 p-8 text-center relative overflow-hidden">
          <div className="size-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 text-indigo-400">
            <RuneIcon name="glass-chain-link-3-1" type="glass" size={32} />
          </div>
          <h3 className="text-base font-bold text-white">Belum Ada Halaman Micro-site</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mt-1.5 leading-relaxed">
            Mulai petualangan kreator Anda dengan membuat micro-site pertama untuk memajang link portofolio, karya, dan media sosial.
          </p>
          <div className="mt-5">
            {onOpenCreatePage ? (
              <Button
                onClick={onOpenCreatePage}
                className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs h-9 px-4 gap-1.5 shadow"
              >
                <Plus size={15} />
                <span>Buat Halaman Pertama</span>
              </Button>
            ) : (
              <Link href="/dashboard/pages">
                <Button className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs h-9 px-4 gap-1.5 shadow">
                  <Plus size={15} />
                  <span>Buat Halaman Pertama</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentPages.map((page) => {
            const isPrimary = page.isDefault || page.slug === profileUsername;
            const themeConfig = page.themeConfig as { themePreset?: string; accentColor?: string };
            const presetId = (themeConfig?.themePreset || "obsidian") as ThemePresetId;
            const theme = THEME_PRESETS[presetId] || THEME_PRESETS.obsidian;

            return (
              <div
                key={page.id}
                className="group rounded-2xl rune-glass rune-glass-hover border-white/10 overflow-hidden flex flex-col justify-between transition-all relative"
              >
                {/* Visual Theme Banner Mockup */}
                <div className={`h-12 w-full bg-gradient-to-r ${theme.swatchGradient} opacity-30 group-hover:opacity-50 transition-opacity relative p-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-white/60" />
                    <span className="size-2 rounded-full bg-white/40" />
                    <span className="size-2 rounded-full bg-white/20" />
                  </div>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-white/80 font-bold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md">
                    {theme.name}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="size-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 text-indigo-300 group-hover:scale-105 transition-transform">
                        <RuneIcon name="glass-sparkle" type="glass" size={20} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                            {page.title}
                          </h4>
                          {isPrimary && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-0.5">
                              <Star size={10} className="fill-amber-300" />
                              <span>Utama</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-neutral-400 font-mono truncate">
                            openlynk.id/{page.slug}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${
                        page.isPublished
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-neutral-800 text-neutral-400 border-neutral-700"
                      }`}
                    >
                      {page.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  {/* Visual Bento Mini Mockup Grid */}
                  <div className="bg-black/30 rounded-xl border border-white/5 p-2.5 grid grid-cols-3 gap-1.5">
                    <div className="col-span-2 h-7 rounded-lg bg-white/[0.03] border border-white/5 flex items-center px-2">
                      <span className="size-2 rounded-full bg-indigo-400/60 mr-1.5" />
                      <span className="text-[9px] text-neutral-500 truncate">Kartu Utama</span>
                    </div>
                    <div className="col-span-1 h-7 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center">
                      <span className="text-[9px] text-neutral-500 font-mono">1x1</span>
                    </div>
                    <div className="col-span-1 h-7 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center">
                      <span className="text-[9px] text-neutral-500 font-mono">1x1</span>
                    </div>
                    <div className="col-span-2 h-7 rounded-lg bg-white/[0.03] border border-white/5 flex items-center px-2">
                      <span className="size-2 rounded-full bg-emerald-400/60 mr-1.5" />
                      <span className="text-[9px] text-neutral-500 truncate">Sosial &amp; Media</span>
                    </div>
                  </div>

                  {/* Page Details / Badges */}
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="inline-flex items-center gap-1">
                      <Layers size={12} className="text-neutral-500" />
                      <span>{page.blocksCount} Blok Bento</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(page.slug, page.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition cursor-pointer"
                    >
                      {copiedPageId === page.id ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span className="text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Salin Link</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <Link href={`/dashboard/pages/${page.id}`} className="flex-1">
                      <Button
                        size="sm"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs h-9 gap-1.5 shadow"
                      >
                        <Palette size={13} />
                        <span>Buka Bento Studio</span>
                      </Button>
                    </Link>

                    <Link
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl text-xs h-9 px-3"
                        title="Pratinjau Halaman Publik"
                      >
                        <ExternalLink size={13} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
