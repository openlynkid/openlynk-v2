import { ArrowUpRight } from "lucide-react";
import { RuneIcon } from "@/components/ui/rune-icon";
import { Badge } from "@/components/ui/badge";
import type { PageBlock } from "@/db/schema";
import type { PageBlockConfig } from "../../types";

interface BentoCardBlockProps {
  block: PageBlock;
  isStudio?: boolean;
}

function getSafeHref(url?: string): string {
  if (!url) return "#";
  const clean = url.trim();
  const lower = clean.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return "#";
  }
  return clean;
}

export function BentoCardBlock({
  block,
  isStudio = false,
}: BentoCardBlockProps) {
  const config = (block.config ?? {}) as PageBlockConfig;
  const isSquare = (block.colSpan ?? 1) === 1 && (block.rowSpan ?? 1) === 1;
  const isLarge = (block.colSpan ?? 1) >= 2 && (block.rowSpan ?? 1) >= 2;
  const safeUrl = getSafeHref(block.url);

  const content = (
    <div
      className={`relative w-full h-full rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all duration-300 group select-none border border-white/10 hover:border-white/25 rune-glass rune-glass-hover shadow-xl hover:shadow-indigo-500/10 active:scale-[0.98] ${
        isSquare
          ? "min-h-[140px] aspect-square sm:aspect-auto"
          : isLarge
          ? "min-h-[260px]"
          : "min-h-[130px]"
      }`}
    >
      {/* Background ambient radial glow */}
      <div
        className="absolute -top-12 -right-12 size-36 rounded-full blur-2xl pointer-events-none transition-all duration-500 opacity-60 group-hover:opacity-100"
        style={{
          backgroundColor:
            config.accentGlow || "var(--theme-accent, rgba(99, 102, 241, 0.2))",
        }}
      />
      <div className="absolute -bottom-10 -left-10 size-28 rounded-full bg-white/[0.04] blur-2xl pointer-events-none group-hover:bg-white/[0.08] transition-all duration-500" />

      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="size-11 sm:size-12 rounded-xl sm:rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-neutral-200 group-hover:text-white group-hover:border-white/30 group-hover:scale-105 transition duration-300 shrink-0 shadow-sm">
          <RuneIcon
            name={block.iconName || "glass-sparkle"}
            type="glass"
            size={24}
          />
        </div>

        <div className="flex items-center gap-2">
          {config.badgeText && (
            <Badge
              variant="outline"
              className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.08] border-white/20 text-neutral-200 shadow-sm"
              style={{
                borderColor: config.accentGlow ? `${config.accentGlow}60` : undefined,
                color: config.accentGlow || undefined,
              }}
            >
              {config.badgeText}
            </Badge>
          )}

          <div className="size-7 rounded-lg flex items-center justify-center text-neutral-500 group-hover:text-neutral-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300">
            <ArrowUpRight size={17} />
          </div>
        </div>
      </div>

      {/* Bottom Content Row */}
      <div className="relative z-10 mt-4">
        <h3 className="font-semibold text-sm sm:text-base text-neutral-100 group-hover:text-white line-clamp-1 transition tracking-tight">
          {block.title}
        </h3>
        {config.subtitle ? (
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
            {config.subtitle}
          </p>
        ) : (
          <p className="text-[11px] text-neutral-500 mt-0.5 truncate font-mono">
            {block.url ? block.url.replace(/^https?:\/\//, "") : ""}
          </p>
        )}
      </div>
    </div>
  );

  if (!isStudio && safeUrl && safeUrl !== "#") {
    return (
      <a
        href={safeUrl}
        target={safeUrl.startsWith("http") ? "_blank" : undefined}
        rel={safeUrl.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block w-full h-full"
      >
        {content}
      </a>
    );
  }

  return content;
}
