"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Copy, RotateCcw } from "lucide-react";
import { useObsidianToast } from "./obsidian-toast";
import type { TypeScaleItem } from "../types";

const TYPE_SCALES: TypeScaleItem[] = [
  {
    name: "Display Giant",
    token: "text-4xl sm:text-6xl font-extrabold tracking-tight",
    fontSize: "60px / 3.75rem",
    lineHeight: "1.1",
    weight: "800 Extrabold",
    usage: "Hero headlines, slogan utama beranda",
    sample: "Obsidian Clarity",
  },
  {
    name: "Heading 1 (H1)",
    token: "text-2xl sm:text-4xl font-bold tracking-tight",
    fontSize: "36px / 2.25rem",
    lineHeight: "1.2",
    weight: "700 Bold",
    usage: "Judul halaman, nama entitas utama",
    sample: "Obsidian Studio",
  },
  {
    name: "Heading 2 (H2)",
    token: "text-xl sm:text-2xl font-bold tracking-tight",
    fontSize: "24px / 1.5rem",
    lineHeight: "1.3",
    weight: "700 Bold",
    usage: "Sub-bagian kartu bento, header modal",
    sample: "Susunan Kartu Bento",
  },
  {
    name: "Heading 3 (H3)",
    token: "text-base sm:text-lg font-semibold tracking-tight",
    fontSize: "18px / 1.125rem",
    lineHeight: "1.4",
    weight: "600 Semi-Bold",
    usage: "Judul kartu fitur, list profil",
    sample: "Proyek Terpilih & Portofolio",
  },
  {
    name: "Body Regular",
    token: "text-sm sm:text-base font-normal leading-relaxed",
    fontSize: "15px / 0.9375rem",
    lineHeight: "1.6",
    weight: "400 Regular",
    usage: "Paragraf antarmuka, deskripsi konten, catatan",
    sample: "Sistem desain taktil dengan presisi tipografi modern.",
  },
  {
    name: "Body Compact",
    token: "text-xs sm:text-sm font-normal leading-normal",
    fontSize: "13px / 0.8125rem",
    lineHeight: "1.5",
    weight: "400 Regular",
    usage: "Label tombol sekunder, placeholder form, tooltip",
    sample: "Diverifikasi secara kriptografis pada jaringan Obsidian.",
  },
  {
    name: "Micro & Code",
    token: "text-xs font-mono tracking-wide",
    fontSize: "12px / 0.75rem",
    lineHeight: "1.4",
    weight: "500 Medium (Mono)",
    usage: "URL slug, token CSS, counter badge, metadata",
    sample: "obsidian.design/specimen • 2026-11-03",
  },
];

const PRESETS = [
  "The quick brown fox jumps over the lazy dog",
  "Obsidian Design System",
  "obsidian.design/specimen",
  "Geist Typography Engineering",
];

export function ObsidianTypographySection() {
  const [customText, setCustomText] = useState("");
  const { showToast } = useObsidianToast();

  const handleCopyToken = async (scale: TypeScaleItem) => {
    try {
      await navigator.clipboard.writeText(scale.token);
      showToast("Class Tailwind Disalin", scale.token);
    } catch {
      // ignore
    }
  };

  return (
    <section id="typography" className="py-12 sm:py-16 border-b border-white/10 space-y-10 scroll-mt-24">
      {/* Header */}
      <div className="max-w-4xl mx-auto space-y-2">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-indigo-400" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Tipografi &amp; Skala Hirarki
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400">
          Menggunakan keluarga font <strong>Geist Sans</strong> untuk teks antarmuka dan <strong>Geist Mono</strong> untuk angka, token, dan data kode. Dirancang khusus untuk legibilitas optimal pada latar belakang gelap tak terbatas.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Font Family Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Geist Sans Card */}
          <div className="rune-glass p-6 rounded-3xl border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-violet-400 tracking-wider">
                  Primary Typeface
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">Geist Sans</h3>
              </div>
              <span className="text-xs font-mono text-neutral-400 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10">
                var(--font-sans)
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Keluarga huruf modern dengan proporsi netral, bukaan besar (*large apertures*), dan lengkungan halus yang memaksimalkan pembacaan pada ukuran kecil maupun raksasa.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-neutral-300 font-mono">
              <span>Weights: 400 &bull; 500 &bull; 600 &bull; 700 &bull; 800</span>
            </div>
          </div>

          {/* Geist Mono Card */}
          <div className="rune-glass p-6 rounded-3xl border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
                  Technical Typeface
                </span>
                <h3 className="text-xl font-bold text-white font-mono mt-0.5">Geist Mono</h3>
              </div>
              <span className="text-xs font-mono text-neutral-400 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10">
                var(--font-mono)
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Font monospaced proporsional untuk kode, token desain, angka statistik, dan metrik bento yang membutuhkan perataan karakter absolut.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-neutral-300 font-mono">
              <span>Weights: 400 &bull; 500 &bull; 600 &bull; 700</span>
            </div>
          </div>
        </div>

        {/* Live Specimen Interactive Input */}
        <div className="rune-glass p-5 rounded-2xl border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label htmlFor="specimen-input" className="text-xs font-semibold text-white">
              Coba Teks Langsung (Live Specimen Playground)
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCustomText(p)}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer border border-white/5"
                >
                  {p.slice(0, 18)}&hellip;
                </button>
              ))}
              {customText && (
                <button
                  type="button"
                  onClick={() => setCustomText("")}
                  className="text-[10px] text-neutral-400 hover:text-white p-1 cursor-pointer"
                  title="Reset Teks"
                >
                  <RotateCcw size={12} />
                </button>
              )}
            </div>
          </div>

          <Input
            id="specimen-input"
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Ketik teks di sini untuk menguji seluruh skala ukuran di bawah..."
            className="bg-black/40 border-white/10 text-white placeholder:text-neutral-500 rounded-xl text-xs h-10"
          />
        </div>

        {/* Type Scales List */}
        <div className="space-y-3">
          {TYPE_SCALES.map((scale) => {
            const displayText = customText.trim() || scale.sample;

            return (
              <div
                key={scale.name}
                className="rune-glass rune-glass-hover p-5 sm:p-6 rounded-2xl border-white/10 space-y-3 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{scale.name}</span>
                    <span className="text-[11px] font-mono text-neutral-400">{scale.fontSize}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-neutral-400 font-mono hidden md:inline">
                      {scale.weight} &bull; LH: {scale.lineHeight}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyToken(scale)}
                      className="text-[11px] font-mono text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer bg-violet-500/10 px-2 py-0.5 rounded-lg border border-violet-500/20"
                    >
                      <Copy size={11} />
                      <span>Salin Class</span>
                    </button>
                  </div>
                </div>

                {/* Rendered Typography Specimen */}
                <div className="py-2">
                  <p className={`${scale.token} text-white break-words`}>{displayText}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                  <span>Penggunaan: {scale.usage}</span>
                  <span className="font-mono text-[10px] text-neutral-400 truncate max-w-[280px]">
                    {scale.token}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
