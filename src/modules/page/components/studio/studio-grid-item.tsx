"use client";

import {
  Pencil,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Copy,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { PageBlock } from "@/db/schema";
import { PageCard } from "../page-card";
import { getBentoBlockSpan } from "../bento-grid";

interface StudioGridItemProps {
  block: PageBlock;
  index: number;
  totalBlocks: number;
  isSelected: boolean;
  isBeingDragged: boolean;
  isAnyDragging: boolean;
  onRegisterRef: (el: HTMLDivElement | null) => void;
  onPointerDown: (
    block: PageBlock,
    e: React.PointerEvent<HTMLDivElement>,
    isFromHandle?: boolean
  ) => void;
  onCardPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onCardPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  onCardPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
  wasJustDragged?: () => boolean;
  onSelectBlock: (block: PageBlock) => void;
  onQuickResize: (blockId: string, colSpan: number, rowSpan: number) => void;
  onQuickMove: (blockId: string, direction: "up" | "down") => void;
  onDuplicateBlock?: (block: PageBlock) => void;
  onRequestDelete: (block: PageBlock) => void;
}

export function StudioGridItem({
  block,
  index,
  totalBlocks,
  isSelected,
  isBeingDragged,
  isAnyDragging,
  onRegisterRef,
  onPointerDown,
  onCardPointerMove,
  onCardPointerUp,
  onCardPointerCancel,
  wasJustDragged,
  onSelectBlock,
  onQuickResize,
  onQuickMove,
  onDuplicateBlock,
  onRequestDelete,
}: StudioGridItemProps) {
  const spanClass = getBentoBlockSpan(block);

  return (
    <div
      data-block-id={block.id}
      ref={onRegisterRef}
      onPointerDown={(e) => onPointerDown(block, e, false)}
      onPointerMove={onCardPointerMove}
      onPointerUp={onCardPointerUp}
      onPointerCancel={onCardPointerCancel}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        touchAction: isAnyDragging ? "none" : "pan-y",
        WebkitTouchCallout: "none",
        userSelect: "none",
      }}
      className={`${spanClass} relative group transition-transform duration-200 min-w-0 select-none will-change-transform ${
        isBeingDragged
          ? "rounded-2xl sm:rounded-3xl border-2 border-dashed border-indigo-400/90 bg-indigo-500/10 min-h-[120px] shadow-[inset_0_0_24px_rgba(99,102,241,0.2)] ring-2 ring-indigo-500/40 backdrop-blur-sm"
          : ""
      }`}
    >
      {isBeingDragged ? (
        /* Slot Outline Content (Preserves Same DOM Node) */
        <div className="w-full h-full min-h-[120px] flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
            <div className="size-9 rounded-xl bg-indigo-500/25 border border-indigo-500/50 flex items-center justify-center text-indigo-300 shadow-sm animate-pulse">
              <GripVertical size={16} />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-indigo-200 block">
                Lepas untuk Menempatkan
              </span>
              <span className="text-[10px] text-indigo-300/70 font-mono block">
                Ukuran {block.colSpan}x{block.rowSpan} Blok
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Normal Card Content */
        <>
          {/* Permanent Drag Grip Handle (Top-Left) */}
          <div
            onPointerDown={(e) => onPointerDown(block, e, true)}
            style={{ touchAction: "none" }}
            title="Tarik untuk menggeser posisi kartu"
            className="absolute top-2.5 left-2.5 z-20 size-7 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 hover:border-white/30 flex items-center justify-center text-neutral-400 hover:text-white cursor-grab active:cursor-grabbing backdrop-blur-md shadow-md transition-all duration-150 group-hover:scale-105"
          >
            <GripVertical size={14} />
          </div>

          {/* Block Card Container */}
          <div
            onClick={(e) => {
              if (isAnyDragging || isBeingDragged || wasJustDragged?.()) return;
              e.stopPropagation();
              onSelectBlock(block);
            }}
            className={`w-full h-full cursor-pointer rounded-2xl sm:rounded-3xl transition-all duration-200 relative ${
              isSelected
                ? "ring-2 ring-indigo-500 shadow-indigo-500/20 shadow-xl scale-[1.01]"
                : "hover:ring-1 hover:ring-white/30"
            } ${!block.isActive ? "opacity-50 grayscale-[40%]" : ""}`}
          >
            <PageCard block={block} isStudio />
          </div>

          {/* Contextual Floating Toolbar on Hover / Focus / Selection (Top-Right) */}
          <div
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className={`absolute -top-3.5 right-2 transition-all duration-150 z-20 flex items-center gap-1 bg-neutral-900/95 border border-white/20 p-1 rounded-xl shadow-2xl backdrop-blur-md ${
              isSelected ? "opacity-100 scale-100 ring-1 ring-indigo-500/40" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            {/* Quick Resize if bento_card */}
            {block.type === "bento_card" && (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                className="flex items-center gap-0.5 border-r border-white/10 pr-1 mr-0.5"
              >
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickResize(block.id, 1, 1);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                          block.colSpan === 1 && block.rowSpan === 1
                            ? "bg-indigo-600 text-white"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      />
                    }
                  >
                    1x1
                  </TooltipTrigger>
                  <TooltipContent>Ubah ke 1x1 Kotak</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickResize(block.id, 2, 1);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                          block.colSpan === 2 && block.rowSpan === 1
                            ? "bg-indigo-600 text-white"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      />
                    }
                  >
                    2x1
                  </TooltipTrigger>
                  <TooltipContent>Ubah ke 2x1 Lebar</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickResize(block.id, 2, 2);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                          block.colSpan === 2 && block.rowSpan === 2
                            ? "bg-indigo-600 text-white"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      />
                    }
                  >
                    2x2
                  </TooltipTrigger>
                  <TooltipContent>Ubah ke 2x2 Besar</TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Move Up / Down Buttons */}
            <div
              onPointerDown={(e) => e.stopPropagation()}
              className="flex items-center gap-0.5"
            >
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickMove(block.id, "up");
                      }}
                      className="size-6 rounded flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-20 transition"
                    />
                  }
                >
                  <ChevronUp size={13} />
                </TooltipTrigger>
                <TooltipContent>Geser ke Atas</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      disabled={index === totalBlocks - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickMove(block.id, "down");
                      }}
                      className="size-6 rounded flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-20 transition"
                    />
                  }
                >
                  <ChevronDown size={13} />
                </TooltipTrigger>
                <TooltipContent>Geser ke Bawah</TooltipContent>
              </Tooltip>

              {/* Duplicate Button */}
              {onDuplicateBlock && (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateBlock(block);
                        }}
                        className="size-6 rounded flex items-center justify-center text-neutral-400 hover:text-indigo-300 transition"
                      />
                    }
                  >
                    <Copy size={11} />
                  </TooltipTrigger>
                  <TooltipContent>Duplikat Kartu</TooltipContent>
                </Tooltip>
              )}

              {/* Edit Button */}
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBlock(block);
                      }}
                      className="size-6 rounded flex items-center justify-center text-indigo-400 hover:text-indigo-300 transition"
                    />
                  }
                >
                  <Pencil size={12} />
                </TooltipTrigger>
                <TooltipContent>Edit Properti Blok</TooltipContent>
              </Tooltip>

              {/* Delete Button */}
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestDelete(block);
                      }}
                      className="size-6 rounded flex items-center justify-center text-red-400 hover:text-red-300 transition"
                    />
                  }
                >
                  <Trash2 size={12} />
                </TooltipTrigger>
                <TooltipContent>Hapus Blok</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
