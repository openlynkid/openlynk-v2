import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RuneIcon } from "@/components/ui/rune-icon";
import type { DashboardStats } from "../types";

interface DashboardStatsGridProps {
  stats: DashboardStats;
}

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  const statCards = [
    {
      title: "Halaman Publik",
      value: stats.totalPages,
      subtitle: `${stats.totalPages} Micro-site aktif`,
      iconName: "glass-chain-link-3-1",
      badge: "Multi-Page",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      href: "/dashboard/pages",
    },
    {
      title: "Blok Bento",
      value: stats.totalBlocks,
      subtitle: "Komponen interaktif live",
      iconName: "glass-sparkle",
      badge: "Visual Bento",
      badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      href: "/dashboard/pages",
    },
    {
      title: "Tautan & Media",
      value: stats.totalLinks,
      subtitle: "Link dan tautan sosial",
      iconName: "glass-star",
      badge: "Tautan Bio",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      href: "/dashboard/profile",
    },
    {
      title: "Status Publikasi",
      value: stats.isPublished ? "Online" : "Draft",
      subtitle: stats.isPublished ? "Halaman dapat diakses publik" : "Halaman belum dipublis",
      iconName: "glass-badge-check",
      badge: stats.isPublished ? "Live" : "Draft",
      badgeColor: stats.isPublished
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        : "bg-amber-500/10 text-amber-400 border-amber-500/20",
      isLivePill: stats.isPublished,
      href: "/dashboard/pages",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statCards.map((card, idx) => (
        <Link
          key={idx}
          href={card.href}
          className="group relative overflow-hidden rounded-2xl p-4 sm:p-5 rune-glass rune-glass-hover border-white/10 flex flex-col justify-between"
        >
          {/* Top header of card */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="size-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <RuneIcon name={card.iconName} type="glass" size={20} />
            </div>

            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${card.badgeColor} flex items-center gap-1`}
            >
              {card.isLivePill && (
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
              {card.badge}
            </span>
          </div>

          {/* Metric Value */}
          <div>
            <div className="flex items-baseline justify-between">
              <div className="text-xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                {card.value}
              </div>
              <ArrowUpRight
                size={14}
                className="text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100"
              />
            </div>

            <div className="text-xs font-medium text-neutral-300 mt-1">
              {card.title}
            </div>

            <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
              {card.subtitle}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
