"use client";

import { useState } from "react";
import { Sparkles, Shield, Compass, Zap, Layers, Palette, CheckCircle2, Bot, FileCode2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ObsidianAiGuideDialog } from "./obsidian-ai-guide-dialog";
import { useObsidianToast } from "./obsidian-toast";
import { OBSIDIAN_AI_MARKDOWN } from "../data/obsidian-ai-prompt";

export function ObsidianHero() {
  const [copied, setCopied] = useState(false);
  const { showToast } = useObsidianToast();

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(OBSIDIAN_AI_MARKDOWN);
      setCopied(true);
      showToast("Panduan AI Markdown Disalin", "Prompt sistem desain lengkap untuk LLM");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const stats = [
    { label: "Varian RuneIcon", value: "5 Gaya", icon: <Sparkles size={13} className="text-violet-400" /> },
    { label: "Preset Tema", value: "5 Palet", icon: <Palette size={13} className="text-cyan-400" /> },
    { label: "Primitif Base UI", value: "10+ Komponen", icon: <Layers size={13} className="text-emerald-400" /> },
    { label: "Standar Kontras", value: "WCAG AAA", icon: <CheckCircle2 size={13} className="text-amber-400" /> },
  ];

  const principles = [
    {
      icon: <Shield size={18} className="text-violet-400" />,
      title: "Obsidian Clarity",
      tag: "Fondasi Gelap",
      description:
        "Latar belakang hitam pekat obsidian (oklch 0.12 0.012 260) memberikan ruang negatif bernafas dengan kontras tinggi yang menonjolkan konten utama secara mutlak.",
    },
    {
      icon: <Sparkles size={18} className="text-cyan-400" />,
      title: "Tactile Glassmorphism",
      tag: "Material Kaca",
      description:
        "Kartu kaca bertingkat (.rune-glass) dengan border kilau 1px, blur multi-layer, dan pantulan aksen yang memberikan kesan fisik nyata dan berbobot.",
    },
    {
      icon: <Compass size={18} className="text-emerald-400" />,
      title: "Intentional Iconography",
      tag: "RuneIcon 5-Style",
      description:
        "Memanfaatkan sistem RuneIcon 5 varian gaya visual untuk membedakan fungsi semantik antara sorotan visual, status identitas, dan navigasi antarmuka.",
    },
    {
      icon: <Zap size={18} className="text-amber-400" />,
      title: "High-Precision Ergonomics",
      tag: "Mikro-Interaksi",
      description:
        "Setiap interaksi drag & drop, sentuhan tombol, dan form merespon dalam hitungan milidetik dengan transisi kurva bezier yang halus dan konsisten.",
    },
  ];

  return (
    <section id="overview" className="relative py-12 sm:py-20 border-b border-white/10 scroll-mt-24">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[340px] bg-violet-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-1/2 -right-48 w-[400px] h-[400px] bg-cyan-500/8 blur-[160px] rounded-full" />
        <div className="absolute bottom-0 -left-48 w-[400px] h-[400px] bg-indigo-500/8 blur-[160px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <div className="rune-pill mx-auto">
          <span className="size-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-medium text-neutral-200">
            Obsidian Design System &bull; Tactile Precision &amp; Modern Glass
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Obsidian{" "}
          <span className="bg-gradient-to-r from-violet-300 via-neutral-100 to-cyan-300 bg-clip-text text-transparent">
            Design System
          </span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Satu bahasa visual mandiri yang memadukan kedalaman estetika obsidian, material kaca taktil (*tactile glassmorphism*), tipografi presisi tinggi, dan primitif Base UI yang tangguh.
        </p>

        {/* Action Buttons: Copy Markdown & View Guide */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Button
            type="button"
            onClick={handleCopyMarkdown}
            className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs h-10 px-5 gap-2 cursor-pointer shadow-lg"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Bot size={14} className="text-violet-600" />}
            <span>{copied ? "Markdown Disalin!" : "Salin Panduan AI (Markdown)"}</span>
          </Button>

          <ObsidianAiGuideDialog
            trigger={
              <Button
                type="button"
                variant="outline"
                className="border-white/10 text-neutral-300 hover:bg-white/5 rounded-xl text-xs h-10 px-4 gap-2 cursor-pointer"
              >
                <FileCode2 size={14} className="text-neutral-400" />
                <span>Lihat Panduan Markdown</span>
              </Button>
            }
          />
        </div>

        {/* Quick Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto pt-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rune-glass p-3 rounded-2xl border-white/10 flex flex-col items-center justify-center gap-1 text-center"
            >
              <div className="flex items-center gap-1.5">
                {s.icon}
                <span className="text-xs sm:text-sm font-bold text-white font-mono">{s.value}</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Pillars of Obsidian */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 sm:mt-16">
        {principles.map((p) => (
          <div
            key={p.title}
            className="rune-glass rune-glass-hover p-6 rounded-3xl border-white/10 flex flex-col justify-between gap-3 group relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:border-white/20 transition">
                  {p.icon}
                </div>
                <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5">
                  {p.tag}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight group-hover:text-violet-200 transition">
                  {p.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mt-1.5">
                  {p.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
