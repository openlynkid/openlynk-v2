"use client";

import { useState } from "react";
import { Check, ArrowRight, Quote, Globe, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { THEME_PRESETS, type ThemePresetId } from "@/modules/page";
import { useObsidianToast } from "./obsidian-toast";

type PreviewCardType = "profile" | "note" | "featured";

export function ObsidianThemePlayground() {
  const [selectedThemeId, setSelectedThemeId] = useState<ThemePresetId>("obsidian");
  const [activeCardTab, setActiveCardTab] = useState<PreviewCardType>("profile");
  const { showToast } = useObsidianToast();

  const currentTheme = THEME_PRESETS[selectedThemeId];
  const presets = Object.values(THEME_PRESETS);

  const handleCopyThemeAccent = async () => {
    try {
      await navigator.clipboard.writeText(currentTheme.accentColor);
      showToast(`Aksen ${currentTheme.name} Disalin`, currentTheme.accentColor);
    } catch {
      // ignore
    }
  };

  return (
    <section id="themes" className="py-12 sm:py-16 border-b border-white/10 space-y-10 scroll-mt-24">
      <div className="max-w-4xl mx-auto space-y-2">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-violet-400" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Tema Visual &amp; Atmosfer Antarmuka
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400">
          Obsidian menyediakan 5 preset tema visual terkurasi. Setiap tema mengubah palet pendar ambient glow, aksen warna borders, dan atmosfer antarmuka secara harmonis.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Preset Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {presets.map((preset) => {
            const isSelected = selectedThemeId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedThemeId(preset.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? `bg-neutral-900/90 ${preset.activeBorder} shadow-lg scale-[1.02]`
                    : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-3 rounded-full ring-2 ring-white/10 shrink-0"
                      style={{ backgroundColor: preset.accentColor }}
                    />
                    <span className="text-xs font-bold text-white tracking-tight truncate">
                      {preset.name}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="size-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check size={10} className="text-white" />
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-neutral-400 line-clamp-1">{preset.description}</p>
                  <p className="text-[10px] font-mono text-neutral-400 uppercase">{preset.accentColor}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Interactive Preview Stage */}
        <div className="relative rounded-3xl border border-white/15 bg-neutral-950/70 backdrop-blur-2xl p-6 sm:p-8 overflow-hidden space-y-6">
          {/* Ambient Glow simulated from current theme */}
          <div
            className={`absolute top-0 right-1/4 w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none opacity-40 transition-all duration-700 ${currentTheme.glows.primary}`}
          />
          <div
            className="absolute bottom-0 -left-10 w-[280px] h-[280px] rounded-full blur-[100px] pointer-events-none opacity-30 transition-all duration-700"
            style={{ backgroundColor: currentTheme.accentColor }}
          />

          {/* Theme Meta Bar */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div
                className="size-4 rounded-full ring-4 ring-white/10 shrink-0"
                style={{ backgroundColor: currentTheme.accentColor }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {currentTheme.name}
                  </h3>
                  <Badge variant="outline" className="text-[10px] py-0 px-2 font-mono border-white/15 text-neutral-300">
                    Active Preset
                  </Badge>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">{currentTheme.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyThemeAccent}
                className="border-white/10 text-neutral-200 hover:bg-white/5 rounded-xl text-xs h-8 px-3 gap-1.5 cursor-pointer"
              >
                <Copy size={12} />
                <span className="font-mono text-[11px]">{currentTheme.accentColor}</span>
              </Button>
            </div>
          </div>

          {/* Tab preview switcher */}
          <div className="relative z-10 flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium">Contoh Komponen:</span>
            <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 p-1 rounded-xl">
              {(
                [
                  { id: "profile", label: "Hero Card" },
                  { id: "note", label: "Note Surface" },
                  { id: "featured", label: "Featured Action" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCardTab(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    activeCardTab === tab.id
                      ? "bg-white/15 text-white shadow-sm font-semibold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Card Stage */}
          <div className="relative z-10 max-w-xl mx-auto pt-2">
            {activeCardTab === "profile" && (
              <div
                className={`rune-glass p-6 sm:p-7 rounded-3xl border transition-all duration-300 shadow-2xl ${currentTheme.activeBorder}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="size-16 rounded-2xl bg-neutral-900 border border-white/20 shadow-xl flex items-center justify-center relative overflow-hidden shrink-0"
                  >
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{ backgroundColor: currentTheme.accentColor }}
                    />
                    <span className="font-mono font-bold text-xl text-white">OS</span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-white tracking-tight truncate">
                        Obsidian Studio
                      </h4>
                      <span
                        className="size-2 rounded-full shrink-0"
                        style={{ backgroundColor: currentTheme.accentColor }}
                      />
                    </div>
                    <p className="text-xs text-neutral-400 font-mono">obsidian.design/specimen</p>
                    <p className="text-xs text-neutral-300 line-clamp-1">
                      Antarmuka taktil presisi tinggi dengan kedalaman gelap tak terbatas.
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Globe size={13} />
                    <span>Global CDN</span>
                  </div>

                  <Button
                    size="sm"
                    className="text-white text-xs font-semibold rounded-xl h-8 px-4 cursor-pointer shadow-md"
                    style={{ backgroundColor: currentTheme.accentColor }}
                  >
                    <span>Jelajahi Specimen</span>
                    <ArrowRight size={12} className="ml-1.5" />
                  </Button>
                </div>
              </div>
            )}

            {activeCardTab === "note" && (
              <div
                className={`rune-glass p-6 rounded-3xl border transition-all duration-300 shadow-xl space-y-3 ${currentTheme.activeBorder}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Quote size={15} style={{ color: currentTheme.accentColor }} />
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                      Engineering Note
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">v1.0.0</span>
                </div>

                <p className="text-sm text-neutral-200 leading-relaxed italic">
                  &ldquo;Kejernihan visual dicapai bukan dengan menambahkan elemen, melainkan dengan menyempurnakan kontras, material taktil, dan ritme tipografi.&rdquo;
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-neutral-400 border-t border-white/5">
                  <span>Arsitektur Obsidian</span>
                  <span className="font-mono text-[11px]" style={{ color: currentTheme.accentColor }}>
                    {currentTheme.name}
                  </span>
                </div>
              </div>
            )}

            {activeCardTab === "featured" && (
              <div
                className={`rune-glass p-6 rounded-3xl border transition-all duration-300 shadow-xl flex items-center justify-between gap-4 ${currentTheme.activeBorder}`}
              >
                <div className="space-y-1">
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 px-2 font-mono"
                    style={{
                      borderColor: `${currentTheme.accentColor}66`,
                      color: currentTheme.accentColor,
                    }}
                  >
                    FEATURED ACTION
                  </Badge>
                  <h4 className="text-base font-bold text-white tracking-tight">
                    Modular Component Registry
                  </h4>
                  <p className="text-xs text-neutral-400 max-w-sm">
                    Akses ratusan kombinasi bento card dengan preset palet warna dinamis.
                  </p>
                </div>

                <Button
                  size="sm"
                  className="shrink-0 text-white text-xs font-semibold rounded-xl h-9 px-4 cursor-pointer shadow-lg"
                  style={{ backgroundColor: currentTheme.accentColor }}
                >
                  Buka Modul
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
