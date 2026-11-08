"use client";

import { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  X,
  Copy,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { PageBlock } from "@/db/schema";
import type { PageBlockConfig } from "../../types";
import { detectMediaEmbed } from "../../server/embed-helpers";
import { IconPicker } from "../icon-picker";

interface BlockInspectorDrawerProps {
  block: PageBlock | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveBlock: (
    blockId: string,
    updates: {
      title: string;
      url: string;
      iconName?: string;
      colSpan: number;
      rowSpan: number;
      config: PageBlockConfig;
      isActive: boolean;
    }
  ) => void;
  onRequestDeleteBlock: (block: PageBlock) => void;
  onMoveBlock: (blockId: string, direction: "up" | "down") => void;
  onDuplicateBlock?: (block: PageBlock) => void;
}

interface BlockInspectorContentProps {
  block: PageBlock;
  onClose: () => void;
  onSaveBlock: (
    blockId: string,
    updates: {
      title: string;
      url: string;
      iconName?: string;
      colSpan: number;
      rowSpan: number;
      config: PageBlockConfig;
      isActive: boolean;
    }
  ) => void;
  onRequestDeleteBlock: (block: PageBlock) => void;
  onMoveBlock: (blockId: string, direction: "up" | "down") => void;
  onDuplicateBlock?: (block: PageBlock) => void;
}

function BlockInspectorContent({
  block,
  onClose,
  onSaveBlock,
  onRequestDeleteBlock,
  onMoveBlock,
  onDuplicateBlock,
}: BlockInspectorContentProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const config = (block.config ?? {}) as PageBlockConfig;
  const [title, setTitle] = useState(block.title);
  const [url, setUrl] = useState(block.url);
  const [iconName, setIconName] = useState(block.iconName || "glass-sparkle");
  const [subtitle, setSubtitle] = useState(config.subtitle ?? "");
  const [badgeText, setBadgeText] = useState(config.badgeText ?? "");
  const [colSpan, setColSpan] = useState(block.colSpan);
  const [rowSpan, setRowSpan] = useState(block.rowSpan);
  const [isActive, setIsActive] = useState(block.isActive);

  // Variant Specific States
  const [noteContent, setNoteContent] = useState(config.noteContent ?? "");
  const [imageUrl, setImageUrl] = useState(config.imageUrl ?? "");
  const [locationName, setLocationName] = useState(config.locationName ?? "");
  const [repoName, setRepoName] = useState(config.repoName ?? "");
  const [repoLanguage, setRepoLanguage] = useState(config.repoLanguage ?? "TypeScript");
  const [repoStars, setRepoStars] = useState(String(config.repoStars ?? 128));

  // Social Links
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(
    config.socialLinks ?? {}
  );

  const detectedMedia =
    block.type === "media_embed" && url ? detectMediaEmbed(url) : null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const currentConfig = (block.config ?? {}) as PageBlockConfig;
    const updatedConfig: PageBlockConfig = {
      ...currentConfig,
      subtitle: subtitle.trim() || undefined,
      badgeText: badgeText.trim() || undefined,
      noteContent: noteContent.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      locationName: locationName.trim() || undefined,
      repoName: repoName.trim() || undefined,
      repoLanguage: repoLanguage.trim() || undefined,
      repoStars: parseInt(repoStars, 10) || undefined,
      socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
    };

    if (block.type === "media_embed") {
      const detected = detectMediaEmbed(url);
      if (detected?.platform === "youtube") {
        updatedConfig.embedType = "youtube";
        updatedConfig.embedId = detected.videoId;
      } else if (detected?.platform === "spotify") {
        updatedConfig.embedType = "spotify";
      }
    }

    onSaveBlock(block.id, {
      title: title.trim(),
      url: block.type === "header_text" ? "#" : url.trim(),
      iconName: block.type === "header_text" ? undefined : iconName,
      colSpan: block.type === "header_text" ? 2 : colSpan,
      rowSpan: block.type === "header_text" ? 1 : rowSpan,
      config: updatedConfig,
      isActive,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md h-full bg-neutral-900/95 border-l border-white/15 p-6 shadow-2xl backdrop-blur-2xl overflow-y-auto space-y-5 animate-in slide-in-from-right duration-300 flex flex-col justify-between"
        role="dialog"
        aria-modal="true"
      >
        <div className="space-y-5">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Pencil size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Inspektor Blok
                </h3>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">
                  Tipe: {config.variant || block.type}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form Fields */}
          <form id="block-inspector-form" onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Judul Blok <span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-white/10 bg-neutral-950/60 text-white text-sm"
              />
            </div>

            {/* Note Variant: Content Textarea */}
            {config.variant === "note" && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Isi Catatan / Kutipan <span className="text-red-400">*</span>
                </label>
                <Textarea
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Tuliskan catatan..."
                  required
                  className="border-white/10 bg-neutral-950/60 text-white text-sm"
                />
              </div>
            )}

            {/* Image Variant: Image URL */}
            {config.variant === "image" && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  URL Foto / Banner <span className="text-red-400">*</span>
                </label>
                <Input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="border-white/10 bg-neutral-950/60 text-white text-sm"
                />
              </div>
            )}

            {/* Map Variant: Location Name */}
            {config.variant === "map" && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Nama Kota / Domisili <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Jakarta, Indonesia"
                  required
                  className="border-white/10 bg-neutral-950/60 text-white text-sm"
                />
              </div>
            )}

            {/* GitHub Variant: Repo Details */}
            {config.variant === "github" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Nama Repositori
                  </label>
                  <Input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="user/repo"
                    className="border-white/10 bg-neutral-950/60 text-white text-sm font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Bahasa
                    </label>
                    <Input
                      type="text"
                      value={repoLanguage}
                      onChange={(e) => setRepoLanguage(e.target.value)}
                      className="border-white/10 bg-neutral-950/60 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Stars
                    </label>
                    <Input
                      type="number"
                      value={repoStars}
                      onChange={(e) => setRepoStars(e.target.value)}
                      className="border-white/10 bg-neutral-950/60 text-white text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Row Variant: Platform Links */}
            {block.type === "social_row" && (
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-neutral-300">
                  Tautan Profil Media Sosial:
                </label>
                {["instagram", "github", "twitter", "youtube", "tiktok", "whatsapp"].map((p) => (
                  <div key={p} className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 w-20 capitalize">{p}:</span>
                    <Input
                      type="url"
                      value={socialLinks[p] ?? ""}
                      onChange={(e) =>
                        setSocialLinks((prev) => ({ ...prev, [p]: e.target.value }))
                      }
                      placeholder={`https://${p}.com/...`}
                      className="border-white/10 bg-neutral-950/60 text-white text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* URL field for standard links / media / cards */}
            {block.type !== "header_text" &&
              block.type !== "social_row" &&
              config.variant !== "map" && (
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    URL Tujuan (Link) <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="border-white/10 bg-neutral-950/60 text-white text-sm"
                  />
                  {detectedMedia && (
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-emerald-400">
                      <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>Media valid terdeteksi!</span>
                    </div>
                  )}
                </div>
              )}

            {/* Icon Picker (for Link & Standard Bento Card) */}
            {block.type !== "header_text" &&
              block.type !== "social_row" &&
              config.variant !== "image" && (
                <IconPicker
                  selectedIcon={iconName}
                  onSelectIcon={(name) => setIconName(name)}
                />
              )}

            {/* Subtitle & Badge (for Bento Cards) */}
            {block.type === "bento_card" && config.variant !== "note" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Subtitle
                  </label>
                  <Input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Ringkasan singkat"
                    className="border-white/10 bg-neutral-950/60 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Badge Label
                  </label>
                  <Input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="BARU / HOT"
                    className="border-white/10 bg-neutral-950/60 text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Grid Size Switcher (for Bento Cards) */}
            {block.type === "bento_card" && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Ukuran Kartu di Bento Grid:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setColSpan(1);
                      setRowSpan(1);
                    }}
                    className={`p-2 rounded-xl border text-center transition ${
                      colSpan === 1 && rowSpan === 1
                        ? "bg-indigo-600/30 border-indigo-500 text-white ring-2 ring-indigo-500/20"
                        : "bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="text-xs font-semibold">1x1 Kotak</div>
                    <div className="text-[10px] text-neutral-500">1 Kolom</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setColSpan(2);
                      setRowSpan(1);
                    }}
                    className={`p-2 rounded-xl border text-center transition ${
                      colSpan === 2 && rowSpan === 1
                        ? "bg-indigo-600/30 border-indigo-500 text-white ring-2 ring-indigo-500/20"
                        : "bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="text-xs font-semibold">2x1 Lebar</div>
                    <div className="text-[10px] text-neutral-500">2 Kolom</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setColSpan(2);
                      setRowSpan(2);
                    }}
                    className={`p-2 rounded-xl border text-center transition ${
                      colSpan === 2 && rowSpan === 2
                        ? "bg-indigo-600/30 border-indigo-500 text-white ring-2 ring-indigo-500/20"
                        : "bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="text-xs font-semibold">2x2 Besar</div>
                    <div className="text-[10px] text-neutral-500">2 Kolom, 2 Baris</div>
                  </button>
                </div>
              </div>
            )}

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Tampilkan di Halaman
                </span>
                <span className="text-[10px] text-neutral-400">
                  {isActive
                    ? "Blok ini aktif dan dapat dilihat pengunjung"
                    : "Blok disembunyikan sementara"}
                </span>
              </div>
              <Switch checked={isActive} onCheckedChange={(val) => setIsActive(val)} />
            </div>

            {/* Quick Move Buttons */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Urutan Kartu:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onMoveBlock(block.id, "up")}
                  className="border-white/10 text-neutral-300 hover:bg-white/5 text-xs py-2 flex items-center justify-center gap-1.5"
                >
                  <ChevronUp size={14} />
                  <span>Pindah ke Atas</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onMoveBlock(block.id, "down")}
                  className="border-white/10 text-neutral-300 hover:bg-white/5 text-xs py-2 flex items-center justify-center gap-1.5"
                >
                  <ChevronDown size={14} />
                  <span>Pindah ke Bawah</span>
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onRequestDeleteBlock(block)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs gap-1.5 px-2.5 h-9"
            >
              <Trash2 size={14} />
              <span>Hapus</span>
            </Button>

            {onDuplicateBlock && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => onDuplicateBlock(block)}
                className="text-neutral-300 hover:text-white hover:bg-white/5 text-xs gap-1.5 px-2.5 h-9"
              >
                <Copy size={14} />
                <span className="hidden sm:inline">Duplikat</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/10 text-neutral-300 hover:bg-white/5 text-xs h-9"
            >
              Batal
            </Button>
            <Button
              form="block-inspector-form"
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 shadow-lg shadow-indigo-600/30 h-9"
            >
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlockInspectorDrawer({
  block,
  isOpen,
  onClose,
  onSaveBlock,
  onRequestDeleteBlock,
  onMoveBlock,
  onDuplicateBlock,
}: BlockInspectorDrawerProps) {
  if (!isOpen || !block) return null;

  return (
    <BlockInspectorContent
      key={block.id}
      block={block}
      onClose={onClose}
      onSaveBlock={onSaveBlock}
      onRequestDeleteBlock={onRequestDeleteBlock}
      onMoveBlock={onMoveBlock}
      onDuplicateBlock={onDuplicateBlock}
    />
  );
}
