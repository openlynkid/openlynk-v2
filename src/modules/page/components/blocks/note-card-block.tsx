import { Quote } from "lucide-react";
import type { PageBlock } from "@/db/schema";
import type { PageBlockConfig } from "../../types";

interface NoteCardBlockProps {
  block: PageBlock;
  isStudio?: boolean;
}

export function NoteCardBlock({ block }: NoteCardBlockProps) {
  const config = (block.config ?? {}) as PageBlockConfig;
  const content = config.noteContent || config.subtitle || block.title;
  const authorOrDate = config.badgeText || "Catatan";

  return (
    <div className="relative w-full h-full min-h-[140px] p-5 sm:p-6 rounded-2xl sm:rounded-3xl rune-glass rune-glass-hover border border-white/10 hover:border-white/25 shadow-xl flex flex-col justify-between overflow-hidden group select-none transition-all duration-300">
      {/* Background ambient note glow */}
      <div className="absolute -top-12 -left-12 size-36 rounded-full bg-amber-500/10 blur-3xl pointer-events-none group-hover:bg-amber-500/15 transition-all duration-500" />
      <div className="absolute -bottom-10 -right-10 size-28 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

      {/* Top Header Row with Quote Icon */}
      <div className="flex items-center justify-between relative z-10">
        <div className="size-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-sm">
          <Quote size={18} className="rotate-180" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-neutral-400">
          {authorOrDate}
        </span>
      </div>

      {/* Main Quote / Note Text */}
      <div className="my-3 relative z-10">
        <p className="text-sm sm:text-base font-medium text-neutral-100 leading-relaxed italic line-clamp-4 group-hover:text-white transition">
          &ldquo;{content}&rdquo;
        </p>
      </div>

      {/* Footer Title */}
      <div className="relative z-10 pt-2 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-300 truncate">
          {block.title}
        </span>
        <span className="text-[10px] text-neutral-500 font-mono">memo</span>
      </div>
    </div>
  );
}
