"use client";

import Link from "next/link";
import { RuneIcon } from "runeicons-react";
import type { Profile, BioBlock } from "@/db/schema";
import { BioProfileForm } from "./bio-profile-form";
import { BioLinksManager } from "./bio-links-manager";
import { PublicBioView } from "./public-bio-view";

interface BioDashboardViewProps {
  userId: string;
  profile: Profile | null;
  blocks: BioBlock[];
}

export function BioDashboardView({
  userId,
  profile,
  blocks,
}: BioDashboardViewProps) {
  // Filter active blocks for mobile mockup preview
  const activeBlocks = blocks.filter((b) => b.isActive);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Editor Halaman Bio</span>
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Fitur 01
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Sesuaikan identitas profil dan susun tautan personal Anda untuk dibagikan ke media sosial.
          </p>
        </div>

        {profile?.username ? (
          <Link
            href={`/${profile.username}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs sm:text-sm font-semibold text-white transition self-start sm:self-auto min-h-[44px]"
          >
            <RuneIcon name="glass-chain-link-3-1" type="glass" size={16} />
            <span>Lihat Halaman Publik</span>
            <RuneIcon name="glass-arrow-right-circle" type="glass" size={14} />
          </Link>
        ) : (
          <div className="text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl">
            Simpan profil untuk mengaktifkan URL publik Anda.
          </div>
        )}
      </div>

      {/* Grid: Editor (Left) & Live Preview Mockup (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor Forms */}
        <div className="lg:col-span-7 space-y-6">
          <BioProfileForm userId={userId} initialProfile={profile} />
          {profile && (
            <BioLinksManager userId={userId} initialBlocks={blocks} />
          )}
        </div>

        {/* Right Column: Smartphone Mockup Preview */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24">
          <div className="text-center mb-2">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Live Mobile Preview
            </span>
          </div>

          <div className="mx-auto w-[340px] h-[660px] rounded-[42px] border-4 border-neutral-800 bg-neutral-950 p-3 shadow-2xl relative overflow-hidden flex flex-col">
            {/* Camera notch simulation */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-800 rounded-full z-20 pointer-events-none" />

            {/* Inner screen content */}
            <div className="w-full h-full rounded-[32px] overflow-y-auto no-scrollbar relative">
              {profile ? (
                <PublicBioView
                  data={{
                    ...profile,
                    blocks: activeBlocks,
                  }}
                />
              ) : (
                <div className="size-full flex flex-col items-center justify-center text-center p-6 text-neutral-500 text-xs">
                  <div className="size-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-3 text-neutral-400">
                    <RuneIcon name="glass-profile-circle" type="glass" size={24} />
                  </div>
                  Isi informasi profil di sebelah kiri untuk melihat tampilan preview di sini.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
