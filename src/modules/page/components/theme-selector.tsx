"use client";

import { Sparkles } from "lucide-react";
import { THEME_PRESETS, type ThemePresetId } from "../types/themes";

interface ThemeSelectorProps {
  selectedPresetId: string;
  onSelectPreset: (presetId: ThemePresetId, accentColor: string) => void;
}

export function ThemeSelector({
  selectedPresetId,
  onSelectPreset,
}: ThemeSelectorProps) {
  const presets = Object.values(THEME_PRESETS);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-white tracking-tight flex items-center gap-1.5">
            <Sparkles size={16} />
            <span>Tema Visual Halaman</span>
          </label>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Pilih atmosfer pencahayaan dan pendar kaca untuk halaman ini.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {presets.map((preset) => {
          const isSelected = selectedPresetId === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.id, preset.accentColor)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-2.5 relative overflow-hidden group ${
                isSelected
                  ? `bg-neutral-900/90 ${preset.activeBorder} shadow-lg`
                  : "bg-neutral-950/40 border-white/10 hover:border-white/20 hover:bg-neutral-900/40 text-neutral-400"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                {/* Swatch Circle */}
                <div
                  className={`size-6 rounded-full bg-gradient-to-tr ${preset.swatchGradient} shadow-md border border-white/20`}
                />

                {isSelected && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white">
                    Aktif
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-white group-hover:text-white transition">
                  {preset.name}
                </h4>
                <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                  {preset.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
