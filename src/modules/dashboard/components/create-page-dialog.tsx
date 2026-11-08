"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, Loader2, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createPage } from "@/modules/page";

interface CreatePageDialogProps {
  profileId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePageDialog({
  profileId,
  isOpen,
  onClose,
}: CreatePageDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isManualSlug, setIsManualSlug] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleReset = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setIsDefault(false);
    setIsManualSlug(false);
    setError(null);
  };

  const handleClose = () => {
    if (!isPending) {
      handleReset();
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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
        handleReset();
        onClose();
        router.push(`/dashboard/pages/${res.data.id}`);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="rune-glass bg-neutral-950/95 border border-white/10 text-white max-w-md p-6 rounded-2xl shadow-2xl backdrop-blur-2xl">
        <DialogHeader className="text-left pb-2">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles size={20} />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white tracking-tight">
                Buat Micro-site Baru
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-400">
                Luncurkan halaman bento baru untuk event, portofolio, atau produk Anda.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1.5">
            <Label htmlFor="page-title" className="text-xs font-medium text-neutral-300">
              Judul Halaman <span className="text-red-400">*</span>
            </Label>
            <Input
              id="page-title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="cth: Portofolio Musik, Kelas Desain..."
              className="bg-black/40 border-white/10 text-white placeholder:text-neutral-600 rounded-xl text-xs h-10"
              required
              autoFocus
            />
          </div>

          {/* Slug Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="page-slug" className="text-xs font-medium text-neutral-300">
                Slug URL Halaman <span className="text-red-400">*</span>
              </Label>
              <span className="text-[11px] text-neutral-500">
                Alamat URL unik
              </span>
            </div>

            <div className="flex items-center rounded-xl bg-black/40 border border-white/10 px-3 h-10 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition">
              <Globe size={14} className="text-neutral-500 mr-1.5 shrink-0" />
              <span className="text-xs text-neutral-500 font-mono shrink-0">
                openlynk.id/
              </span>
              <input
                id="page-slug"
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="slug-kustom"
                className="w-full bg-transparent border-0 text-white font-mono text-xs focus:outline-none pl-1"
                required
              />
            </div>
            <p className="text-[11px] text-neutral-500">
              Hanya huruf kecil, angka, dan tanda hubung (-).
            </p>
          </div>

          {/* Description Input */}
          <div className="space-y-1.5">
            <Label htmlFor="page-desc" className="text-xs font-medium text-neutral-300">
              Deskripsi Singkat (Opsional)
            </Label>
            <Input
              id="page-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Koleksi karya terbaik dan link tautan aktif..."
              className="bg-black/40 border-white/10 text-white placeholder:text-neutral-600 rounded-xl text-xs h-10"
            />
          </div>

          {/* Set as Default Page Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-white block">
                Jadikan Halaman Utama (Default)
              </span>
              <span className="text-[11px] text-neutral-400 block">
                Tampilkan halaman ini saat membuka URL utama profil Anda.
              </span>
            </div>
            <Switch
              checked={isDefault}
              onCheckedChange={setIsDefault}
            />
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl text-xs h-10"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending || !title.trim() || !slug.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs h-10 px-5 gap-1.5 shadow-lg shadow-indigo-600/20"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Membuat...</span>
                </>
              ) : (
                <>
                  <Plus size={15} />
                  <span>Buat &amp; Buka Studio →</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
