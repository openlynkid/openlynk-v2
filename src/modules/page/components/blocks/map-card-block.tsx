"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock } from "lucide-react";
import type { PageBlock } from "@/db/schema";
import type { PageBlockConfig } from "../../types";

interface MapCardBlockProps {
  block: PageBlock;
  isStudio?: boolean;
}

export function MapCardBlock({ block }: MapCardBlockProps) {
  const config = (block.config ?? {}) as PageBlockConfig;
  const locationName = config.locationName || block.title || "Jakarta, ID";
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[140px] p-5 rounded-2xl sm:rounded-3xl rune-glass rune-glass-hover border border-white/10 hover:border-white/25 shadow-xl flex flex-col justify-between overflow-hidden group select-none transition-all duration-300">
      {/* Background stylized radar/map grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.08)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -top-12 -right-12 size-36 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-500" />

      {/* Top Header Row with Location Pin */}
      <div className="flex items-center justify-between relative z-10">
        <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-sm">
          <MapPin size={20} className="animate-bounce" />
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300 text-xs font-mono shadow-sm">
          <Clock size={12} className="text-emerald-400" />
          <span>{timeString || "--:--:--"}</span>
        </div>
      </div>

      {/* Bottom Content Row */}
      <div className="relative z-10 mt-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-0.5">
          {config.badgeText || "Lokasi Domisili"}
        </span>
        <h3 className="font-semibold text-base sm:text-lg text-white group-hover:text-emerald-300 transition line-clamp-1">
          {locationName}
        </h3>
        {config.subtitle && (
          <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
            {config.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
