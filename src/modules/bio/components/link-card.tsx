import { RuneIcon } from "runeicons-react";
import type { BioBlock } from "@/db/schema";

interface LinkCardProps {
  block: BioBlock;
}

export function LinkCard({ block }: LinkCardProps) {
  return (
    <a
      href={block.url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full min-h-[56px] px-4 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/10 hover:border-white/20 backdrop-blur-xl shadow-lg transition-all duration-200 flex items-center justify-between gap-3 group active:scale-[0.99] select-none"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Left Icon Pill */}
        <div className="size-10 rounded-xl bg-white/[0.04] border border-white/10 flex-shrink-0 flex items-center justify-center text-neutral-300 group-hover:text-white group-hover:border-white/20 transition">
          <RuneIcon
            name={block.iconName || "glass-chain-link-3-1"}
            type="glass"
            size={20}
          />
        </div>

        {/* Title */}
        <span className="font-medium text-sm sm:text-base text-neutral-200 group-hover:text-white truncate transition">
          {block.title}
        </span>
      </div>

      {/* Right External Arrow */}
      <div className="size-8 rounded-lg flex items-center justify-center text-neutral-500 group-hover:text-neutral-200 group-hover:translate-x-0.5 transition flex-shrink-0">
        <RuneIcon name="glass-arrow-right-circle" type="glass" size={18} />
      </div>
    </a>
  );
}
