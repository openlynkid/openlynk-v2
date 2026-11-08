import { ArrowRight, ArrowUpRight } from "lucide-react";
import { RuneIcon } from "@/components/ui/rune-icon";
import type { PageBlock } from "@/db/schema";
import type { PageBlockConfig } from "../../types";

interface LinkBlockProps {
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

function getDisplayDomain(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function LinkBlock({ block, isStudio = false }: LinkBlockProps) {
  const safeUrl = getSafeHref(block.url);
  const isCompact = (block.colSpan ?? 1) === 1;
  const config = (block.config ?? {}) as PageBlockConfig;
  const domain = getDisplayDomain(block.url);

  // 1. Compact 1x1 Layout
  if (isCompact) {
    const compactContent = (
      <div className="relative w-full h-full min-h-[110px] p-4 rounded-2xl rune-glass rune-glass-hover flex flex-col justify-between overflow-hidden group select-none transition-all duration-200 border border-white/10 hover:border-white/20 shadow-lg">
        {/* Glow */}
        <div className="absolute -top-8 -right-8 size-20 rounded-full bg-indigo-500/10 blur-xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-300" />

        <div className="flex items-center justify-between relative z-10">
          <div className="size-10 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-neutral-200 group-hover:scale-105 group-hover:text-white transition duration-300 shadow-sm">
            <RuneIcon
              name={block.iconName || "glass-chain-link-3-1"}
              type="glass"
              size={22}
            />
          </div>
          <div className="size-6 rounded-md flex items-center justify-center text-neutral-500 group-hover:text-neutral-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300">
            <ArrowUpRight size={14} />
          </div>
        </div>

        <div className="mt-3 relative z-10 min-w-0">
          <span className="font-semibold text-xs sm:text-sm text-neutral-100 group-hover:text-white line-clamp-1 block transition">
            {block.title}
          </span>
          {domain && (
            <span className="text-[10px] text-neutral-400 truncate block mt-0.5 font-mono">
              {domain}
            </span>
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
          {compactContent}
        </a>
      );
    }
    return compactContent;
  }

  // 2. Wide / Standard Layout (colSpan >= 2)
  const wideContent = (
    <div className="relative w-full h-full min-h-[60px] px-4 py-3.5 rounded-2xl rune-glass rune-glass-hover flex items-center justify-between gap-3 group active:scale-[0.99] select-none transition-all duration-200 border border-white/10 hover:border-white/20 shadow-lg overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-300" />

      <div className="flex items-center gap-3.5 min-w-0 relative z-10">
        <div className="size-10 sm:size-11 rounded-xl bg-white/[0.08] border border-white/10 flex-shrink-0 flex items-center justify-center text-neutral-300 group-hover:text-white group-hover:scale-105 transition duration-300 shadow-sm">
          <RuneIcon
            name={block.iconName || "glass-chain-link-3-1"}
            type="glass"
            size={22}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm sm:text-base text-neutral-100 group-hover:text-white truncate transition">
            {block.title}
          </span>
          {config.subtitle ? (
            <span className="text-xs text-neutral-400 truncate">
              {config.subtitle}
            </span>
          ) : domain ? (
            <span className="text-[11px] text-neutral-500 truncate font-mono">
              {domain}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
        {config.badgeText && (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/15 text-neutral-300">
            {config.badgeText}
          </span>
        )}
        <div className="size-8 rounded-lg flex items-center justify-center text-neutral-500 group-hover:text-neutral-200 group-hover:translate-x-0.5 transition">
          <ArrowRight size={18} />
        </div>
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
        {wideContent}
      </a>
    );
  }

  return wideContent;
}
