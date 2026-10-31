"use client";

import { useState } from "react";
import { RuneIcon } from "runeicons-react";

export interface CuratedIcon {
  name: string;
  label: string;
  category: "popular" | "media" | "social" | "business";
}

export const CURATED_ICONS: CuratedIcon[] = [
  // Popular
  { name: "glass-sparkle", label: "Sparkle", category: "popular" },
  { name: "glass-star", label: "Bintang", category: "popular" },
  { name: "glass-badge-check", label: "Verified", category: "popular" },
  { name: "glass-chain-link-3-1", label: "Tautan", category: "popular" },

  // Media
  { name: "glass-video-recorder", label: "Video Player", category: "media" },
  { name: "glass-video", label: "Kamera Video", category: "media" },
  { name: "glass-camera", label: "Foto", category: "media" },
  { name: "glass-music", label: "Musik", category: "media" },

  // Social / Communication
  { name: "glass-message", label: "Pesan", category: "social" },
  { name: "glass-mail", label: "Email", category: "social" },
  { name: "glass-phone", label: "Telepon", category: "social" },
  { name: "glass-user", label: "Profil", category: "social" },

  // Business / Tools
  { name: "glass-shopping-bag", label: "Belanja", category: "business" },
  { name: "glass-code", label: "Coding", category: "business" },
  { name: "glass-book", label: "Buku / Catatan", category: "business" },
  { name: "glass-lock-1", label: "Privat / Kunci", category: "business" },
];

interface IconPickerProps {
  selectedIcon?: string;
  onSelectIcon: (iconName: string) => void;
}

export function IconPicker({ selectedIcon, onSelectIcon }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeIcon = selectedIcon || "glass-sparkle";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-neutral-300">
          Ikon Blok (Runeicon Glass):
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition"
        >
          {isOpen ? "Tutup Pilihan" : "Ganti Ikon"}
        </button>
      </div>

      {/* Selected Icon Trigger Preview */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-neutral-900/60 hover:bg-neutral-900/80 transition text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
            <RuneIcon name={activeIcon} type="glass" size={20} />
          </div>
          <div>
            <div className="text-xs font-medium text-neutral-200">
              {CURATED_ICONS.find((i) => i.name === activeIcon)?.label || activeIcon}
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">
              {activeIcon}
            </div>
          </div>
        </div>

        <span className="text-xs text-neutral-400 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded Grid */}
      {isOpen && (
        <div className="p-3 rounded-xl border border-white/10 bg-neutral-950/90 shadow-xl space-y-3 animate-in fade-in duration-150">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {CURATED_ICONS.map((icon) => {
              const isSelected = activeIcon === icon.name;
              return (
                <button
                  key={icon.name}
                  type="button"
                  title={icon.label}
                  onClick={() => {
                    onSelectIcon(icon.name);
                    setIsOpen(false);
                  }}
                  className={`size-10 rounded-xl border flex items-center justify-center transition ${
                    isSelected
                      ? "bg-indigo-600/30 border-indigo-500 text-white shadow-lg ring-2 ring-indigo-500/20"
                      : "bg-white/[0.03] border-white/10 text-neutral-400 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  <RuneIcon name={icon.name} type="glass" size={18} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
