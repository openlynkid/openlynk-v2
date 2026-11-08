"use client";

import { useState } from "react";
import { Check, Copy, Download, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useObsidianToast } from "./obsidian-toast";

const OBSIDIAN_LOGO_SVG = `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" rx="56" fill="#09090B"/>
  <rect x="1" y="1" width="254" height="254" rx="55" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
  <circle cx="128" cy="128" r="75" fill="url(#paint0_radial)" fill-opacity="0.3"/>
  <g transform="translate(64, 60) scale(5.333)">
    <!-- Obsidian Faceted Prism Geometry -->
    <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" fill="url(#prism_face_1)" stroke="#818CF8" stroke-width="1.5" stroke-linejoin="round"/>
    <polygon points="12,2 22,8.5 12,14 2,8.5" fill="url(#prism_top)" stroke="#A5B4FC" stroke-width="1.2" stroke-linejoin="round"/>
    <polygon points="2,8.5 12,14 12,22 2,15.5" fill="url(#prism_left)" stroke="#6366F1" stroke-width="1.2" stroke-linejoin="round"/>
    <polygon points="22,8.5 12,14 12,22 22,15.5" fill="url(#prism_right)" stroke="#C084FC" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="12" y1="2" x2="12" y2="14" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.8"/>
  </g>
  <defs>
    <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(128 128) rotate(90) scale(75)">
      <stop stop-color="#8B5CF6"/>
      <stop offset="1" stop-color="#6366F1" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="prism_face_1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1E1B4B" stop-opacity="0.8"/>
      <stop offset="1" stop-color="#0F172A" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="prism_top" x1="12" y1="2" x2="12" y2="14" gradientUnits="userSpaceOnUse">
      <stop stop-color="#A5B4FC" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#6366F1" stop-opacity="0.15"/>
    </linearGradient>
    <linearGradient id="prism_left" x1="2" y1="8.5" x2="12" y2="22" gradientUnits="userSpaceOnUse">
      <stop stop-color="#4338CA" stop-opacity="0.6"/>
      <stop offset="1" stop-color="#1E1B4B" stop-opacity="0.3"/>
    </linearGradient>
    <linearGradient id="prism_right" x1="22" y1="8.5" x2="12" y2="22" gradientUnits="userSpaceOnUse">
      <stop stop-color="#7C3AED" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#312E81" stop-opacity="0.3"/>
    </linearGradient>
  </defs>
</svg>`;

const REACT_JSX_SNIPPET = `<div className="size-10 rounded-2xl bg-neutral-900 border border-white/20 flex items-center justify-center relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-indigo-500/10" />
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
    <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
    <line x1="12" y1="2" x2="12" y2="22" opacity="0.4" />
    <polyline points="2,8.5 12,14 22,8.5" opacity="0.4" />
  </svg>
</div>`;

