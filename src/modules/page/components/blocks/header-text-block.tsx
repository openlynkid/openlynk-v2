import type { PageBlock } from "@/db/schema";
import type { PageBlockConfig } from "../../types";

interface HeaderTextBlockProps {
  block: PageBlock;
}

export function HeaderTextBlock({ block }: HeaderTextBlockProps) {
  const config = (block.config ?? {}) as PageBlockConfig;

  return (
    <div className="w-full pt-6 pb-2 flex flex-col items-center justify-center gap-1.5 select-none text-center">
      <div className="w-full flex items-center gap-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-white/5 flex-grow" />
        <span className="text-xs font-semibold tracking-widest uppercase text-neutral-300 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-sm">
          {block.title}
        </span>
        <div className="h-px bg-gradient-to-r from-white/5 via-white/20 to-transparent flex-grow" />
      </div>
      {config.subtitle && (
        <p className="text-[11px] text-neutral-400 max-w-sm mt-0.5 tracking-normal">
          {config.subtitle}
        </p>
      )}
    </div>
  );
}
