"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, Trash2, Globe, CheckCircle2, ShieldCheck, Flame, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RuneIcon } from "runeicons-react";
import { useObsidianToast } from "./obsidian-toast";

export function ObsidianComponentsSection() {
  const [switchActive, setSwitchActive] = useState(true);
  const [inputValue, setInputValue] = useState("obsidian.design/specimen");
  const [demoValidationState, setDemoValidationState] = useState<"valid" | "error">("valid");
  const [activeTab, setActiveTab] = useState("all");
  const { showToast } = useObsidianToast();

  return (
    <section id="components" className="py-12 sm:py-16 border-b border-white/10 space-y-10 scroll-mt-24">
      <div className="max-w-4xl mx-auto space-y-2">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-pink-400" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Primitif Komponen UI
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400">
          Komponen antarmuka Obsidian dibangun di atas <strong>Base UI (@base-ui/react)</strong> dan <strong>Tailwind CSS v4</strong> dengan estetika tactile glassmorphism.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        {/* 1. Buttons Showcase */}
        <div className="rune-glass p-6 sm:p-8 rounded-3xl border-white/10 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">Varian Tombol (Button System)</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Tombol taktil dengan feedback responsif dan kurva sudut rounded-xl.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Primary Solid White */}
            <Button
              onClick={() => showToast("Tombol Primary Diklik", "variant: default")}
              className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs h-9 px-4 cursor-pointer"
            >
              Primary Solid
            </Button>

            {/* Accent Violet */}
            <Button
              onClick={() => showToast("Tombol Accent Diklik", "variant: accent-violet")}
              className="bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl text-xs h-9 px-4 shadow-lg shadow-violet-600/20 cursor-pointer"
            >
              Accent Violet
            </Button>

            {/* Outline Glass */}
            <Button
              variant="outline"
              onClick={() => showToast("Tombol Outline Glass Diklik", "variant: outline")}
              className="border-white/10 text-white hover:bg-white/5 rounded-xl text-xs h-9 px-4 cursor-pointer"
            >
              Outline Glass
            </Button>

            {/* Ghost Minimal */}
            <Button
              variant="ghost"
              onClick={() => showToast("Tombol Ghost Diklik", "variant: ghost")}
              className="text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl text-xs h-9 px-3 cursor-pointer"
            >
              Ghost Minimal
            </Button>

            {/* Destructive */}
            <Button
              variant="destructive"
              onClick={() => showToast("Tombol Destructive Diklik", "variant: destructive")}
              className="rounded-xl text-xs h-9 px-3.5 gap-1.5 cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Hapus Data</span>
            </Button>

            {/* Pill Icon Action */}
            <button
              type="button"
              onClick={() => showToast("Tombol Pill Diklik", "rounded-full pill")}
              className="size-9 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <Sparkles size={14} className="text-violet-400" />
            </button>
          </div>
        </div>

        {/* 2. Inputs & Form Fields */}
        <div className="rune-glass p-6 sm:p-8 rounded-3xl border-white/10 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Input &amp; Kontrol Form</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Bidang masukan berlatar gelap pekat, transisi ring fokus, dan validasi status optik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Text Input with Prefix */}
            <div className="space-y-2">
              <label htmlFor="url-input" className="text-xs font-semibold text-neutral-200">
                Alamat Kanvas Profil
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                  <Globe size={14} />
                </div>
                <Input
                  id="url-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="pl-9 bg-black/50 border-white/10 text-white rounded-xl text-xs h-10 focus-visible:ring-1 focus-visible:ring-violet-500/50"
                  placeholder="obsidian.design/specimen"
                />
              </div>
            </div>

            {/* State Validation Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="validation-input" className="text-xs font-semibold text-neutral-200">
                  Validasi Realtime ({demoValidationState === "valid" ? "Lolos" : "Bermasalah"})
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setDemoValidationState((prev) => (prev === "valid" ? "error" : "valid"))
                  }
                  className="text-[11px] font-mono text-violet-400 hover:text-violet-300 cursor-pointer"
                >
                  Ubah ke {demoValidationState === "valid" ? "Error" : "Valid"}
                </button>
              </div>

              <div className="relative">
                <Input
                  id="validation-input"
                  readOnly
                  value={
                    demoValidationState === "valid"
                      ? "crypto-signature-verified-2026"
                      : "invalid_format_detected"
                  }
                  className={`bg-black/50 rounded-xl text-xs h-10 pr-9 ${
                    demoValidationState === "valid"
                      ? "border-emerald-500/40 text-emerald-300"
                      : "border-red-500/40 text-red-300"
                  }`}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  {demoValidationState === "valid" ? (
                    <CheckCircle2 size={15} className="text-emerald-400" />
                  ) : (
                    <AlertCircle size={15} className="text-red-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="bio-input" className="text-xs font-semibold text-neutral-200">
                Deskripsi / Catatan Bento
              </label>
              <Textarea
                id="bio-input"
                rows={2}
                defaultValue="Platform identitas digital modern yang didukung sistem desain Obsidian taktil dengan kurva pendar yang tenang."
                className="bg-black/50 border-white/10 text-white rounded-xl text-xs resize-none"
              />
            </div>
          </div>

          {/* Switch & Toggles */}
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Switch
                id="public-switch"
                checked={switchActive}
                onCheckedChange={setSwitchActive}
              />
              <label htmlFor="public-switch" className="text-xs text-neutral-300 cursor-pointer">
                Publikasikan Kanvas ke Domain Kustom
              </label>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <span className="size-2 rounded-full bg-violet-400" />
              <span>Status Switch: {switchActive ? "ACTIVE" : "DISABLED"}</span>
            </div>
          </div>
        </div>

        {/* 3. Bento Card Primitives */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Bento Card Primitives</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Struktur kartu modular dengan header, sub-header, konten interaktif, dan footer taktil.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Standard Link Card */}
            <Card className="rune-glass border-white/10 rounded-3xl p-5 flex flex-col justify-between group hover:border-white/20 transition">
              <CardHeader className="p-0 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="size-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <RuneIcon name="glass-chain-link-3-1" type="glass" size={18} />
                  </div>
                  <Badge variant="outline" className="text-[10px] py-0 border-white/15 text-neutral-400">
                    2x1 Slot
                  </Badge>
                </div>
                <CardTitle className="text-sm font-bold text-white pt-2">
                  Dokumentasi Teknis
                </CardTitle>
                <CardDescription className="text-xs text-neutral-400">
                  Panduan arsitektur Modular Monolith dan protokol Next.js 16.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-4 flex items-center justify-between text-xs text-neutral-400">
                <span className="font-mono text-[11px]">docs.obsidian.design</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition text-white" />
              </CardContent>
            </Card>

            {/* Card 2: Metrics / Analytics Card */}
            <Card className="rune-glass border-white/10 rounded-3xl p-5 flex flex-col justify-between">
              <CardHeader className="p-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    Obsidian Telemetry
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                    <Flame size={12} />
                    <span>+24.8%</span>
                  </div>
                </div>
                <div className="text-2xl font-black text-white font-mono pt-2">
                  99.98%
                </div>
                <CardDescription className="text-xs text-neutral-400">
                  Ketersediaan sistem dengan latensi CDN global di bawah 15ms.
                </CardDescription>
              </CardHeader>
              <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-neutral-400">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Terverifikasi Kriptografi</span>
              </div>
            </Card>

            {/* Card 3: Interactive Tabs Card */}
            <Card className="rune-glass border-white/10 rounded-3xl p-5 space-y-3 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Segmentasi Modul</span>
                <span className="text-[10px] font-mono text-neutral-400">Tabs Component</span>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-black/50 border border-white/10 rounded-xl p-1 w-full grid grid-cols-3">
                  <TabsTrigger value="all" className="text-xs rounded-lg">Semua</TabsTrigger>
                  <TabsTrigger value="core" className="text-xs rounded-lg">Core</TabsTrigger>
                  <TabsTrigger value="ext" className="text-xs rounded-lg">Ekstensi</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 text-xs text-neutral-300">
                Menampilkan subset: <strong className="text-white font-mono">{activeTab}</strong>
              </div>
            </Card>
          </div>
        </div>

        {/* 4. Badges & Pills Showcase */}
        <div className="rune-glass p-6 sm:p-8 rounded-3xl border-white/10 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Koleksi Badge &amp; Status</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Label status miniatur untuk kategori, lencana terverifikasi, dan peringatan sistem.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Badge className="bg-white/10 text-white border-white/15 rounded-lg text-xs py-1 px-3">
              Default Badge
            </Badge>

            <Badge className="bg-violet-500/15 text-violet-300 border-violet-500/30 rounded-lg text-xs py-1 px-3">
              Violet Accent
            </Badge>

            <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 rounded-lg text-xs py-1 px-3 flex items-center gap-1.5">
              <Check size={11} className="stroke-[3]" />
              <span>Terverifikasi</span>
            </Badge>

            <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 rounded-lg text-xs py-1 px-3 flex items-center gap-1.5">
              <AlertCircle size={11} />
              <span>Eksperimental</span>
            </Badge>

            <Badge variant="outline" className="border-white/20 text-neutral-300 rounded-lg text-xs py-1 px-3 font-mono">
              v1.0.0-rc2
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
