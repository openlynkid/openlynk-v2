"use client";

import { useState } from "react";
import { Check, Copy, SlidersHorizontal } from "lucide-react";
import { useObsidianToast } from "./obsidian-toast";
import type { ColorGroup } from "../types";

type CopyFormat = "hex" | "oklch" | "var";

const COLOR_GROUPS: ColorGroup[] = [
  {
    title: "Core Obsidian & Neutral Palette",
    description: "Fondasi warna gelap yang menghasilkan kedalaman tak terbatas dan ketenangan visual.",
    swatches: [
      {
        name: "Obsidian Canvas",
        variableName: "--background",
        hex: "#09090b",
        oklch: "oklch(0.12 0.012 260)",
        role: "Latar belakang aplikasi utama",
        borderColor: "border-white/10",
      },
      {
        name: "Obsidian Surface",
        variableName: "--card",
        hex: "#121218",
        oklch: "oklch(0.16 0.012 260 / 60%)",
        role: "Dasar kartu kaca & modal",
        borderColor: "border-white/10",
      },
      {
        name: "Glass Border Subtle",
        variableName: "--border",
        hex: "rgba(255,255,255,0.08)",
        oklch: "oklch(1 0 0 / 8%)",
        role: "Garis batas kartu statis",
        borderColor: "border-white/20",
      },
      {
        name: "Glass Border Hover",
        variableName: "--border-hover",
        hex: "rgba(255,255,255,0.20)",
        oklch: "oklch(1 0 0 / 20%)",
        role: "Garis batas kartu saat hover",
        borderColor: "border-white/40",
      },
      {
        name: "Text Primary",
        variableName: "--foreground",
        hex: "#fcfcfd",
        oklch: "oklch(0.985 0 0)",
        role: "Judul, nama profil, teks tebal",
        textColor: "#000000",
        borderColor: "border-white/20",
      },
      {
        name: "Text Muted",
        variableName: "--muted-foreground",
        hex: "#a1a1aa",
        oklch: "oklch(0.68 0.01 260)",
        role: "Deskripsi, tautan sekunder, label",
        borderColor: "border-white/10",
      },
    ],
  },
  {
    title: "Preset Aksen Tema (Theme Accents)",
    description: "Spektrum warna ekspresif yang dapat dipilih untuk mempersonalisasi kanvas antarmuka Obsidian.",
    swatches: [
      {
        name: "Obsidian Violet",
        variableName: "--accent-obsidian",
        hex: "#6366f1",
        oklch: "oklch(0.585 0.233 277)",
        role: "Aksen indigo-violet default studio",
      },
      {
        name: "Emerald Luxe",
        variableName: "--accent-emerald",
        hex: "#10b981",
        oklch: "oklch(0.696 0.17 162)",
        role: "Tema hijau zamrud alami & prestisius",
      },
      {
        name: "Cyberpunk Neon",
        variableName: "--accent-cyberpunk",
        hex: "#ec4899",
        oklch: "oklch(0.656 0.24 354)",
        role: "Aksen magenta fuchsia berenergi tinggi",
      },
      {
        name: "Sunset Amber",
        variableName: "--accent-sunset",
        hex: "#f59e0b",
        oklch: "oklch(0.769 0.188 70)",
        role: "Kehangatan jingga senja & rose",
      },
      {
        name: "Monochrome Stealth",
        variableName: "--accent-monochrome",
        hex: "#ffffff",
        oklch: "oklch(1 0 0)",
        role: "Minimalisme perak & monokrom absolut",
        textColor: "#000000",
      },
    ],
  },
];

export function ObsidianColorsSection() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [copyFormat, setCopyFormat] = useState<CopyFormat>("hex");
  const { showToast } = useObsidianToast();

  const getFormatValue = (swatch: (typeof COLOR_GROUPS)[0]["swatches"][0]): string => {
    switch (copyFormat) {
      case "oklch":
        return swatch.oklch || swatch.hex;
      case "var":
        return `var(${swatch.variableName})`;
      case "hex":
      default:
        return swatch.hex;
    }
  };

  const handleCopyColor = async (swatch: (typeof COLOR_GROUPS)[0]["swatches"][0]) => {
    const valueToCopy = getFormatValue(swatch);
    try {
      await navigator.clipboard.writeText(valueToCopy);
      setCopiedValue(swatch.variableName);
      showToast(`${swatch.name} Disalin`, valueToCopy);
      setTimeout(() => setCopiedValue(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <section id="colors" className="py-12 sm:py-16 border-b border-white/10 space-y-10 scroll-mt-24">
      {/* Header & Format Toggle */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Sistem Warna &amp; Token
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
            Sistem warna Obsidian berbasis token CSS variable dan format OKLCH untuk rentang gamut lebar dan gradasi kontras presisi pada layar modern.
          </p>
        </div>

        {/* Copy Format Selector */}
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 p-1 rounded-xl self-start sm:self-auto shrink-0">
          <span className="text-[10px] text-neutral-400 px-2 font-mono flex items-center gap-1">
            <SlidersHorizontal size={11} />
            <span>Format:</span>
          </span>
          {(["hex", "oklch", "var"] as CopyFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setCopyFormat(fmt)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase transition cursor-pointer ${
                copyFormat === fmt
                  ? "bg-violet-500/20 text-violet-200 border border-violet-500/30 font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Swatch Groups */}
      <div className="max-w-4xl mx-auto space-y-8">
        {COLOR_GROUPS.map((group) => (
          <div key={group.title} className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">{group.title}</h3>
              <p className="text-xs text-neutral-400 mt-0.5">{group.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.swatches.map((swatch) => {
                const displayVal = getFormatValue(swatch);
                const isCopied = copiedValue === swatch.variableName;

                return (
                  <div
                    key={swatch.variableName}
                    onClick={() => handleCopyColor(swatch)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCopyColor(swatch);
                      }
                    }}
                    className="rune-glass rune-glass-hover p-4 rounded-2xl border-white/10 flex flex-col justify-between gap-4 cursor-pointer group relative overflow-hidden text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 rounded-xl shadow-inner shrink-0 border ${
                            swatch.borderColor || "border-white/15"
                          }`}
                          style={{
                            backgroundColor: swatch.hex.startsWith("rgba") ? swatch.hex : swatch.hex,
                          }}
                        />
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-violet-200 transition">
                            {swatch.name}
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{swatch.role}</p>
                        </div>
                      </div>

                      <div className="size-6 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-white/20 transition shrink-0">
                        {isCopied ? (
                          <Check size={12} className="text-emerald-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-neutral-400">{swatch.variableName}</span>
                      <span className="text-neutral-200 font-semibold truncate max-w-[140px] text-right">
                        {displayVal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
