"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Link as LinkIcon,
  Share2,
  FileText,
  Image as ImageIcon,
  MapPin,
  Code2,
  PlaySquare,
  Heading,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PageBlockType, PageBlockConfig } from "../../types";
import { detectMediaEmbed } from "../../server/embed-helpers";
import { IconPicker } from "../icon-picker";

type TemplateId =
  | "bento_card"
  | "link"
  | "social_row"
  | "note"
  | "image"
  | "map"
  | "github"
  | "media_embed"
  | "header_text";

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

const TEMPLATES: Array<{
  id: TemplateId;
  label: string;
  desc: string;
  icon: typeof Sparkles;
  defaultCol: number;
  defaultRow: number;
}> = [
  {
    id: "bento_card",
    label: "Kartu Bento",
    desc: "Kotak visual glow",
    icon: Sparkles,
    defaultCol: 1,
    defaultRow: 1,
  },
  {
    id: "link",
    label: "Tautan",
    desc: "Pill link klasik",
    icon: LinkIcon,
    defaultCol: 2,
    defaultRow: 1,
  },
  {
    id: "social_row",
    label: "Ikon Sosial",
    desc: "Deretan platform sosial",
    icon: Share2,
    defaultCol: 2,
    defaultRow: 1,
  },
  {
    id: "note",
    label: "Catatan / Quote",
    desc: "Sticky note & kata mutiara",
    icon: FileText,
    defaultCol: 2,
    defaultRow: 1,
  },
  {
    id: "image",
    label: "Foto / Galeri",
    desc: "Visual banner showcase",
    icon: ImageIcon,
    defaultCol: 2,
    defaultRow: 2,
  },
  {
    id: "map",
    label: "Lokasi & Jam",
    desc: "Domisili & live clock",
    icon: MapPin,
    defaultCol: 1,
    defaultRow: 1,
  },
  {
    id: "github",
    label: "Proyek GitHub",
    desc: "Repo stars & bahasa",
    icon: Code2,
    defaultCol: 2,
    defaultRow: 1,
  },
  {
    id: "media_embed",
    label: "Media Player",
    desc: "YouTube / Spotify",
    icon: PlaySquare,
    defaultCol: 2,
    defaultRow: 2,
  },
  {
    id: "header_text",
    label: "Judul Seksi",
    desc: "Pemisah kategori teks",
    icon: Heading,
    defaultCol: 2,
    defaultRow: 1,
  },
];