export function ObsidianLogoSection() {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const { showToast } = useObsidianToast();

  const handleCopySvg = async () => {
    try {
      await navigator.clipboard.writeText(OBSIDIAN_LOGO_SVG);
      setCopiedType("svg");
      showToast("Kode SVG Berhasil Disalin", "256x256 ViewBox Obsidian Prism");
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyJsx = async () => {
    try {
      await navigator.clipboard.writeText(REACT_JSX_SNIPPET);
      setCopiedType("jsx");
      showToast("Kode React JSX Disalin", "Obsidian Prism Icon");
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([OBSIDIAN_LOGO_SVG], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "obsidian-logo.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("File SVG Berhasil Diunduh", "obsidian-logo.svg");
  };

  return (
    <section id="logo" className="py-12 sm:py-16 border-b border-white/10 space-y-8 scroll-mt-24">
      <div className="max-w-4xl mx-auto space-y-2">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-violet-500" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Logo &amp; Identitas Visual
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400">
          Simbol Obsidian melambangkan kristal prisma vulkanik dengan faset bersudut presisi, mencerminkan kejernihan, kedalaman optik, dan ketelitian rekayasa antarmuka.
        </p>
      </div>

      {/* Main Lockup & Download Card */}
      <div className="max-w-4xl mx-auto rune-glass p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo Showcase */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="size-20 sm:size-24 rounded-3xl bg-neutral-900 border border-white/15 shadow-2xl flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/25 via-transparent to-cyan-500/10 pointer-events-none" />
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center"
                dangerouslySetInnerHTML={{
                  __html: OBSIDIAN_LOGO_SVG.replace('width="256" height="256"', 'width="100%" height="100%"'),
                }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Obsidian
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300">
                  design system
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                Faset geometri prisma kaca dengan aksen pembiasan cahaya violet-cyan.
              </p>
            </div>
          </div>

          {/* Download & Copy Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <Button
              onClick={handleDownloadSvg}
              className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs h-9 px-4 gap-2 flex-1 sm:flex-initial cursor-pointer shadow-lg"
            >
              <Download size={14} />
              <span>Unduh SVG</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleCopySvg}
              className="border-white/10 text-neutral-200 hover:bg-white/5 rounded-xl text-xs h-9 px-3 gap-1.5 flex-1 sm:flex-initial cursor-pointer"
            >
              {copiedType === "svg" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedType === "svg" ? "SVG Disalin" : "Salin SVG"}</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleCopyJsx}
              className="border-white/10 text-neutral-200 hover:bg-white/5 rounded-xl text-xs h-9 px-3 gap-1.5 flex-1 sm:flex-initial cursor-pointer"
            >
              {copiedType === "jsx" ? <Check size={14} className="text-emerald-400" /> : <Code2 size={14} />}
              <span>{copiedType === "jsx" ? "JSX Disalin" : "Salin JSX"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Context Variations Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Context 1: Dark Obsidian */}
        <div className="rune-glass p-5 rounded-2xl border-white/10 flex flex-col items-center text-center gap-3">
          <div className="size-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-lg">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.75">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
              <line x1="12" y1="2" x2="12" y2="22" strokeOpacity="0.4" />
              <polyline points="2,8.5 12,14 22,8.5" strokeOpacity="0.4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Dark Obsidian</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Kontras hitam murni pada kanvas gelap</p>
          </div>
        </div>

        {/* Context 2: Violet Refraction */}
        <div className="rune-glass p-5 rounded-2xl border-white/10 flex flex-col items-center text-center gap-3">
          <div className="size-14 rounded-2xl bg-violet-950/40 border border-violet-500/30 flex items-center justify-center shadow-lg shadow-violet-900/20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" fill="#8B5CF6" fillOpacity="0.15" />
              <line x1="12" y1="2" x2="12" y2="22" strokeOpacity="0.5" />
              <polyline points="2,8.5 12,14 22,8.5" strokeOpacity="0.5" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Violet Refraction</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Aksen pembiasan prisma spektral</p>
          </div>
        </div>

        {/* Context 3: Translucent Glass */}
        <div className="rune-glass p-5 rounded-2xl border-white/10 flex flex-col items-center text-center gap-3 bg-white/[0.04]">
          <div className="size-14 rounded-2xl bg-white/[0.06] border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E2E8F0" strokeWidth="1.75">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
              <line x1="12" y1="2" x2="12" y2="22" strokeOpacity="0.3" />
              <polyline points="2,8.5 12,14 22,8.5" strokeOpacity="0.3" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Translucent Glass</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Adaptif pada kartu kaca multi-lapisan</p>
          </div>
        </div>

        {/* Context 4: Favicon & Monogram */}
        <div className="rune-glass p-5 rounded-2xl border-white/10 flex flex-col items-center text-center gap-3">
          <div className="size-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center shadow-lg">
            <span className="font-mono font-black text-lg bg-gradient-to-br from-violet-300 via-white to-cyan-300 bg-clip-text text-transparent">
              O
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Monogram &lsquo;O&rsquo;</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Favicon &amp; avatar beresolusi mikro</p>
          </div>
        </div>
      </div>
    </section>
  );
}
