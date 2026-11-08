"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { RuneIcon, resolveIconName } from "@/components/ui/rune-icon";

export interface CuratedIcon {
  name: string;
  label: string;
  category: "popular" | "media" | "social" | "business";
}

export const CURATED_ICONS: CuratedIcon[] = [
  // Populer
  { name: "glass-sparkle-3-2", label: "Kilau / Populer", category: "popular" },
  { name: "glass-star-4", label: "Bintang Unggulan", category: "popular" },
  { name: "glass-shield-check-1", label: "Terverifikasi", category: "popular" },
  { name: "glass-chain-link-3-1", label: "Tautan Web", category: "popular" },
  { name: "glass-zap-2", label: "Kilat / Cepat", category: "popular" },
  { name: "glass-heart-2-2", label: "Favorit / Suka", category: "popular" },

  // Media & Kreatif
  { name: "glass-video-2", label: "Video", category: "media" },
  { name: "glass-camera-1-2", label: "Kamera / Foto", category: "media" },
  { name: "glass-volume-full-2", label: "Audio / Musik", category: "media" },
  { name: "glass-images-sparkle-2", label: "Galeri Foto", category: "media" },
  { name: "glass-play-2", label: "Pemutar Media", category: "media" },

  // Komunikasi & Sosial
  { name: "glass-bubble-2", label: "Pesan Chat", category: "social" },
  { name: "glass-email", label: "Email", category: "social" },
  { name: "glass-telephone", label: "Telepon", category: "social" },
  { name: "glass-circle-person", label: "Profil Kreator", category: "social" },
  { name: "glass-whatsapp", label: "WhatsApp", category: "social" },

  // Bisnis, Portofolio & Alat
  { name: "glass-shopping-bag", label: "Toko / Belanja", category: "business" },
  { name: "glass-code", label: "Coding / Proyek", category: "business" },
  { name: "glass-file-text", label: "Dokumen / Artikel", category: "business" },
  { name: "glass-wallet-1", label: "Dompet / Donasi", category: "business" },
  { name: "glass-credit-card", label: "Pembayaran", category: "business" },
  { name: "glass-lock-1", label: "Akses Eksklusif", category: "business" },
  { name: "glass-earth-2", label: "Global / Website", category: "business" },
  { name: "glass-gift", label: "Hadiah / Giveaway", category: "business" },
];

interface IconPickerProps {
  selectedIcon?: string;
  onSelectIcon: (iconName: string) => void;
}

export function IconPicker({ selectedIcon, onSelectIcon }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeIcon = resolveIconName(selectedIcon);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-neutral-300">
          Ikon Blok (Glass Icon):
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

        <span className="text-xs text-neutral-400 p-1.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
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
                  className={`size-11 rounded-xl flex items-center justify-center p-1.5 transition ${
                    isSelected
                      ? "bg-indigo-600/30 border-2 border-indigo-500 scale-105"
                      : "bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08]"
                  }`}
                >
                  <RuneIcon name={icon.name} type="glass" size={22} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
