import type { PageBlock } from "@/db/schema";
import { PageCard } from "./page-card";

interface BentoGridProps {
  blocks: PageBlock[];
}

export function getBentoBlockSpan(block: PageBlock): string {
  if (block.type === "header_text") {
    return "col-span-2 sm:col-span-4";
  }

  if (block.type === "media_embed") {
    if (block.colSpan === 1) {
      return "col-span-2 sm:col-span-2";
    }
    return "col-span-2 sm:col-span-4";
  }

  if (block.type === "link") {
    if (block.colSpan === 1) {
      return "col-span-1 sm:col-span-2";
    }
    return "col-span-2 sm:col-span-4";
  }

  // Bento Card
  const col = block.colSpan ?? 1;
  const row = block.rowSpan ?? 1;

  if (col >= 2 && row >= 2) {
    return "col-span-2 sm:col-span-2 row-span-2";
  }
  if (col >= 2) {
    return "col-span-2 sm:col-span-2";
  }
  if (row >= 2) {
    return "col-span-1 sm:col-span-1 row-span-2";
  }
  return "col-span-1 sm:col-span-1";
}

export function BentoGrid({ blocks }: BentoGridProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 auto-rows-auto">
      {blocks.map((block) => (
        <div
          key={block.id}
          className={`${getBentoBlockSpan(block)} transition-all duration-300 min-w-0`}
        >
          <PageCard block={block} />
        </div>
      ))}
    </div>
  );
}
