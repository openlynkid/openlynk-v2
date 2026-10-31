import type { PageBlock } from "@/db/schema";

interface HeaderTextBlockProps {
  block: PageBlock;
}

export function HeaderTextBlock({ block }: HeaderTextBlockProps) {
  return (
    <div className="w-full pt-4 pb-1 flex items-center gap-3 select-none">
      <div className="h-px bg-white/10 flex-grow" />
      <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400 px-1">
        {block.title}
      </span>
      <div className="h-px bg-white/10 flex-grow" />
    </div>
  );
}
