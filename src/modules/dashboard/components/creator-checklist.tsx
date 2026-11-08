import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, Sparkles } from "lucide-react";
import type { CreatorChecklist as CreatorChecklistType } from "../types";

interface CreatorChecklistProps {
  checklist: CreatorChecklistType;
  primaryPageId?: string;
}

export function CreatorChecklist({
  checklist,
  primaryPageId,
}: CreatorChecklistProps) {
  const steps = [
    {
      title: "Pilih Handle Username Unik",
      desc: "Menjadi alamat URL publik micro-site Anda.",
      isDone: checklist.hasProfile,
      href: "/dashboard/profile",
      actionText: "Atur Username",
    },
    {
      title: "Lengkapi Bio Profil",
      desc: "Jelaskan siapa Anda dan apa yang Anda tawarkan.",
      isDone: checklist.hasBio,
      href: "/dashboard/profile",
      actionText: "Tulis Bio",
    },
    {
      title: "Unggah Foto Avatar",
      desc: "Beri sentuhan personal dengan foto identitas.",
      isDone: checklist.hasAvatar,
      href: "/dashboard/profile",
      actionText: "Unggah Foto",
    },
    {
      title: "Sambungkan Akun Sosial Media",
      desc: "Instagram, TikTok, YouTube, GitHub, atau WhatsApp.",
      isDone: checklist.hasSocials,
      href: "/dashboard/profile",
      actionText: "Hubungkan Sosial",
    },
    {
      title: "Buat Halaman Micro-site Pertama",
      desc: "Wadah konten untuk portofolio atau link penting.",
      isDone: checklist.hasPages,
      href: "/dashboard/pages",
      actionText: "Buat Halaman",
    },
    {
      title: "Pasang Minimal 3 Blok Bento",
      desc: "Susun kartu bento menarik di Bento Studio.",
      isDone: checklist.hasBlocks,
      href: primaryPageId ? `/dashboard/pages/${primaryPageId}` : "/dashboard/pages",
      actionText: "Buka Studio",
    },
  ];

  const isAllDone = checklist.percentage === 100;

  return (
    <div className="rounded-2xl rune-glass border-white/10 p-5 sm:p-6 relative overflow-hidden">
      {/* Header with progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-indigo-400 animate-pulse" />
            <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <span>Panduan Setup Kreator</span>
              {isAllDone && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles size={11} />
                  <span>Lengkap 100%!</span>
                </span>
              )}
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Optimalkan profil dan micro-site Anda agar tampil memukau saat dibagikan.
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-28 sm:w-36 h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${checklist.percentage}%` }}
            />
          </div>
          <span className="text-xs font-mono font-semibold text-indigo-300">
            {checklist.percentage}%
          </span>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
              step.isDone
                ? "bg-white/[0.02] border-white/5 opacity-80"
                : "bg-indigo-950/20 border-indigo-500/20 hover:border-indigo-500/40"
            }`}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              {step.isDone ? (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Circle size={16} className="text-neutral-500 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <p
                  className={`text-xs font-medium truncate ${
                    step.isDone ? "text-neutral-300 line-through decoration-neutral-500" : "text-white"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                  {step.desc}
                </p>
              </div>
            </div>

            {!step.isDone && (
              <Link
                href={step.href}
                className="shrink-0 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 self-center"
              >
                <span>{step.actionText}</span>
                <ArrowRight size={10} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
