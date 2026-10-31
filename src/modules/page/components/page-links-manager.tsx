"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RuneIcon } from "runeicons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PageBlock } from "@/db/schema";
import {
  createPageBlock,
  updatePageBlock,
  deletePageBlock,
  reorderPageBlocks,
} from "../server/page-service";

interface PageLinksManagerProps {
  profileId: string;
  pageId: string;
  initialBlocks: PageBlock[];
}

export function PageLinksManager({
  profileId,
  pageId,
  initialBlocks,
}: PageLinksManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [blocks, setBlocks] = useState<PageBlock[]>(initialBlocks);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    setError(null);

    startTransition(async () => {
      const res = await createPageBlock(profileId, pageId, {
        title: newTitle.trim(),
        url: newUrl.trim(),
      });

      if (!res.success) {
        setError(res.error);
      } else {
        setBlocks((prev) => [...prev, res.data]);
        setNewTitle("");
        setNewUrl("");
        setIsAdding(false);
        router.refresh();
      }
    });
  };

  const handleToggleActive = (block: PageBlock) => {
    setError(null);
    const updatedStatus = !block.isActive;

    setBlocks((prev) =>
      prev.map((b) => (b.id === block.id ? { ...b, isActive: updatedStatus } : b))
    );

    startTransition(async () => {
      const res = await updatePageBlock(profileId, pageId, block.id, {
        isActive: updatedStatus,
      });
      if (!res.success) {
        setError(res.error);
        setBlocks((prev) =>
          prev.map((b) => (b.id === block.id ? { ...b, isActive: block.isActive } : b))
        );
      } else {
        router.refresh();
      }
    });
  };

  const handleDelete = (blockId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tautan ini?")) return;
    setError(null);

    const previousBlocks = [...blocks];
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));

    startTransition(async () => {
      const res = await deletePageBlock(profileId, pageId, blockId);
      if (!res.success) {
        setError(res.error);
        setBlocks(previousBlocks);
      } else {
        router.refresh();
      }
    });
  };

  const handleStartEdit = (block: PageBlock) => {
    setEditingId(block.id);
    setEditTitle(block.title);
    setEditUrl(block.url);
  };

  const handleSaveEdit = (blockId: string) => {
    if (!editTitle.trim() || !editUrl.trim()) return;
    setError(null);

    startTransition(async () => {
      const res = await updatePageBlock(profileId, pageId, blockId, {
        title: editTitle.trim(),
        url: editUrl.trim(),
      });

      if (!res.success) {
        setError(res.error);
      } else {
        setBlocks((prev) =>
          prev.map((b) => (b.id === blockId ? { ...b, title: editTitle, url: editUrl } : b))
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

    setBlocks(newBlocks);

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

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-5 w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">
            Daftar Tautan di Halaman Ini
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Tautan yang akan tampil pada URL halaman ini.
          </p>
        </div>

        {!isAdding && (
          <Button
            type="button"
            onClick={() => setIsAdding(true)}
            className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl px-4 text-xs h-9 min-h-[44px] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RuneIcon name="glass-plus" type="glass" size={16} />
            <span>Tambah Tautan</span>
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Add New Link Card */}
      {isAdding && (
        <form
          onSubmit={handleAddLink}
          className="p-4 rounded-xl bg-neutral-950/80 border border-indigo-500/40 space-y-3.5 transition animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300">
              Tambah Tautan Baru
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-neutral-500 hover:text-neutral-300 text-xs"
            >
              Batal
            </button>
          </div>

          <div>
            <label className="block text-xs text-neutral-300 mb-1">
              Judul Tautan <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="misal: Ikuti Channel YouTube Saya"
              required
              className="border-white/10 bg-neutral-900/60 text-white placeholder:text-neutral-600"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-300 mb-1">
              URL Tujuan <span className="text-red-400">*</span>
            </label>
            <Input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://youtube.com/@channel"
              required
              className="border-white/10 bg-neutral-900/60 text-white placeholder:text-neutral-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAdding(false)}
              className="border-white/10 text-neutral-300 hover:text-white rounded-xl h-9 text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-9 text-xs font-medium px-4"
            >
              {isPending ? "Menyimpan..." : "Simpan Tautan"}
            </Button>
          </div>
        </form>
      )}

      {/* Links List */}
      <div className="space-y-2.5">
        {blocks.length === 0 ? (
          <div className="py-8 text-center rounded-xl border border-dashed border-white/10 text-neutral-500 text-sm">
            Belum ada tautan. Klik tombol &ldquo;Tambah Tautan&rdquo; di atas untuk memulai.
          </div>
        ) : (
          blocks.map((block, index) => (
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
                      onClick={() => handleSaveEdit(block.id)}
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
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-white truncate">
                          {block.title}
                        </span>
                        {!block.isActive && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">
                            Nonaktif
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 truncate mt-0.5 font-mono">
                        {block.url}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Active Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(block)}
                      title={block.isActive ? "Nonaktifkan tautan" : "Aktifkan tautan"}
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
                      title="Edit tautan"
                      className="size-8 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] flex items-center justify-center text-neutral-400 hover:text-white transition"
                    >
                      <RuneIcon name="glass-edit-pen" type="glass" size={14} />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(block.id)}
                      title="Hapus tautan"
                      className="size-8 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition"
                    >
                      <RuneIcon name="glass-trash" type="glass" size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
