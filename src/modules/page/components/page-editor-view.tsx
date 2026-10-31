"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RuneIcon } from "runeicons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Page, PageBlock, Profile } from "@/db/schema";
import { updatePage, deletePage } from "../server/page-service";
import { PageLinksManager } from "./page-links-manager";
import { PublicPageView } from "./public-page-view";
import { ThemeSelector } from "./theme-selector";
import { PageShareModal } from "./page-share-modal";

interface PageEditorViewProps {
  profileId: string;
  page: Page;
  profile: Profile;
  blocks: PageBlock[];
}

export function PageEditorView({
  profileId,
  page,
  profile,
  blocks,
}: PageEditorViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [description, setDescription] = useState(page.description ?? "");
  const [avatarUrl, setAvatarUrl] = useState(page.avatarUrl ?? "");
  const [themePreset, setThemePreset] = useState(
    page.themeConfig?.themePreset || "obsidian"
  );
  const [accentColor, setAccentColor] = useState(
    page.themeConfig?.accentColor || "#6366f1"
  );
  const [isDefault, setIsDefault] = useState(page.isDefault);
  const [isPublished, setIsPublished] = useState(page.isPublished);
  const [currentBlocks, setCurrentBlocks] = useState<PageBlock[]>(blocks);

  const activeBlocks = currentBlocks.filter((b) => b.isActive);

  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${slug}`
      : `https://openlynk.id/${slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await updatePage(profileId, page.id, {
        title,
        slug,
        description: description ? description.trim() : undefined,
        avatarUrl: avatarUrl ? avatarUrl.trim() : undefined,
        themeConfig: {
          themePreset,
          accentColor,
        },
        isDefault,
        isPublished,
      });

      if (!res.success) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage("Pengaturan halaman berhasil diperbarui!");
        router.refresh();
      }
    });
  };

  const handleDeletePage = () => {
    if (
      !confirm(
        `Apakah Anda yakin ingin menghapus halaman "${page.title}" (/${page.slug})? Semua tautan di halaman ini akan dihapus permanen.`
      )
    )
      return;

    startTransition(async () => {
      const res = await deletePage(profileId, page.id);
      if (!res.success) {
        setErrorMessage(res.error);
      } else {
        router.push("/dashboard/pages");
      }
    });
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/dashboard/pages"
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition"
            >
              <span>← Semua Halaman</span>
            </Link>
            <span className="text-neutral-600">/</span>
            <span className="text-xs font-mono text-neutral-300">
              openlynk.id/{slug}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 mt-1 flex-wrap">
            <span>{title}</span>
            {isDefault && (
              <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Halaman Utama
              </span>
            )}
            {!isPublished && (
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                Draft (Nonaktif)
              </span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {/* Quick Copy Link Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyLink}
            className={`rounded-xl text-xs h-10 min-h-[44px] px-3.5 transition ${
              copied
                ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                : "border-white/10 text-neutral-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <RuneIcon name="glass-chain-link-3-1" type="glass" size={16} />
            <span>{copied ? "Tersalin! ✓" : "Salin Link"}</span>
          </Button>

          {/* QR Code / Share Modal Trigger */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsShareOpen(true)}
            className="border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl text-xs h-10 min-h-[44px] px-3.5"
          >
            <RuneIcon name="glass-sparkle" type="glass" size={16} />
            <span>QR &amp; Bagikan</span>
          </Button>

          {/* Live Link */}
          <Link
            href={`/${slug}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs sm:text-sm font-semibold text-white transition min-h-[44px]"
          >
            <span>Lihat Live</span>
            <RuneIcon name="glass-arrow-right-circle" type="glass" size={14} />
          </Link>

          {!isDefault && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDeletePage}
              disabled={isPending}
              className="border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl text-xs h-10 min-h-[44px]"
            >
              Hapus
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Editor & Right Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form & Blocks */}
        <div className="lg:col-span-7 space-y-6 min-w-0">
          {/* Page Settings Form */}
          <form
            onSubmit={handleSavePage}
            className="p-5 sm:p-6 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-5"
          >
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                <RuneIcon name="glass-edit-pen" type="glass" size={18} />
                <span>Pengaturan Halaman</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                Ubah judul, URL slug, bio khusus, dan pilihan tema halaman ini.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                {successMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Judul Halaman <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={80}
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
                    required
                    minLength={3}
                    maxLength={30}
                    className="w-full min-w-0 bg-transparent px-3 py-2 text-sm text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Deskripsi / Bio Khusus Halaman Ini
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                  rows={2}
                  placeholder="Kosongkan jika ingin menggunakan bio profil akun Anda..."
                  className="w-full rounded-xl border border-white/10 bg-neutral-950/60 p-3 text-xs sm:text-sm text-white placeholder:text-neutral-600 outline-none focus:border-indigo-500/80 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Foto Avatar Halaman (Opsional)
                </label>
                <Input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Kosongkan jika ingin menggunakan avatar akun Anda"
                  className="border-white/10 bg-neutral-950/60 text-white placeholder:text-neutral-600"
                />
              </div>

              {/* Theme Customizer */}
              <div className="pt-3 border-t border-white/5">
                <ThemeSelector
                  selectedPresetId={themePreset}
                  onSelectPreset={(presetId, accent) => {
                    setThemePreset(presetId);
                    setAccentColor(accent);
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="size-4 rounded border-white/20 bg-neutral-900 text-indigo-600 focus:ring-0"
                    />
                    <span className="text-xs text-neutral-300">
                      Publikasikan
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="size-4 rounded border-white/20 bg-neutral-900 text-indigo-600 focus:ring-0"
                    />
                    <span className="text-xs text-neutral-300">
                      Jadikan Halaman Utama
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-9 px-4 font-medium"
                >
                  {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
                </Button>
              </div>
            </div>
          </form>

          {/* Links / Blocks Manager */}
          <PageLinksManager
            profileId={profileId}
            pageId={page.id}
            blocks={currentBlocks}
            onBlocksChange={setCurrentBlocks}
          />
        </div>

        {/* Right Column: Smartphone Mockup Preview */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24">
          <div className="text-center mb-2 flex items-center justify-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Live Preview: openlynk.id/{slug}
            </span>
          </div>

          <div className="mx-auto w-[340px] h-[660px] rounded-[42px] border-4 border-neutral-800 bg-neutral-950 p-3 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-800 rounded-full z-20 pointer-events-none" />

            <div className="w-full h-full rounded-[32px] overflow-y-auto no-scrollbar relative">
              <PublicPageView
                data={{
                  ...page,
                  title,
                  slug,
                  description,
                  avatarUrl: avatarUrl ? avatarUrl : null,
                  themeConfig: {
                    themePreset,
                    accentColor,
                  },
                  profile,
                  blocks: activeBlocks,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <PageShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={pageUrl}
        title={title}
      />
    </div>
  );
}
