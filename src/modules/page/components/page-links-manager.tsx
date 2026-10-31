"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RuneIcon } from "runeicons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PageBlock } from "@/db/schema";
import type { PageBlockType, PageBlockConfig } from "../types";
import { detectMediaEmbed } from "../server/embed-helpers";
import {
  createPageBlock,
  updatePageBlock,
  deletePageBlock,
  reorderPageBlocks,
} from "../server/page-service";

interface PageLinksManagerProps {
  profileId: string;
  pageId: string;
  initialBlocks?: PageBlock[];
  blocks?: PageBlock[];
  onBlocksChange?: (blocks: PageBlock[]) => void;
}

export function PageLinksManager({
  profileId,
  pageId,
  initialBlocks,
  blocks: controlledBlocks,
  onBlocksChange,
}: PageLinksManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [internalBlocks, setInternalBlocks] = useState<PageBlock[]>(
    controlledBlocks ?? initialBlocks ?? []
  );

  const blocks = controlledBlocks ?? internalBlocks;

  const updateBlocksState = (updater: (prev: PageBlock[]) => PageBlock[]) => {
    const next = updater(blocks);
    if (onBlocksChange) {
      onBlocksChange(next);
    } else {
      setInternalBlocks(next);
    }
  };
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [selectedType, setSelectedType] = useState<PageBlockType>("link");
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newBadgeText, setNewBadgeText] = useState("");
  const [newColSpan, setNewColSpan] = useState<number>(1);
  const [newRowSpan, setNewRowSpan] = useState<number>(1);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editColSpan, setEditColSpan] = useState<number>(1);
  const [editRowSpan, setEditRowSpan] = useState<number>(1);

  // Auto detect media embed when typing URL in media_embed tab
  const detectedMedia = selectedType === "media_embed" && newUrl ? detectMediaEmbed(newUrl) : null;

  const handleResetForm = () => {
    setIsAdding(false);
    setSelectedType("link");
    setNewTitle("");
    setNewUrl("");
    setNewSubtitle("");
    setNewBadgeText("");
    setNewColSpan(1);
    setNewRowSpan(1);
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // For header_text, url can default to #
    const targetUrl = selectedType === "header_text" ? "#" : newUrl.trim();
    if (!targetUrl) return;

    setError(null);

    const config: PageBlockConfig = {};
    if (newSubtitle.trim()) config.subtitle = newSubtitle.trim();
    if (newBadgeText.trim()) config.badgeText = newBadgeText.trim();

    if (selectedType === "media_embed") {
      const detected = detectMediaEmbed(targetUrl);
      if (detected?.platform === "youtube") {
        config.embedType = "youtube";
        config.embedId = detected.videoId;
      } else if (detected?.platform === "spotify") {
        config.embedType = "spotify";
      }
    }

    startTransition(async () => {
      const res = await createPageBlock(profileId, pageId, {
        type: selectedType,
        title: newTitle.trim(),
        url: targetUrl,
        colSpan: selectedType === "header_text" ? 2 : newColSpan,
        rowSpan: selectedType === "header_text" ? 1 : newRowSpan,
        config,
        iconName:
          selectedType === "media_embed"
            ? "glass-video-recorder"
            : selectedType === "bento_card"
              ? "glass-sparkle"
              : selectedType === "header_text"
                ? undefined
                : "glass-chain-link-3-1",
      });

      if (!res.success) {
        setError(res.error);
      } else {
        updateBlocksState((prev) => [...prev, res.data]);
        handleResetForm();
        router.refresh();
      }
    });
  };

  const handleToggleActive = (block: PageBlock) => {
    setError(null);
    const updatedStatus = !block.isActive;

    updateBlocksState((prev) =>
      prev.map((b) => (b.id === block.id ? { ...b, isActive: updatedStatus } : b))
    );

    startTransition(async () => {
      const res = await updatePageBlock(profileId, pageId, block.id, {
        isActive: updatedStatus,
      });
      if (!res.success) {
        setError(res.error);
        updateBlocksState((prev) =>
          prev.map((b) => (b.id === block.id ? { ...b, isActive: block.isActive } : b))
        );
      } else {
        router.refresh();
      }
    });
  };

  const handleDelete = (blockId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus blok ini?")) return;
    setError(null);

    const previousBlocks = [...blocks];
    updateBlocksState((prev) => prev.filter((b) => b.id !== blockId));

    startTransition(async () => {
      const res = await deletePageBlock(profileId, pageId, blockId);
      if (!res.success) {
        setError(res.error);
        updateBlocksState(() => previousBlocks);
      } else {
        router.refresh();
      }
    });
  };

  const handleStartEdit = (block: PageBlock) => {
    const config = (block.config ?? {}) as PageBlockConfig;
    setEditingId(block.id);
    setEditTitle(block.title);
    setEditUrl(block.url);
    setEditSubtitle(config.subtitle ?? "");
    setEditColSpan(block.colSpan);
    setEditRowSpan(block.rowSpan);
  };

  const handleSaveEdit = (block: PageBlock) => {
    if (!editTitle.trim()) return;
    setError(null);

    const currentConfig = (block.config ?? {}) as PageBlockConfig;
    const updatedConfig: PageBlockConfig = {
      ...currentConfig,
      subtitle: editSubtitle.trim() || undefined,
    };

    startTransition(async () => {
      const res = await updatePageBlock(profileId, pageId, block.id, {
        title: editTitle.trim(),
        url: editUrl.trim() || "#",
        colSpan: editColSpan,
        rowSpan: editRowSpan,
        config: updatedConfig,
      });

      if (!res.success) {
        setError(res.error);
      } else {
        updateBlocksState((prev) =>
          prev.map((b) => (b.id === block.id ? res.data : b))
        );
        setEditingId(null);
        router.refresh();
      }
    });
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    updateBlocksState(() => newBlocks);

    startTransition(async () => {
      const orderedIds = newBlocks.map((b) => b.id);
      const res = await reorderPageBlocks(profileId, pageId, orderedIds);
      if (!res.success) {
        setError(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const getTypeBadge = (block: PageBlock) => {
    switch (block.type) {
      case "bento_card":
        return {
          label: `Bento ${block.colSpan}x${block.rowSpan}`,
          color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        };
      case "media_embed":
        return {
          label: "Media Embed",
          color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        };
      case "header_text":
        return {
          label: "Judul Seksi",
          color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };
      case "link":
      default:
        return {
          label: "Tautan",
          color: "bg-neutral-800 text-neutral-300 border-white/5",
        };
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-5 w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <span>Blok Konten & Bento Grid</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-normal">
              {blocks.length} Blok
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Susun tata letak halaman: tautan, kartu bento visual, video, atau pemisah seksi.
          </p>
        </div>

        {!isAdding && (
          <Button
            type="button"
            onClick={() => setIsAdding(true)}
            className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl px-4 text-xs h-9 min-h-[44px] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RuneIcon name="glass-plus" type="glass" size={16} />
            <span>Tambah Blok</span>
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Add New Block Modal / Form */}
      {isAdding && (
        <form
          onSubmit={handleAddBlock}
          className="p-4 sm:p-5 rounded-2xl bg-neutral-950/90 border border-indigo-500/40 space-y-4 transition animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-sm font-semibold text-white flex items-center gap-2">
              <RuneIcon name="glass-sparkle" type="glass" size={18} />
              <span>Tambah Blok Bento Baru</span>
            </span>
            <button
              type="button"
              onClick={handleResetForm}
              className="text-neutral-400 hover:text-white text-xs px-2 py-1"
            >
              Batal
            </button>
          </div>

          {/* Type Selector Tabs */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2">
              Pilih Tipe Blok:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {
                  id: "link",
                  label: "Tautan",
                  desc: "Pill link klasik",
                  icon: "glass-chain-link-3-1",
                },
                {
                  id: "bento_card",
                  label: "Kartu Bento",
                  desc: "Kotak visual ber-glow",
                  icon: "glass-sparkle",
                },
                {
                  id: "media_embed",
                  label: "Media Player",
                  desc: "YouTube / Spotify",
                  icon: "glass-video-recorder",
                },
                {
                  id: "header_text",
                  label: "Judul Seksi",
                  desc: "Pemisah kategori",
                  icon: "glass-edit-pen",
                },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSelectedType(t.id as PageBlockType);
                    if (t.id === "bento_card") {
                      setNewColSpan(1);
                      setNewRowSpan(1);
                    } else if (t.id === "header_text") {
                      setNewColSpan(2);
                      setNewRowSpan(1);
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    selectedType === t.id
                      ? "bg-indigo-600/20 border-indigo-500 text-white"
                      : "bg-white/[0.03] border-white/5 text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-200"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <RuneIcon name={t.icon} type="glass" size={16} />
                    <span className="text-xs font-semibold">{t.label}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 leading-tight">
                    {t.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs for Title */}
          <div>
            <label className="block text-xs text-neutral-300 mb-1">
              {selectedType === "header_text"
                ? "Teks Judul Seksi"
                : "Judul Blok"}{" "}
              <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={
                selectedType === "header_text"
                  ? "misal: KARYA PILIHAN"
                  : selectedType === "media_embed"
                    ? "misal: Tutorial Fullstack Next.js 16"
                    : selectedType === "bento_card"
                      ? "misal: Portofolio Desain"
                      : "misal: Ikuti Channel YouTube Saya"
              }
              required
              className="border-white/10 bg-neutral-900/60 text-white placeholder:text-neutral-600 text-sm"
            />
          </div>

          {/* Inputs for URL (unless header_text) */}
          {selectedType !== "header_text" && (
            <div>
              <label className="block text-xs text-neutral-300 mb-1">
                {selectedType === "media_embed"
                  ? "URL YouTube Video atau Spotify Track/Playlist"
                  : "URL Tujuan"}{" "}
                <span className="text-red-400">*</span>
              </label>
              <Input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder={
                  selectedType === "media_embed"
                    ? "https://www.youtube.com/watch?v=... atau https://open.spotify.com/track/..."
                    : "https://example.com"
                }
                required
                className="border-white/10 bg-neutral-900/60 text-white placeholder:text-neutral-600 text-sm"
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

          {/* Subtitle & Badge for Bento Card */}
          {selectedType === "bento_card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-neutral-300 mb-1">
                  Subtitle / Deskripsi Singkat
                </label>
                <Input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="misal: 10+ Proyek Web Modern"
                  className="border-white/10 bg-neutral-900/60 text-white placeholder:text-neutral-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-300 mb-1">
                  Badge Label (Opsional)
                </label>
                <Input
                  type="text"
                  value={newBadgeText}
                  onChange={(e) => setNewBadgeText(e.target.value)}
                  placeholder="misal: POPULAR / BARU"
                  className="border-white/10 bg-neutral-900/60 text-white placeholder:text-neutral-600 text-sm"
                />
              </div>
            </div>
          )}

          {/* Bento Grid Dimensions Picker (colSpan & rowSpan) */}
          {(selectedType === "bento_card" || selectedType === "media_embed") && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Ukuran Grid Kartu Bento:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewColSpan(1);
                    setNewRowSpan(1);
                  }}
                  className={`p-2 rounded-xl border text-center transition ${
                    newColSpan === 1 && newRowSpan === 1
                      ? "bg-indigo-600/20 border-indigo-500 text-white"
                      : "bg-white/[0.03] border-white/5 text-neutral-400 hover:text-white"
                  }`}
                >
                  <div className="text-xs font-semibold">1x1 Kotak</div>
                  <div className="text-[10px] text-neutral-500">Kompak 1 Kolom</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewColSpan(2);
                    setNewRowSpan(1);
                  }}
                  className={`p-2 rounded-xl border text-center transition ${
                    newColSpan === 2 && newRowSpan === 1
                      ? "bg-indigo-600/20 border-indigo-500 text-white"
                      : "bg-white/[0.03] border-white/5 text-neutral-400 hover:text-white"
                  }`}
                >
                  <div className="text-xs font-semibold">2x1 Lebar</div>
                  <div className="text-[10px] text-neutral-500">Rentang 2 Kolom</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewColSpan(2);
                    setNewRowSpan(2);
                  }}
                  className={`p-2 rounded-xl border text-center transition ${
                    newColSpan === 2 && newRowSpan === 2
                      ? "bg-indigo-600/20 border-indigo-500 text-white"
                      : "bg-white/[0.03] border-white/5 text-neutral-400 hover:text-white"
                  }`}
                >
                  <div className="text-xs font-semibold">2x2 Besar</div>
                  <div className="text-[10px] text-neutral-500">Sorotan Utama</div>
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetForm}
              className="border-white/10 text-neutral-300 hover:text-white rounded-xl h-9 text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-9 text-xs font-medium px-4"
            >
              {isPending ? "Menyimpan..." : "Simpan Blok"}
            </Button>
          </div>
        </form>
      )}

      {/* Blocks List */}
      <div className="space-y-2.5">
        {blocks.length === 0 ? (
          <div className="py-8 text-center rounded-xl border border-dashed border-white/10 text-neutral-500 text-sm">
            Belum ada blok konten. Klik tombol &ldquo;Tambah Blok&rdquo; di atas untuk memulai.
          </div>
        ) : (
          blocks.map((block, index) => {
            const badge = getTypeBadge(block);
            const config = (block.config ?? {}) as PageBlockConfig;

            return (
              <div
                key={block.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all min-w-0 ${
                  block.isActive
                    ? "bg-neutral-950/60 border-white/10 hover:border-white/20"
                    : "bg-neutral-950/30 border-white/5 opacity-60"
                }`}
              >
                {editingId === block.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1">
                        Judul
                      </label>
                      <Input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="border-white/10 bg-neutral-900/80 text-white text-sm"
                      />
                    </div>
                    {block.type !== "header_text" && (
                      <div>
                        <label className="block text-xs text-neutral-400 mb-1">
                          URL
                        </label>
                        <Input
                          type="url"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          className="border-white/10 bg-neutral-900/80 text-white text-sm"
                        />
                      </div>
                    )}
                    {block.type === "bento_card" && (
                      <>
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">
                            Subtitle
                          </label>
                          <Input
                            type="text"
                            value={editSubtitle}
                            onChange={(e) => setEditSubtitle(e.target.value)}
                            className="border-white/10 bg-neutral-900/80 text-white text-sm"
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <label className="text-xs text-neutral-400">Ukuran Kolom:</label>
                          <button
                            type="button"
                            onClick={() => setEditColSpan(1)}
                            className={`px-2 py-1 rounded text-xs border ${
                              editColSpan === 1
                                ? "bg-indigo-600 text-white border-indigo-500"
                                : "bg-neutral-900 text-neutral-400 border-white/10"
                            }`}
                          >
                            1x Kolom
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditColSpan(2)}
                            className={`px-2 py-1 rounded text-xs border ${
                              editColSpan === 2
                                ? "bg-indigo-600 text-white border-indigo-500"
                                : "bg-neutral-900 text-neutral-400 border-white/10"
                            }`}
                          >
                            2x Kolom (Lebar)
                          </button>
                        </div>
                      </>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        className="border-white/10 text-neutral-300 text-xs h-8 rounded-lg"
                      >
                        Batal
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleSaveEdit(block)}
                        disabled={isPending}
                        className="bg-indigo-600 text-white text-xs h-8 rounded-lg px-3"
                      >
                        Simpan
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    {/* Left: Reorder Controls + Info */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          disabled={index === 0 || isPending}
                          onClick={() => handleMove(index, "up")}
                          aria-label="Geser ke atas"
                          className="text-neutral-500 hover:text-white disabled:opacity-20 transition"
                        >
                          <RuneIcon name="glass-arrow-up" type="glass" size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={index === blocks.length - 1 || isPending}
                          onClick={() => handleMove(index, "down")}
                          aria-label="Geser ke bawah"
                          className="text-neutral-500 hover:text-white disabled:opacity-20 transition"
                        >
                          <RuneIcon name="glass-arrow-down" type="glass" size={14} />
                        </button>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm text-white truncate">
                            {block.title}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                          {!block.isActive && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                              Nonaktif
                            </span>
                          )}
                        </div>

                        {config.subtitle && (
                          <p className="text-xs text-neutral-400 truncate mt-0.5">
                            {config.subtitle}
                          </p>
                        )}

                        {block.url && block.url !== "#" && (
                          <p className="text-xs text-neutral-500 truncate mt-0.5 font-mono">
                            {block.url}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Active Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(block)}
                        title={block.isActive ? "Nonaktifkan blok" : "Aktifkan blok"}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          block.isActive ? "bg-indigo-600" : "bg-neutral-800"
                        }`}
                      >
                        <span
                          className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                            block.isActive ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleStartEdit(block)}
                        title="Edit blok"
                        className="size-8 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] flex items-center justify-center text-neutral-400 hover:text-white transition"
                      >
                        <RuneIcon name="glass-edit-pen" type="glass" size={14} />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(block.id)}
                        title="Hapus blok"
                        className="size-8 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition"
                      >
                        <RuneIcon name="glass-trash" type="glass" size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
