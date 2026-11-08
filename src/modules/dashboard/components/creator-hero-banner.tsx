"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Copy, ExternalLink, Settings, Plus } from "lucide-react";
import { RuneIcon } from "@/components/ui/rune-icon";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/db/schema";

interface CreatorHeroBannerProps {
  profile: Profile;
  name: string;
  baseUrl?: string;
  onOpenCreatePage?: () => void;
}

export function CreatorHeroBanner({
  profile,
  name,
  baseUrl = "https://openlynk.id",
  onOpenCreatePage,
}: CreatorHeroBannerProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${baseUrl}/${profile.username}`;

  const handleCopy = async () => {
    const currentUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/${profile.username}`
        : publicUrl;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const displayName = profile.displayName || name || "Kreator OpenLynk";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 rune-glass border border-white/10 shadow-2xl backdrop-blur-2xl">
      {/* Decorative gradient glow inside card */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-cyan-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Creator Info */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
          {/* Avatar */}
          <div className="relative shrink-0">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={displayName}
                width={80}
                height={80}
                unoptimized
                className="size-16 sm:size-20 rounded-2xl object-cover border border-white/20 shadow-xl bg-neutral-900"
              />
            ) : (
              <div className="size-16 sm:size-20 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-800 to-violet-900 border border-white/20 shadow-xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl tracking-wider">
                {initials}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald-500 border-2 border-neutral-950 flex items-center justify-center shadow" title="Online & Aktif">
              <span className="size-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          {/* Identity details */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
                {displayName}
              </h1>
              {profile.isVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <RuneIcon name="glass-shield-check-1" type="glass" size={12} />
                  <span>Verified</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs sm:text-sm font-medium text-indigo-400">
                @{profile.username}
              </span>
              <span className="text-neutral-600 text-xs">&bull;</span>
              <span className="text-xs text-neutral-400">Bio Micro-site</span>
            </div>

            <p className="text-xs text-neutral-300 mt-2 line-clamp-2 max-w-xl leading-relaxed">
              {profile.bio || (
                <span className="text-neutral-500 italic">
                  Belum ada bio. Tambahkan deskripsi singkat di menu Pengaturan Profil.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Quick URL & Actions */}
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          {/* Copyable Link Pill */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-1 pl-3 shadow-inner">
            <span className="text-xs text-neutral-400 font-mono truncate max-w-[170px] sm:max-w-[190px]">
              openlynk.id/{profile.username}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className={`ml-2 h-8 px-3 rounded-xl text-xs font-medium border-0 transition-all ${
                copied
                  ? "bg-emerald-500 text-black font-semibold"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {copied ? (
                <>
                  <Check size={13} className="mr-1" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy size={13} className="mr-1" />
                  <span>Salin</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCreatePage && (
              <Button
                size="sm"
                onClick={onOpenCreatePage}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-2xl text-xs h-10 px-3.5 shadow-lg flex items-center justify-center gap-1.5 min-h-[40px]"
              >
                <Plus size={15} />
                <span>Halaman Baru</span>
              </Button>
            )}

            <Link
              href={`/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial"
            >
              <Button className="w-full bg-white hover:bg-neutral-200 text-black font-semibold rounded-2xl text-xs h-10 px-3.5 shadow-lg flex items-center justify-center gap-1.5 min-h-[40px]">
                <ExternalLink size={14} />
                <span>Lihat</span>
              </Button>
            </Link>

            <Link href="/dashboard/profile" className="shrink-0">
              <Button
                variant="outline"
                className="border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 rounded-2xl size-10 p-0 flex items-center justify-center"
                title="Pengaturan Profil"
              >
                <Settings size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
