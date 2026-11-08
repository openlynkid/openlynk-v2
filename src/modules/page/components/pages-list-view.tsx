"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Search,
  Palette,
  X,
} from "lucide-react";
import { RuneIcon } from "@/components/ui/rune-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import type { Page } from "@/db/schema";
import { createPage } from "../server/page-service";
import { getThemePreset } from "../types/themes";

interface PagesListViewProps {
  profileId: string;
  pages: Page[];
  baseUrl?: string;
}

export function PagesListView({
  profileId,
  pages,
  baseUrl = "https://openlynk.id",
}: PagesListViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isManualSlug, setIsManualSlug] = useState(false);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isManualSlug) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setIsManualSlug(true);
    setSlug(slugify(val));
  };

  const handleResetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setIsDefault(false);
    setIsManualSlug(false);
    setError(null);
    setIsCreating(false);
  };

  const handleCopyLink = async (pageSlug: string) => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : baseUrl;
    const url = `${origin}/${pageSlug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(pageSlug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError("Judul dan slug halaman wajib diisi.");
      return;
    }
    setError(null);

    startTransition(async () => {
      const res = await createPage(profileId, {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim() || undefined,
        isDefault,
      });

      if (!res.success) {
        setError(res.error);
      } else {
        handleResetForm();
        router.push(`/dashboard/pages/${res.data.id}`);
      }
    });
  };

  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return pages;
    const query = searchQuery.toLowerCase().trim();
    return pages.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }, [pages, searchQuery]);

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl rune-glass border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Halaman Micro-site Anda
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
              {pages.length} Halaman
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Kelola seluruh micro-site, tautan portofolio, dan bento showcase Anda dalam satu akun.
          </p>
        </div>

        {!isCreating && (
          <Button
            type="button"
            onClick={() => {
              setIsCreating(true);
              setError(null);
            }}
            className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl px-4 text-xs h-10 min-h-[44px] flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-lg transition-transform active:scale-95"
          >
            <Plus size={16} />
            <span>Buat Halaman Baru</span>
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-center justify-between gap-2">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Create New Page Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="p-5 sm:p-6 rounded-2xl rune-glass border-indigo-500/30 shadow-2xl space-y-5 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <RuneIcon name="glass-chain-link-3-1" type="glass" size={18} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Buat Halaman Micro-site Baru</h2>
                <p className="text-[11px] text-neutral-400">Lengkapi nama dan tautan slug untuk halaman Anda</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleResetForm}
              className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
              aria-label="Tutup form"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">
                Judul Halaman <span className="text-red-400">*</span>
              </Label>
              <Input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="misal: Portofolio Desain, Kelas Next.js"
                required
                className="bg-neutral-950/60 border-white/10 text-white placeholder:text-neutral-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-300">
                Slug URL Publik <span className="text-red-400">*</span>
              </Label>
              <div className="flex items-center rounded-xl border border-white/10 bg-neutral-950/60 focus-within:border-indigo-500/80 transition overflow-hidden min-w-0 w-full">
                <span className="px-3 py-2 text-xs text-neutral-500 bg-white/[0.02] border-r border-white/5 font-mono shrink-0 select-none">
                  openlynk.id/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="slug-halaman"
                  required
                  minLength={3}
                  maxLength={30}
                  className="w-full min-w-0 bg-transparent px-3 py-2 text-sm text-white outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-300">
              Deskripsi Halaman <span className="text-neutral-500 font-normal">(Opsional)</span>
            </Label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tulis ringkasan singkat isi halaman..."
              className="bg-neutral-950/60 border-white/10 text-white placeholder:text-neutral-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/5">
            <div className="flex items-center gap-2.5">
              <Switch
                id="create-page-is-default"
                checked={isDefault}
                onCheckedChange={setIsDefault}
              />
              <Label
                htmlFor="create-page-is-default"
                className="text-xs text-neutral-300 cursor-pointer"
              >
                Jadikan sebagai halaman utama akun
              </Label>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleResetForm}
                className="border-white/10 text-neutral-300 text-xs h-9 rounded-xl hover:bg-white/5"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9 rounded-xl px-4 font-medium shadow-md shadow-indigo-600/20"
              >
                {isPending ? "Membuat..." : "Simpan & Buka Studio →"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Filter / Search Bar (if pages > 2) */}
      {pages.length > 2 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan judul, slug, atau deskripsi halaman..."
            className="pl-10 bg-neutral-900/40 border-white/10 text-white text-xs placeholder:text-neutral-500 h-10 rounded-xl"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {pages.length === 0 ? (
        <div className="p-10 rounded-2xl rune-glass border-white/10 text-center flex flex-col items-center justify-center space-y-4">
          <div className="size-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
            <RuneIcon name="glass-chain-link-3-1" type="glass" size={36} />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h2 className="text-base sm:text-lg font-bold text-white">
              Belum Ada Halaman Micro-site
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Mulai publikasikan karya, link tautan, dan portofolio Anda dengan membuat halaman pertama sekarang.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setIsCreating(true)}
            className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl px-5 text-xs h-10 flex items-center gap-1.5 shadow-lg mt-2"
          >
            <Plus size={16} />
            <span>Buat Halaman Pertama</span>
          </Button>
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="p-8 rounded-2xl rune-glass border-white/10 text-center space-y-2">
          <p className="text-sm text-neutral-300 font-medium">Tidak ada halaman yang cocok</p>
          <p className="text-xs text-neutral-500">
            Coba gunakan kata kunci pencarian yang berbeda.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchQuery("")}
            className="mt-3 text-xs border-white/10 text-neutral-300 rounded-xl"
          >
            Reset Pencarian
          </Button>
        </div>
      ) : (
        /* Pages Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredPages.map((p) => {
            const themeConfig = p.themeConfig as { themePreset?: string; accentColor?: string };
            const theme = getThemePreset(themeConfig?.themePreset);
            const isCopied = copiedSlug === p.slug;

            return (
              <div
                key={p.id}
                className="group rounded-2xl rune-glass rune-glass-hover border-white/10 overflow-hidden flex flex-col justify-between transition-all duration-200 min-w-0"
              >
                {/* Visual Theme Top Strip Mockup */}
                <div
                  className={`h-12 w-full bg-gradient-to-r ${theme.swatchGradient} opacity-25 group-hover:opacity-45 transition-opacity px-4 flex items-center justify-between border-b border-white/5`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-white/70" />
                    <span className="text-[10px] font-mono text-white/70 tracking-wider uppercase">
                      {theme.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {p.isDefault && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border-emerald-500/30 text-emerald-300 font-semibold backdrop-blur-md"
                      >
                        Utama
                      </Badge>
                    )}
                    {!p.isPublished && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900/80 text-neutral-400 border-white/5 backdrop-blur-md"
                      >
                        Draft
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 truncate">
                        openlynk.id/{p.slug}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyLink(p.slug)}
                        className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition"
                        title="Salin tautan halaman"
                      >
                        {isCopied ? (
                          <Check size={13} className="text-emerald-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>

                    <div className="text-[11px] text-neutral-500 flex items-center gap-1 shrink-0">
                      <Palette size={12} />
                      <span className="capitalize">{theme.id}</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight truncate group-hover:text-indigo-200 transition-colors">
                      {p.title}
                    </h2>
                    {p.description ? (
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    ) : (
                      <p className="text-xs text-neutral-500 italic mt-1">
                        Belum ada deskripsi halaman
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-white/[0.02] border-t border-white/5 gap-2">
                  <Link
                    href={`/${p.slug}`}
                    target="_blank"
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors font-medium"
                  >
                    <span>Lihat Live</span>
                    <ExternalLink size={12} />
                  </Link>

                  <Link href={`/dashboard/pages/${p.id}`}>
                    <Button
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs h-8 px-3.5 font-medium border border-white/10 flex items-center gap-1.5 transition-all group-hover:border-indigo-500/40"
                    >
                      <span>Buka Studio</span>
                      <ArrowRight size={13} />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
