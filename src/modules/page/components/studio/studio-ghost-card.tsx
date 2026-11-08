"use client";

import { GripVertical } from "lucide-react";
import type { PageBlock } from "@/db/schema";
import { PageCard } from "../page-card";

interface StudioGhostCardProps {
  block: PageBlock;
  cursorPos: { x: number; y: number };
  dragOffset: { x: number; y: number };
  ghostSize: { width: number; height: number };
}

export function StudioGhostCard({
  block,
  cursorPos,
  dragOffset,
  ghostSize,
}: StudioGhostCardProps) {
  return (
    <div
      className="fixed pointer-events-none z-50 select-none transition-transform duration-75 ease-out"
      style={{
        left: `${cursorPos.x - dragOffset.x}px`,
        top: `${cursorPos.y - dragOffset.y}px`,
        width: `${ghostSize.width}px`,
        height: `${ghostSize.height}px`,
      }}
    >
      <div className="w-full h-full scale-[1.05] rotate-2 shadow-2xl shadow-indigo-500/40 ring-2 ring-indigo-400 rounded-2xl sm:rounded-3xl rune-glass opacity-95 overflow-hidden backdrop-blur-2xl transition-transform">
        <PageCard block={block} isStudio />
        <div className="absolute top-2.5 left-2.5 z-20 bg-indigo-600/95 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-indigo-400/50">
          <GripVertical size={12} className="text-white animate-pulse" />
          <span className="truncate max-w-[180px]">Memindahkan: {block.title}</span>
        </div>
      </div>
    </div>
  );
}