export function BlockLibraryDrawer({
  isOpen,
  onClose,
  onAddBlock,
}: BlockLibraryDrawerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("bento_card");

  // Common Fields
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [iconName, setIconName] = useState("glass-sparkle");
  const [colSpan, setColSpan] = useState(1);
  const [rowSpan, setRowSpan] = useState(1);

  // Note Specific
  const [noteContent, setNoteContent] = useState("");

  // Image Specific
  const [imageUrl, setImageUrl] = useState("");

  // Map Specific
  const [locationName, setLocationName] = useState("");

  // GitHub Specific
  const [repoName, setRepoName] = useState("");
  const [repoLanguage, setRepoLanguage] = useState("TypeScript");
  const [repoStars, setRepoStars] = useState("128");

  // Social Row Specific
  const [instagram, setInstagram] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
  const [githubUrl, setGithubUrl] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  if (!isOpen) return null;

  const detectedMedia =
    selectedTemplate === "media_embed" && url ? detectMediaEmbed(url) : null;

  const handleSelectTemplate = (t: (typeof TEMPLATES)[number]) => {
    setSelectedTemplate(t.id);
    setColSpan(t.defaultCol);
    setRowSpan(t.defaultRow);

    // Provide default titles based on template
    if (t.id === "note") {
      setTitle("Catatan Hari Ini");
      setNoteContent("Fokus membangun produk terbaik yang bermanfaat bagi banyak orang.");
      setBadgeText("Memo");
    } else if (t.id === "social_row") {
      setTitle("Temukan Saya");
      setInstagram("https://instagram.com/");
      setGithubUrl("https://github.com/");
      setTwitter("https://x.com/");
    } else if (t.id === "map") {
      setTitle("Domisili");
      setLocationName("Jakarta, Indonesia");
      setBadgeText("WIB (UTC+7)");
    } else if (t.id === "github") {
      setTitle("OpenLynk");
      setRepoName("openlynk/openlynk");
      setSubtitle("Open-source modular bento bio-link platform built with Next.js 16.");
      setRepoLanguage("TypeScript");
      setRepoStars("256");
      setUrl("https://github.com/openlynk/openlynk");
    } else if (t.id === "image") {
      setTitle("Foto Estetik");
      setSubtitle("Dokumentasi perjalanan");
      setImageUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let targetType: PageBlockType = "bento_card";
    const config: PageBlockConfig = {};

    if (selectedTemplate === "link") {
      targetType = "link";
      if (subtitle.trim()) config.subtitle = subtitle.trim();
    } else if (selectedTemplate === "social_row") {
      targetType = "social_row";
      config.socialLinks = {
        instagram: instagram.trim(),
        github: githubUrl.trim(),
        twitter: twitter.trim(),
        youtube: youtube.trim(),
        tiktok: tiktok.trim(),
        whatsapp: whatsapp.trim(),
      };
    } else if (selectedTemplate === "header_text") {
      targetType = "header_text";
      if (subtitle.trim()) config.subtitle = subtitle.trim();
    } else if (selectedTemplate === "media_embed") {
      targetType = "media_embed";
      if (url) {
        const detected = detectMediaEmbed(url);
        if (detected?.platform === "youtube") {
          config.embedType = "youtube";
          config.embedId = detected.videoId;
        } else if (detected?.platform === "spotify") {
          config.embedType = "spotify";
        }
      }
    } else if (selectedTemplate === "note") {
      targetType = "bento_card";
      config.variant = "note";
      config.noteContent = noteContent.trim() || title.trim();
      config.badgeText = badgeText.trim() || "Memo";
    } else if (selectedTemplate === "image") {
      targetType = "bento_card";
      config.variant = "image";
      config.imageUrl = imageUrl.trim();
      if (subtitle.trim()) config.subtitle = subtitle.trim();
    } else if (selectedTemplate === "map") {
      targetType = "bento_card";
      config.variant = "map";
      config.locationName = locationName.trim() || title.trim();
      if (badgeText.trim()) config.badgeText = badgeText.trim();
      if (subtitle.trim()) config.subtitle = subtitle.trim();
    } else if (selectedTemplate === "github") {
      targetType = "bento_card";
      config.variant = "github";
      config.repoName = repoName.trim() || title.trim();
      config.repoLanguage = repoLanguage.trim();
      config.repoStars = parseInt(repoStars, 10) || 0;
      if (subtitle.trim()) config.subtitle = subtitle.trim();
    } else {
      // standard bento card
      targetType = "bento_card";
      config.variant = "standard";
      if (subtitle.trim()) config.subtitle = subtitle.trim();
      if (badgeText.trim()) config.badgeText = badgeText.trim();
    }

    const targetUrl =
      selectedTemplate === "header_text"
        ? "#"
        : selectedTemplate === "note" || selectedTemplate === "social_row"
        ? "#"
        : url.trim() || "#";

    onAddBlock({
      type: targetType,
      title: title.trim(),
      url: targetUrl,
      iconName: selectedTemplate === "header_text" ? undefined : iconName,
      colSpan: selectedTemplate === "header_text" ? 2 : colSpan,
      rowSpan: selectedTemplate === "header_text" ? 1 : rowSpan,
      config,
    });

    // Reset & close
    setTitle("");
    setUrl("");
    setSubtitle("");
    setBadgeText("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-xl bg-neutral-900/95 border border-white/15 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Pilih Blok Bento Baru
              </h3>
              <p className="text-xs text-neutral-400">
                Inspirasi dari OpenBio &amp; Bento untuk profil interaktif Anda.
              </p>
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

        {/* Template Selector Grid (9 Options) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
            Pilih Jenis Elemen
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {TEMPLATES.map((t) => {
              const IconComp = t.icon;
              const isSelected = selectedTemplate === t.id;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTemplate(t)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-2.5 cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600/30 border-indigo-500 text-white ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10"
                      : "bg-white/[0.03] border-white/5 text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-200"
                  }`}
                >
                  <div
                    className={`size-8 rounded-lg flex items-center justify-center transition ${
                      isSelected
                        ? "bg-indigo-500 text-white"
                        : "bg-white/5 text-neutral-300"
                    }`}
                  >
                    <IconComp size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold block leading-tight">
                      {t.label}
                    </span>
                    <span className="text-[10px] text-neutral-500 block line-clamp-1 mt-0.5">
                      {t.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Form based on selected template */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-3 border-t border-white/5">
          {/* Icon Picker (for Link and Bento Card) */}
          {(selectedTemplate === "bento_card" || selectedTemplate === "link") && (
            <IconPicker
              selectedIcon={iconName}
              onSelectIcon={(name) => setIconName(name)}
            />
          )}

          {/* Title Input */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              {selectedTemplate === "header_text"
                ? "Teks Judul Seksi"
                : selectedTemplate === "note"
                ? "Judul Catatan"
                : selectedTemplate === "map"
                ? "Label Lokasi"
                : "Judul Blok"}{" "}
              <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul..."
              required
              className="border-white/10 bg-neutral-950/60 text-white text-sm"
            />
          </div>

          {/* Note Specific: Note Content Textarea */}
          {selectedTemplate === "note" && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Isi Catatan / Kutipan <span className="text-red-400">*</span>
              </label>
              <Textarea
                rows={3}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Tuliskan pemikiran, pengumuman, atau kutipan favorit Anda..."
                required
                className="border-white/10 bg-neutral-950/60 text-white text-sm"
              />
            </div>
          )}

          {/* Image Specific: Image URL */}
          {selectedTemplate === "image" && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                URL Gambar / Foto <span className="text-red-400">*</span>
              </label>
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                required
                className="border-white/10 bg-neutral-950/60 text-white text-sm"
              />
            </div>
          )}

          {/* Map Specific: Location Name */}
          {selectedTemplate === "map" && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Nama Kota / Negara <span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="misal: Jakarta, Indonesia atau Bandung, ID"
                required
                className="border-white/10 bg-neutral-950/60 text-white text-sm"
              />
            </div>
          )}

          {/* GitHub Specific: Repo Name, Language, Stars */}
          {selectedTemplate === "github" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Nama Repositori GitHub <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="misal: vanxh/openbio atau facebook/react"
                  required
                  className="border-white/10 bg-neutral-950/60 text-white text-sm font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Bahasa Pemrograman
                  </label>
                  <Input
                    type="text"
                    value={repoLanguage}
                    onChange={(e) => setRepoLanguage(e.target.value)}
                    placeholder="TypeScript / Python"
                    className="border-white/10 bg-neutral-950/60 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Jumlah Stars (⭐)
                  </label>
                  <Input
                    type="number"
                    value={repoStars}
                    onChange={(e) => setRepoStars(e.target.value)}
                    placeholder="128"
                    className="border-white/10 bg-neutral-950/60 text-white text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Row Specific: Platform Links */}
          {selectedTemplate === "social_row" && (
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-neutral-300">
                Tautan Profil Media Sosial (Isi yang ingin ditampilkan):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="border-white/10 bg-neutral-950/60 text-white text-xs"
                />
                <Input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="border-white/10 bg-neutral-950/60 text-white text-xs"
                />
                <Input
                  type="url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://x.com/username"
                  className="border-white/10 bg-neutral-950/60 text-white text-xs"
                />
                <Input
                  type="url"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/@channel"
                  className="border-white/10 bg-neutral-950/60 text-white text-xs"
                />
                <Input
                  type="url"
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  placeholder="https://tiktok.com/@username"
                  className="border-white/10 bg-neutral-950/60 text-white text-xs"
                />
                <Input
                  type="url"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="https://wa.me/628123456789"
                  className="border-white/10 bg-neutral-950/60 text-white text-xs"
                />
              </div>
            </div>
          )}

          {/* Standard Target URL (for Link, Media, Image, Bento Card) */}
          {selectedTemplate !== "header_text" &&
            selectedTemplate !== "social_row" &&
            selectedTemplate !== "map" && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  {selectedTemplate === "media_embed"
                    ? "URL YouTube / Spotify"
                    : "URL Tujuan (Link Klik)"}{" "}
                  {selectedTemplate === "media_embed" && <span className="text-red-400">*</span>}
                </label>
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={
                    selectedTemplate === "media_embed"
                      ? "https://www.youtube.com/watch?v=... atau Spotify URL"
                      : "https://example.com (Opsional)"
                  }
                  required={selectedTemplate === "media_embed"}
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

          {/* Subtitle / Description (for bento_card, link, image, github, map) */}
          {(selectedTemplate === "bento_card" ||
            selectedTemplate === "link" ||
            selectedTemplate === "image" ||
            selectedTemplate === "github" ||
            selectedTemplate === "map") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Subtitle / Deskripsi
                </label>
                <Input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Deskripsi singkat..."
                  className="border-white/10 bg-neutral-950/60 text-white text-sm"
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
                  placeholder="misal: BARU, FEATURED"
                  className="border-white/10 bg-neutral-950/60 text-white text-sm"
                />
              </div>
            </div>
          )}

          {/* Size / Grid Span Options */}
          {selectedTemplate !== "header_text" && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Ukuran Grid di Kanvas Bento
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { col: 1, row: 1, label: "1x1 Kotak" },
                  { col: 2, row: 1, label: "2x1 Lebar" },
                  { col: 2, row: 2, label: "2x2 Besar" },
                ].map((s) => (
                  <button
                    key={`${s.col}-${s.row}`}
                    type="button"
                    onClick={() => {
                      setColSpan(s.col);
                      setRowSpan(s.row);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono transition text-center ${
                      colSpan === s.col && rowSpan === s.row
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                        : "bg-white/[0.04] border-white/5 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit & Cancel Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/10 text-neutral-300 hover:bg-white/5 text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 shadow-lg shadow-indigo-600/30"
            >
              + Tambahkan Blok
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
