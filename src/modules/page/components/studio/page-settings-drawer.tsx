"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Page } from "@/db/schema";
import { ThemeSelector } from "../theme-selector";

interface PageSettingsDrawerProps {
  page: Page;
  isOpen: boolean;
  initialTab?: "general" | "themes";
  onClose: () => void;
  onSavePage: (updates: {
    title: string;
    slug: string;
    description?: string;
    avatarUrl?: string;
    themeConfig: {
      themePreset: string;
      accentColor: string;
    };
    isDefault?: boolean;
    isPublished?: boolean;
  }) => void;
  onDeletePage: () => void;
  onPreviewTheme?: (presetId: string, accentColor: string) => void;
  isSaving: boolean;
}

interface PageSettingsContentProps {
  page: Page;
  initialTab: "general" | "themes";
  onClose: () => void;
  onSavePage: (updates: {
    title: string;
    slug: string;
    description?: string;
    avatarUrl?: string;
    themeConfig: {
      themePreset: string;
      accentColor: string;
    };
    isDefault?: boolean;
    isPublished?: boolean;
  }) => void;
  onDeletePage: () => void;
  onPreviewTheme?: (presetId: string, accentColor: string) => void;
  isSaving: boolean;
}

function PageSettingsContent({
  page,
  initialTab,
  onClose,
  onSavePage,
  onDeletePage,
  onPreviewTheme,
  isSaving,
}: PageSettingsContentProps) {
  const initialPresetRef = useRef(page.themeConfig?.themePreset || "obsidian");
  const initialAccentRef = useRef(page.themeConfig?.accentColor || "#6366f1");
  const isSavedRef = useRef(false);

  const handleCancel = useCallback(() => {
    if (!isSavedRef.current) {
      onPreviewTheme?.(initialPresetRef.current, initialAccentRef.current);
    }
    onClose();
  }, [onClose, onPreviewTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCancel]);

  const [tab, setTab] = useState<"general" | "themes">(initialTab);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    isSavedRef.current = true;
    onSavePage({
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim() || undefined,
      avatarUrl: avatarUrl.trim() || undefined,
      themeConfig: {
        themePreset,
        accentColor,
      },
      isDefault,
      isPublished,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCancel();
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
                <Sparkles size={16} />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Pengaturan Halaman &amp; Tema
              </h3>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="size-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Segmented Tabs */}
          <Tabs
            value={tab}
            onValueChange={(val) => setTab(val as "general" | "themes")}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2 h-9 p-1 rounded-xl bg-neutral-950/80 border border-white/10">
              <TabsTrigger value="general" className="text-xs font-semibold rounded-lg">
                ⚙️ Pengaturan Umum
              </TabsTrigger>
              <TabsTrigger value="themes" className="text-xs font-semibold rounded-lg">
                🎨 Pilihan Tema
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Tab 1: General Settings */}
          {tab === "general" && (
            <form id="page-settings-form" onSubmit={handleSubmit} className="space-y-4">
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
                  className="border-white/10 bg-neutral-950/60 text-white text-sm"
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
                  Bio / Deskripsi Khusus Halaman
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                  rows={3}
                  placeholder="Kosongkan jika ingin menggunakan bio profil akun Anda..."
                  className="w-full rounded-xl border border-white/10 bg-neutral-950/60 p-3 text-xs sm:text-sm text-white placeholder:text-neutral-600 outline-none focus-visible:border-indigo-500/80 transition resize-none"
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
                  placeholder="URL gambar (fallback ke foto profil)"
                  className="border-white/10 bg-neutral-950/60 text-white text-sm placeholder:text-neutral-600"
                />
              </div>

              <div className="pt-2 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-neutral-200">
                      Publikasikan Halaman Ini
                    </span>
                    <p className="text-[11px] text-neutral-500">
                      Izinkan pengunjung mengakses halaman ini secara publik
                    </p>
                  </div>
                  <Switch
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                    aria-label="Publikasikan halaman"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div>
                    <span className="text-xs font-medium text-neutral-200">
                      Halaman Utama Akun
                    </span>
                    <p className="text-[11px] text-neutral-500">
                      Jadikan halaman default saat pengunjung membuka profil utama Anda
                    </p>
                  </div>
                  <Switch
                    checked={isDefault}
                    onCheckedChange={setIsDefault}
                    aria-label="Jadikan halaman utama"
                  />
                </div>
              </div>
            </form>
          )}

          {/* Tab 2: Theme Selector */}
          {tab === "themes" && (
            <div className="space-y-4">
              <ThemeSelector
                selectedPresetId={themePreset}
                onSelectPreset={(presetId, accent) => {
                  setThemePreset(presetId);
                  setAccentColor(accent);
                  onPreviewTheme?.(presetId, accent);
                }}
              />
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          {!page.isDefault ? (
            <Button
              type="button"
              variant="outline"
              onClick={onDeletePage}
              className="border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs h-10 rounded-xl"
            >
              Hapus Halaman
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-white/10 text-neutral-300 text-xs h-10 rounded-xl px-4"
            >
              Batal
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-10 px-5 rounded-xl font-medium shadow-lg"
            >
              {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageSettingsDrawer({
  page,
  isOpen,
  initialTab = "general",
  onClose,
  onSavePage,
  onDeletePage,
  onPreviewTheme,
  isSaving,
}: PageSettingsDrawerProps) {
  if (!isOpen) return null;

  return (
    <PageSettingsContent
      key={`${page.id}-${initialTab}-${page.updatedAt}`}
      page={page}
      initialTab={initialTab}
      onClose={onClose}
      onSavePage={onSavePage}
      onDeletePage={onDeletePage}
      onPreviewTheme={onPreviewTheme}
      isSaving={isSaving}
    />
  );
}
