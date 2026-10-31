"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RuneIcon } from "runeicons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Page } from "@/db/schema";
import { createPage } from "../server/page-service";

interface PagesListViewProps {
  profileId: string;
  pages: Page[];
}

export function PagesListView({ profileId, pages }: PagesListViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;
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
        setIsCreating(false);
        setTitle("");
        setSlug("");
        setDescription("");
        setIsDefault(false);
        router.push(`/dashboard/pages/${res.data.id}`);
      }
    });
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl min-w-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 flex-wrap">
            <span>Halaman Micro-site Anda</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              {pages.length} Halaman
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Setiap akun dapat memiliki banyak halaman (cth: halaman personal, landing page portofolio, event, dll).
          </p>
        </div>

        {!isCreating && (
          <Button
            type="button"
            onClick={() => setIsCreating(true)}
            className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl px-4 text-xs h-10 min-h-[44px] flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-lg"
          >
            <RuneIcon name="glass-plus" type="glass" size={16} />
            <span>Buat Halaman Baru</span>
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Create New Page Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="p-5 sm:p-6 rounded-2xl bg-neutral-900/80 border border-indigo-500/30 backdrop-blur-xl shadow-xl space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
              <RuneIcon name="glass-chain-link-3-1" type="glass" size={18} />
              <span>Buat Halaman Baru</span>
            </h2>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-neutral-500 hover:text-neutral-300 text-xs"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Judul Halaman <span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="misal: Portofolio Desain, Kelas Next.js"
                required
                className="border-white/10 bg-neutral-950/60 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Slug URL Publik <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center rounded-xl border border-white/10 bg-neutral-950/60 focus-within:border-indigo-500/80 transition overflow-hidden min-w-0 w-full">
                <span className="px-3 py-2 text-xs text-neutral-500 bg-white/[0.02] border-r border-white/5 font-mono shrink-0">
                  openlynk.id/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().trim())}
                  placeholder="slug-halaman"
                  required
                  minLength={3}
                  maxLength={30}
                  className="w-full min-w-0 bg-transparent px-3 py-2 text-sm text-white outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Deskripsi Halaman (Opsional)
            </label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tulis ringkasan singkat isi halaman..."
              className="border-white/10 bg-neutral-950/60 text-white"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="size-4 rounded border-white/20 bg-neutral-900 text-indigo-600 focus:ring-0"
              />
              <span className="text-xs text-neutral-300">
                Jadikan sebagai halaman utama akun
              </span>
            </label>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreating(false)}
                className="border-white/10 text-neutral-300 text-xs h-9 rounded-xl"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9 rounded-xl px-4 font-medium"
              >
                {isPending ? "Membuat..." : "Simpan & Lanjut ke Editor"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {pages.map((p) => (
          <div
            key={p.id}
            className="p-5 sm:p-6 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900/80 border border-white/10 hover:border-white/20 backdrop-blur-xl transition-all shadow-lg flex flex-col justify-between min-w-0 space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 truncate">
                  openlynk.id/{p.slug}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {p.isDefault && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
                      Utama
                    </span>
                  )}
                  {!p.isPublished && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                      Draft
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-lg font-bold text-white tracking-tight truncate">
                {p.title}
              </h2>
              {p.description && (
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                  {p.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2">
              <Link
                href={`/${p.slug}`}
                target="_blank"
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition"
              >
                <span>Lihat Live</span>
                <RuneIcon name="glass-arrow-right-circle" type="glass" size={12} />
              </Link>

              <Link href={`/dashboard/pages/${p.id}`}>
                <Button className="bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs h-9 px-4 font-medium border border-white/10">
                  Edit Blok &amp; Tampilan →
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
