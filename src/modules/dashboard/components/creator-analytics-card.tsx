"use client";

import { useState } from "react";
import { TrendingUp, MousePointerClick, Eye, ShieldCheck } from "lucide-react";

interface CreatorAnalyticsCardProps {
  totalPages: number;
  totalBlocks: number;
}

export function CreatorAnalyticsCard({
  totalPages,
  totalBlocks,
}: CreatorAnalyticsCardProps) {
  const [activeTab, setActiveTab] = useState<"7d" | "30d">("7d");

  // Simulated 7-day relative activity heights for visual sparkline
  const activityData7d = [
    { day: "Sen", height: "45%", value: "32" },
    { day: "Sel", height: "70%", value: "54" },
    { day: "Rab", height: "55%", value: "41" },
    { day: "Kam", height: "85%", value: "68" },
    { day: "Jum", height: "60%", value: "48" },
    { day: "Sab", height: "95%", value: "82" },
    { day: "Min", height: "80%", value: "71" },
  ];

  const activityData30d = [
    { day: "M1", height: "50%", value: "210" },
    { day: "M2", height: "75%", value: "340" },
    { day: "M3", height: "65%", value: "290" },
    { day: "M4", height: "90%", value: "420" },
  ];

  const currentData = activeTab === "7d" ? activityData7d : activityData30d;

  return (
    <div className="rounded-2xl rune-glass border-white/10 p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <TrendingUp size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Aktivitas &amp; Estimasi Jangkauan
              </h3>
              <p className="text-[11px] text-neutral-400">
                Pulsar performa interaksi micro-site
              </p>
            </div>
          </div>

          {/* Time range selector */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTab("7d")}
              className={`px-2 py-0.5 rounded-lg transition font-medium ${
                activeTab === "7d"
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              7 Hari
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("30d")}
              className={`px-2 py-0.5 rounded-lg transition font-medium ${
                activeTab === "30d"
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              30 Hari
            </button>
          </div>
        </div>

        {/* Mini metric pills */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
              <Eye size={13} />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block">Estimasi Tayang</span>
              <span className="text-sm font-extrabold text-white">
                {Math.max(totalPages * 140, 240)}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <MousePointerClick size={13} />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block">Klik Tautan</span>
              <span className="text-sm font-extrabold text-white">
                {Math.max(totalBlocks * 24, 76)}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Sparkline Bar Chart */}
        <div className="bg-black/30 rounded-xl border border-white/5 p-3">
          <div className="flex items-end justify-between h-20 gap-1.5 pt-2">
            {currentData.map((item, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                title={`${item.day}: ${item.value} interaksi`}
              >
                <div className="w-full bg-white/[0.04] rounded-t-sm h-full flex items-end overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 via-indigo-500 to-cyan-400 rounded-t-sm group-hover:from-indigo-400 group-hover:to-cyan-300 transition-all duration-300"
                    style={{ height: item.height }}
                  />
                </div>
                <span className="text-[9px] font-mono text-neutral-500 group-hover:text-neutral-300">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cloud & DB Sync Status */}
      <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-[11px] text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Status Cloud Sync</span>
        </span>
        <span className="text-neutral-500 font-mono text-[10px] flex items-center gap-1">
          <ShieldCheck size={12} className="text-emerald-400" />
          <span>Terenkripsi</span>
        </span>
      </div>
    </div>
  );
}
