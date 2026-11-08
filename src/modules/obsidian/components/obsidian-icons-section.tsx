"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Check } from "lucide-react";
import { RuneIcon } from "runeicons-react";
import { SocialIcon } from "@/components/ui/social-icon";
import { Input } from "@/components/ui/input";
import { useObsidianToast } from "./obsidian-toast";

type IconSize = 18 | 24 | 32;

export function ObsidianIconsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [iconSize, setIconSize] = useState<IconSize>(24);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const { showToast } = useObsidianToast();

  const runeStyles = [
    {
      type: "glass" as const,
      name: "Glass Style",
      role: "Hero Section, Branding, Kartu Unggulan",
      description: "Ikon bertekstur kaca prisma dengan pembiasan cahaya, gradien kedalaman, dan aksen premium.",
      icons: [
        "glass-chain-link-3-1",
        "glass-sparkle",
        "glass-cube",
        "glass-lock-1",
        "glass-camera",
        "glass-music-1",
      ],
    },
    {
      type: "duotone" as const,
      name: "Duotone Style",
      role: "Status Profil, Verifikasi, Pengaturan",
      description: "Dua nada warna dengan kontras lembut antara siluet latar dan garis fokus depan.",
      icons: [
        "identity-shield-check",
        "identity-user-plus",
        "interface-alert-circle",
        "devices-phone",
        "documents-folder",
      ],
    },
    {
      type: "normal" as const,
      name: "Normal / Outline Style",
      role: "Navigasi Bar, Input Prefix, Tombol Sekunder",
      description: "Garis minimalis dengan ketebalan stroke seragam untuk kejelasan fungsional tinggi.",
      icons: [
        "identity-shield",
        "documents-file-lock",
        "devices-phone",
        "arrows-switch-horizontal",
      ],
    },
    {
      type: "fill" as const,
      name: "Fill Style",
      role: "Penekanan Aktif, Bookmark, Indikator Seleksi",
      description: "Siluet padat monokromatis untuk memberikan bobot visual kuat pada item aktif.",
      icons: [
        "interface-star",
        "interface-heart",
        "interface-bookmark",
        "devices-desktop",
      ],
    },
    {
      type: "pixelated" as const,
      name: "Pixelated Style",
      role: "Gamifikasi, Lencana Retro, Komunitas Web3/Gaming",
      description: "Gaya piksel 8-bit berkarakter unik untuk estetika game dan kreator digital.",
      icons: [
        "devices-gamepad",
        "interface-trophy",
        "interface-sparkle",
        "media-headphones",
      ],
    },
  ];

  const socialPlatforms = [
    "github",
    "x",
    "youtube",
    "instagram",
    "spotify",
    "linkedin",
    "tiktok",
    "twitch",
    "discord",
    "threads",
  ] as const;

  const handleCopySnippet = async (name: string, type: string) => {
    const snippet = `<RuneIcon name="${name}" type="${type}" size={${iconSize}} />`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedIcon(name);
      showToast(`Ikon ${name} Disalin`, snippet);
      setTimeout(() => setCopiedIcon(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopySocialSnippet = async (platform: string) => {
    const snippet = `<SocialIcon platform="${platform}" size={${iconSize}} />`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedIcon(platform);
      showToast(`SocialIcon ${platform} Disalin`, snippet);
      setTimeout(() => setCopiedIcon(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <section id="icons" className="py-12 sm:py-16 space-y-10 scroll-mt-24">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-violet-400" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Sistem Ikonografi: RuneIcon
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
            Didukung oleh pustaka resmi <strong>RuneIcon (runeicons-react)</strong> dengan 5 varian gaya visual terstruktur sesuai semantik antarmuka Obsidian.
          </p>
        </div>

        {/* Size switcher */}
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 p-1 rounded-xl self-start sm:self-auto shrink-0">
          <span className="text-[10px] text-neutral-400 px-2 font-mono flex items-center gap-1">
            <SlidersHorizontal size={11} />
            <span>Ukuran:</span>
          </span>
          {([18, 24, 32] as IconSize[]).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setIconSize(sz)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                iconSize === sz
                  ? "bg-violet-500/20 text-violet-200 border border-violet-500/30 font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {sz}px
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Search Input Bar */}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
            <Search size={15} />
          </div>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama ikon RuneIcon..."
            className="pl-10 bg-black/50 border-white/10 text-white rounded-xl text-xs h-11 placeholder:text-neutral-500"
          />
        </div>

        {/* 5 RuneIcon Styles Display */}
        <div className="space-y-6">
          {runeStyles.map((style) => {
            const filtered = style.icons.filter((name) =>
              name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filtered.length === 0 && searchQuery) {
              return null;
            }

            return (
              <div
                key={style.type}
                className="rune-glass p-6 rounded-3xl border-white/10 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {style.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-violet-300">
                        type=&quot;{style.type}&quot;
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">{style.description}</p>
                  </div>

                  <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                    Peran: {style.role}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
                  {filtered.map((iconName) => {
                    const isCopied = copiedIcon === iconName;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => handleCopySnippet(iconName, style.type)}
                        className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/[0.05] flex flex-col items-center justify-center gap-2.5 transition group cursor-pointer relative overflow-hidden"
                      >
                        <div className="size-10 flex items-center justify-center">
                          <RuneIcon name={iconName} type={style.type} size={iconSize} />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-200 truncate max-w-full text-center">
                          {iconName.split("-").slice(-2).join("-")}
                        </span>

                        {isCopied && (
                          <div className="absolute inset-0 bg-neutral-950/90 flex items-center justify-center gap-1 text-[10px] text-emerald-400 font-mono">
                            <Check size={11} />
                            <span>Disalin</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Social Icons Section */}
        <div className="rune-glass p-6 sm:p-8 rounded-3xl border-white/10 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Koleksi Social Icon
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Komponen terpadu <code>&lt;SocialIcon platform=&quot;...&quot; /&gt;</code> untuk profil dan kanal media.
              </p>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              @/components/ui/social-icon
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {socialPlatforms.map((platform) => {
              const isCopied = copiedIcon === platform;
              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => handleCopySocialSnippet(platform)}
                  className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/25 hover:bg-white/[0.05] flex flex-col items-center justify-center gap-2 transition group cursor-pointer relative"
                >
                  <div className="size-9 flex items-center justify-center">
                    <SocialIcon platform={platform} size={iconSize} />
                  </div>
                  <span className="text-[11px] font-mono capitalize text-neutral-300 group-hover:text-white">
                    {platform}
                  </span>

                  {isCopied && (
                    <div className="absolute inset-0 bg-neutral-950/90 rounded-2xl flex items-center justify-center gap-1 text-[10px] text-emerald-400 font-mono">
                      <Check size={11} />
                      <span>Disalin</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
