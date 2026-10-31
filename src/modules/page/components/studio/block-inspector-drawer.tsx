"use client";

import { useState } from "react";
import { RuneIcon } from "runeicons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  onDeleteBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, direction: "up" | "down") => void;
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
  onDeleteBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, direction: "up" | "down") => void;
}

function BlockInspectorContent({
  block,
  onClose,
  onSaveBlock,
  onDeleteBlock,
  onMoveBlock,
}: BlockInspectorContentProps) {
  const config = (block.config ?? {}) as PageBlockConfig;
  const [title, setTitle] = useState(block.title);
  const [url, setUrl] = useState(block.url);
  const [iconName, setIconName] = useState(block.iconName || "glass-sparkle");
  const [subtitle, setSubtitle] = useState(config.subtitle ?? "");
  const [badgeText, setBadgeText] = useState(config.badgeText ?? "");
  const [colSpan, setColSpan] = useState(block.colSpan);
  const [rowSpan, setRowSpan] = useState(block.rowSpan);
  const [isActive, setIsActive] = useState(block.isActive);

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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
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
                <RuneIcon name="glass-edit-pen" type="glass" size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Inspektor Blok
                </h3>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">
                  Tipe: {block.type}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition"
            >
              ✕
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

            {block.type !== "header_text" && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  URL Tujuan <span className="text-red-400">*</span>
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
                    <span>
                      {detectedMedia.platform === "youtube"
                        ? "YouTube Video valid terdeteksi!"
                        : `Spotify ${detectedMedia.spotifyType} valid terdeteksi!`}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Icon Picker (if not header_text) */}
            {block.type !== "header_text" && (
              <IconPicker
                selectedIcon={iconName}
                onSelectIcon={(name) => setIconName(name)}
              />
            )}

            {/* Bento Card specific inputs */}
            {block.type === "bento_card" && (
              <>
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

                {/* Grid Size Switcher */}
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
                      <div className="text-[10px] text-neutral-500">Sorotan</div>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Active Toggle & Move controls */}
            <div className="pt-2 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-neutral-200">
                    Status Tampil
                  </span>
                  <p className="text-[11px] text-neutral-500">
                    Tampilkan kartu ini di halaman publik
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isActive ? "bg-indigo-600" : "bg-neutral-800"
                  }`}
                >
                  <span
                    className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                      isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-neutral-400">Urutan Kartu:</span>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onMoveBlock(block.id, "up")}
                    className="border-white/10 text-neutral-300 text-xs h-8 px-2.5 rounded-lg"
                  >
                    ▲ Geser Atas
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onMoveBlock(block.id, "down")}
                    className="border-white/10 text-neutral-300 text-xs h-8 px-2.5 rounded-lg"
                  >
                    ▼ Geser Bawah
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (confirm("Hapus blok ini dari kanvas?")) {
                onDeleteBlock(block.id);
                onClose();
              }
            }}
            className="border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs h-10 rounded-xl"
          >
            Hapus Blok
          </Button>

          <Button
            type="submit"
            form="block-inspector-form"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-10 px-5 rounded-xl font-medium shadow-lg"
          >
            Terapkan Perubahan
          </Button>
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
  onDeleteBlock,
  onMoveBlock,
}: BlockInspectorDrawerProps) {
  if (!isOpen || !block) return null;

  return (
    <BlockInspectorContent
      key={block.id}
      block={block}
      onClose={onClose}
      onSaveBlock={onSaveBlock}
      onDeleteBlock={onDeleteBlock}
      onMoveBlock={onMoveBlock}
    />
  );
}
