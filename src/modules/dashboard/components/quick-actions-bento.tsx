"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Palette, User, Share2, ArrowRight } from "lucide-react";
import { PageShareModal } from "@/modules/page";
import type { DashboardPageSummary } from "../types";

interface QuickActionsBentoProps {
  primaryPage: DashboardPageSummary | null;
  username: string;
  baseUrl?: string;
  onOpenCreatePage?: () => void;
}

export function QuickActionsBento({
  primaryPage,
  username,
  baseUrl = "https://openlynk.id",
  onOpenCreatePage,
}: QuickActionsBentoProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const publicUrl = `${baseUrl}/${username}`;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Action 1: Create New Page */}
        {onOpenCreatePage ? (
          <button
            type="button"
            onClick={onOpenCreatePage}
            className="group p-4 sm:p-5 rounded-2xl rune-glass rune-glass-hover border-white/10 flex flex-col justify-between gap-3 text-left cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="size-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-105 transition-all">
                <Plus size={20} />
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                Instan
              </span>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                <span>Buat Halaman</span>
                <ArrowRight size={12} className="text-neutral-500 group-hover:translate-x-1 group-hover:text-white transition-all" />
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                Luncurkan micro-site baru
              </p>
            </div>
          </button>
        ) : (
          <Link
            href="/dashboard/pages"
            className="group p-4 sm:p-5 rounded-2xl rune-glass rune-glass-hover border-white/10 flex flex-col justify-between gap-3"
          >
            <div className="flex items-start justify-between">
              <div className="size-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-105 transition-all">
                <Plus size={20} />
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300">
                Baru
              </span>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                <span>Buat Halaman</span>
                <ArrowRight size={12} className="text-neutral-500 group-hover:translate-x-1 group-hover:text-white transition-all" />
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                Luncurkan micro-site baru
              </p>
            </div>
          </Link>
        )}

        {/* Action 2: Open Bento Studio */}
        {primaryPage ? (
          <Link
            href={`/dashboard/pages/${primaryPage.id}`}
            className="group p-4 sm:p-5 rounded-2xl rune-glass rune-glass-hover border-white/10 flex flex-col justify-between gap-3"
          >
            <div className="flex items-start justify-between">
              <div className="size-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/20 group-hover:scale-105 transition-all">
                <Palette size={18} />
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300">
                Studio
              </span>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-violet-300 transition-colors flex items-center gap-1">
                <span>Bento Studio</span>
                <ArrowRight size={12} className="text-neutral-500 group-hover:translate-x-1 group-hover:text-white transition-all" />
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                Visual drag &amp; drop editor
              </p>
            </div>
          </Link>
        ) : (
          <Link
            href="/dashboard/pages"
            className="group p-4 sm:p-5 rounded-2xl rune-glass rune-glass-hover border-white/10 flex flex-col justify-between gap-3"
          >
            <div className="flex items-start justify-between">
              <div className="size-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Palette size={18} />
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300">
                Studio
              </span>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white">Bento Studio</h3>
              <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                Mulai menyusun kartu
              </p>
            </div>
          </Link>
        )}

        {/* Action 3: Profile Settings */}
        <Link
          href="/dashboard/profile"
          className="group p-4 sm:p-5 rounded-2xl rune-glass rune-glass-hover border-white/10 flex flex-col justify-between gap-3"
        >
          <div className="flex items-start justify-between">
            <div className="size-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-105 transition-all">
              <User size={18} />
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">
              Identitas
            </span>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
              <span>Profil &amp; Sosial</span>
              <ArrowRight size={12} className="text-neutral-500 group-hover:translate-x-1 group-hover:text-white transition-all" />
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
              Handle, bio, dan sosial media
            </p>
          </div>
        </Link>

        {/* Action 4: Share & QR */}
        <button
          type="button"
          onClick={() => setIsShareOpen(true)}
          className="group p-4 sm:p-5 rounded-2xl rune-glass rune-glass-hover border-white/10 flex flex-col justify-between gap-3 text-left cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all">
              <Share2 size={18} />
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
              Bagikan
            </span>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
              <span>QR &amp; Share</span>
              <ArrowRight size={12} className="text-neutral-500 group-hover:translate-x-1 group-hover:text-white transition-all" />
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
              Unduh QR &amp; bagikan tautan
            </p>
          </div>
        </button>
      </div>

      {/* Share Modal */}
      <PageShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={publicUrl}
        title={`Profil OpenLynk @${username}`}
      />
    </>
  );
}
