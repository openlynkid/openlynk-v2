"use client";

import { useState } from "react";
import { Check, Copy, Sparkles, Layers } from "lucide-react";
import { useObsidianToast } from "./obsidian-toast";

type BlurLevel = "subtle" | "standard" | "heavy";

export function ObsidianSurfacesSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [blurLevel, setBlurLevel] = useState<BlurLevel>("standard");
  const { showToast } = useObsidianToast();

  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      showToast("Class CSS Disalin", code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // ignore
    }
  };

  const getBlurClass = () => {
    switch (blurLevel) {
      case "subtle":
        return "backdrop-blur-md bg-neutral-900/50";
      case "heavy":
        return "backdrop-blur-2xl bg-neutral-900/80";
      case "standard":
      default:
        return "backdrop-blur-xl bg-neutral-900/60";
    }
  };

  return (
    <section id="surfaces" className="py-12 sm:py-16 border-b border-white/10 space-y-10 scroll-mt-24">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Material Kaca &amp; Surface
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
            Sistem material kaca obsidian mengandalkan teknik kabut optik (*backdrop-filter*), gradien radial tipis, dan pantulan tepi *inner glow*.
          </p>
        </div>

        {/* Blur level selector */}
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 p-1 rounded-xl self-start sm:self-auto shrink-0">
          <span className="text-[10px] text-neutral-400 px-2 font-mono flex items-center gap-1">
            <Layers size={11} />
            <span>Kabut:</span>
          </span>
          {(["subtle", "standard", "heavy"] as BlurLevel[]).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setBlurLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono capitalize transition cursor-pointer ${
                blurLevel === lvl
                  ? "bg-violet-500/20 text-violet-200 border border-violet-500/30 font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Surface 1: Static Glass Card */}
        <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden border border-white/10 bg-neutral-950/40">
          {/* Ambient Glow background */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-600/15 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className={`p-6 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full transition-all duration-300 ${getBlurClass()}`}>
              <div className="flex items-center gap-2 text-violet-400 text-xs font-mono">
                <Sparkles size={13} />
                <span>.rune-glass</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">Kartu Kaca Statis</h3>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                Permukaan optik semi-transparan dengan border lembut 1px dan bayangan difus. Digunakan sebagai kontainer utama informasi bento.
              </p>
            </div>

            <div className="space-y-3 w-full md:w-auto">
              <div className="text-xs font-mono text-neutral-400">Class CSS Rekomendasi:</div>
              <div className="bg-black/60 border border-white/10 rounded-xl p-3 font-mono text-xs text-neutral-200 flex items-center justify-between gap-3">
                <span className="truncate">rune-glass p-6 rounded-3xl border border-white/10</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode("rune-glass p-6 rounded-3xl border border-white/10", "static")}
                  className="text-neutral-400 hover:text-white p-1 cursor-pointer shrink-0"
                >
                  {copiedCode === "static" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Surface 2: Interactive Glass Card with Hover Effect */}
        <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden border border-white/10 bg-neutral-950/40">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="rune-glass rune-glass-hover p-6 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full cursor-pointer group">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
                <Sparkles size={13} />
                <span>.rune-glass .rune-glass-hover</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1 group-hover:text-cyan-200 transition">
                Kartu Kaca Interaktif (Hover Me)
              </h3>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                Arahkan kursor atau sentuh kartu ini untuk melihat efek elevasi 2px, pendar tepi border glow, dan transisi kurva responsif.
              </p>
            </div>

            <div className="space-y-3 w-full md:w-auto">
              <div className="text-xs font-mono text-neutral-400">Class CSS Rekomendasi:</div>
              <div className="bg-black/60 border border-white/10 rounded-xl p-3 font-mono text-xs text-neutral-200 flex items-center justify-between gap-3">
                <span className="truncate">rune-glass rune-glass-hover p-6 rounded-3xl</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode("rune-glass rune-glass-hover p-6 rounded-3xl", "hover")}
                  className="text-neutral-400 hover:text-white p-1 cursor-pointer shrink-0"
                >
                  {copiedCode === "hover" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Surface 3: Capsule Status Pill */}
        <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden border border-white/10 bg-neutral-950/40">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rune-pill">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-white">Live System Online</span>
                </div>

                <div className="rune-pill">
                  <span className="size-2 rounded-full bg-violet-400" />
                  <span className="text-xs font-mono text-neutral-300">v1.0.0-rc</span>
                </div>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm">
                Pill kapsul kaca rounded-full untuk badge status, kategori, tag versi, atau indikator verifikasi.
              </p>
            </div>

            <div className="space-y-3 w-full md:w-auto">
              <div className="text-xs font-mono text-neutral-400">Class CSS Rekomendasi:</div>
              <div className="bg-black/60 border border-white/10 rounded-xl p-3 font-mono text-xs text-neutral-200 flex items-center justify-between gap-3">
                <span className="truncate">rune-pill px-3 py-1.5 rounded-full</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode("rune-pill px-3 py-1.5 rounded-full", "pill")}
                  className="text-neutral-400 hover:text-white p-1 cursor-pointer shrink-0"
                >
                  {copiedCode === "pill" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
