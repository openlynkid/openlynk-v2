import { RuneIcon } from "runeicons-react";
import type { PageBlock } from "@/db/schema";
import type { PageBlockConfig } from "../../types";

interface BentoCardBlockProps {
  block: PageBlock;
}

export function BentoCardBlock({ block }: BentoCardBlockProps) {
  const config = (block.config ?? {}) as PageBlockConfig;
  const isSquare = block.colSpan === 1 && (block.rowSpan ?? 1) === 1;
  const isLarge = (block.colSpan ?? 1) >= 2 && (block.rowSpan ?? 1) >= 2;

  const content = (
    <div
      className={`relative w-full h-full rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all duration-300 group select-none border border-white/10 bg-neutral-900/40 hover:bg-neutral-900/60 hover:border-white/25 backdrop-blur-xl shadow-lg hover:shadow-indigo-500/5 active:scale-[0.98] ${
        isSquare
          ? "aspect-square min-h-[140px]"
          : isLarge
            ? "min-h-[260px]"
            : "min-h-[110px]"
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute -top-12 -right-12 size-28 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500" />

      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="size-11 sm:size-12 rounded-xl sm:rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-neutral-200 group-hover:text-white group-hover:border-white/25 group-hover:scale-105 transition duration-300 shrink-0">
          <RuneIcon
            name={block.iconName || "glass-sparkle"}
            type="glass"
            size={24}
          />
        </div>

        {config.badgeText ? (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
            {config.badgeText}
          </span>
        ) : (
          <div className="size-7 rounded-lg flex items-center justify-center text-neutral-500 group-hover:text-neutral-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300">
            <RuneIcon name="glass-arrow-right-circle" type="glass" size={16} />
          </div>
        )}
      </div>

      {/* Bottom Content Row */}
      <div className="relative z-10 mt-3">
        <h3 className="font-semibold text-sm sm:text-base text-neutral-100 group-hover:text-white line-clamp-1 transition">
          {block.title}
        </h3>
        {config.subtitle && (
          <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
            {config.subtitle}
          </p>
        )}
      </div>
    </div>
  );

  if (block.url && block.url !== "#") {
    return (
      <a
        href={block.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full"
      >
        {content}
      </a>
    );
  }

  return content;
}
