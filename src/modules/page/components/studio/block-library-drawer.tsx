"use client";

import { useState } from "react";
import { RuneIcon } from "runeicons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PageBlockType, PageBlockConfig } from "../../types";
import { detectMediaEmbed } from "../../server/embed-helpers";
import { IconPicker } from "../icon-picker";

interface BlockLibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (input: {
    type: PageBlockType;
    title: string;
    url: string;
    iconName?: string;
    colSpan: number;
    rowSpan: number;
    config: PageBlockConfig;
  }) => void;
}

export function BlockLibraryDrawer({
  isOpen,
  onClose,
  onAddBlock,
}: BlockLibraryDrawerProps) {
  const [selectedType, setSelectedType] = useState<PageBlockType>("bento_card");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [iconName, setIconName] = useState("glass-sparkle");
  const [colSpan, setColSpan] = useState(1);
  const [rowSpan, setRowSpan] = useState(1);

  if (!isOpen) return null;

  const detectedMedia =
    selectedType === "media_embed" && url ? detectMediaEmbed(url) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetUrl = selectedType === "header_text" ? "#" : url.trim();
    if (!targetUrl) return;

    const config: PageBlockConfig = {};
    if (subtitle.trim()) config.subtitle = subtitle.trim();
    if (badgeText.trim()) config.badgeText = badgeText.trim();

    if (selectedType === "media_embed") {
      const detected = detectMediaEmbed(targetUrl);
      if (detected?.platform === "youtube") {
        config.embedType = "youtube";
        config.embedId = detected.videoId;
      } else if (detected?.platform === "spotify") {
        config.embedType = "spotify";
      }
    }

    onAddBlock({
      type: selectedType,
      title: title.trim(),
      url: targetUrl,
      iconName: selectedType === "header_text" ? undefined : iconName,
      colSpan: selectedType === "header_text" ? 2 : colSpan,
      rowSpan: selectedType === "header_text" ? 1 : rowSpan,
      config,
    });

    // Reset
    setTitle("");
    setUrl("");
    setSubtitle("");
    setBadgeText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-neutral-900/95 border border-white/15 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <RuneIcon name="glass-sparkle" type="glass" size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Tambah Blok Bento Baru
              </h3>
              <p className="text-xs text-neutral-400">
                Pilih jenis elemen untuk ditambahkan ke Studio Canvas.
              </p>
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

        {/* Template Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            {
              id: "bento_card",
              label: "Kartu Bento",
              desc: "Kotak visual glow",
              icon: "glass-sparkle",
              defaultIcon: "glass-sparkle",
            },
            {
              id: "link",
              label: "Tautan",
              desc: "Pill link klasik",
              icon: "glass-chain-link-3-1",
              defaultIcon: "glass-chain-link-3-1",
            },
            {
              id: "media_embed",
              label: "Media Player",
              desc: "YouTube / Spotify",
              icon: "glass-video-recorder",
              defaultIcon: "glass-video-recorder",
            },
            {
              id: "header_text",
              label: "Judul Seksi",
              desc: "Pemisah kategori",
              icon: "glass-edit-pen",
              defaultIcon: "glass-sparkle",
            },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setSelectedType(t.id as PageBlockType);
                setIconName(t.defaultIcon);
                if (t.id === "bento_card") {
                  setColSpan(1);
                  setRowSpan(1);
                } else if (t.id === "header_text") {
                  setColSpan(2);
                  setRowSpan(1);
                }
              }}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-2 ${
                selectedType === t.id
                  ? "bg-indigo-600/25 border-indigo-500 text-white ring-2 ring-indigo-500/20 shadow-lg"
                  : "bg-white/[0.03] border-white/5 text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-200"
              }`}
            >
              <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center">
                <RuneIcon name={t.icon} type="glass" size={18} />
              </div>
              <div>
                <span className="text-xs font-semibold block">{t.label}</span>
                <span className="text-[10px] text-neutral-500">{t.desc}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Inputs Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-white/5">
          {selectedType !== "header_text" && (
            <IconPicker
              selectedIcon={iconName}
              onSelectIcon={(name) => setIconName(name)}
            />
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              {selectedType === "header_text" ? "Teks Judul Seksi" : "Judul Blok"}{" "}
              <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                selectedType === "header_text"
                  ? "misal: KARYA PILIHAN"
                  : selectedType === "media_embed"
                    ? "misal: Tutorial Fullstack Next.js 16"
                    : selectedType === "bento_card"
                      ? "misal: Portofolio Proyek"
                      : "misal: Baca Artikel Blog Saya"
              }
              required
              className="border-white/10 bg-neutral-950/60 text-white text-sm"
            />
          </div>

          {selectedType !== "header_text" && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                {selectedType === "media_embed"
                  ? "URL YouTube / Spotify"
                  : "URL Tujuan"}{" "}
                <span className="text-red-400">*</span>
              </label>
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={
                  selectedType === "media_embed"
                    ? "https://www.youtube.com/watch?v=... atau https://open.spotify.com/track/..."
                    : "https://example.com"
                }
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

          {selectedType === "bento_card" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Subtitle (Opsional)
                  </label>
                  <Input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="misal: 10+ Proyek Web"
                    className="border-white/10 bg-neutral-950/60 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Badge Label (Opsional)
                  </label>
                  <Input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="misal: POPULAR"
                    className="border-white/10 bg-neutral-950/60 text-white text-xs"
                  />
                </div>
              </div>

              {/* Grid Dimensions */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Ukuran Kartu di Grid:
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
                    <div className="text-[10px] text-neutral-500">Kompak 1 Kolom</div>
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
                    <div className="text-[10px] text-neutral-500">Rentang 2 Kolom</div>
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
                    <div className="text-[10px] text-neutral-500">Sorotan Utama</div>
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/10 text-neutral-300 hover:text-white rounded-xl text-xs h-10 px-4"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-10 px-5 font-semibold shadow-lg"
            >
              Tambahkan ke Kanvas
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
