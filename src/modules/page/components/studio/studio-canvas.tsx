"use client";

import { Pencil, Plus, GripVertical } from "lucide-react";
import type { Page, PageBlock, Profile } from "@/db/schema";
import { getThemePreset } from "../../types/themes";
import { PageHeader } from "../page-header";
import type { ViewportMode } from "./studio-header";
import { useBentoDnd } from "./hooks/use-bento-dnd";
import { StudioGridItem } from "./studio-grid-item";
import { StudioGhostCard } from "./studio-ghost-card";

interface StudioCanvasProps {
  page: Page;
  profile: Profile;
  blocks: PageBlock[];
  viewportMode: ViewportMode;
  selectedBlockId: string | null;
  onSelectBlock: (block: PageBlock) => void;
  onQuickResize: (blockId: string, colSpan: number, rowSpan: number) => void;
  onQuickMove: (blockId: string, direction: "up" | "down") => void;
  onDuplicateBlock?: (block: PageBlock) => void;
  onRequestDeleteBlock: (block: PageBlock) => void;
  onReorderBlocks: (newBlocks: PageBlock[]) => void;
  onOpenAddBlock: () => void;
  onOpenPageSettings: () => void;
}

export function StudioCanvas({
  page,
  profile,
  blocks,
  viewportMode,
  selectedBlockId,
  onSelectBlock,
  onQuickResize,
  onQuickMove,
  onDuplicateBlock,
  onRequestDeleteBlock,
  onReorderBlocks,
  onOpenAddBlock,
  onOpenPageSettings,
}: StudioCanvasProps) {
  const preset = getThemePreset(page.themeConfig?.themePreset);

  const {
    draggedBlock,
    displayBlocks,
    cursorPos,
    dragOffset,
    ghostSize,
    scrollContainerRef,
    addBlockPlaceholderRef,
    registerBlockElement,
    handlePointerDown,
    handleCardPointerMove,
    handleCardPointerUp,
    handleCardPointerCancel,
    wasJustDragged,
    isDraggingAtEnd,
  } = useBentoDnd({
    blocks,
    onReorderBlocks,
    onSelectBlock,
  });

  const getFrameWidthClass = () => {
    switch (viewportMode) {
      case "mobile":
        return "w-full max-w-[400px] rounded-[44px] border-[5px] border-neutral-800 shadow-2xl p-4 sm:p-5";
      case "tablet":
        return "w-full max-w-[660px] rounded-[36px] border-[3px] border-neutral-800 shadow-2xl p-6";
      case "desktop":
      default:
        return "w-full max-w-[820px] rounded-[28px] border border-white/10 shadow-2xl p-6 sm:p-8";
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className={`flex-1 min-h-0 w-full bg-neutral-950 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] p-4 sm:p-8 flex justify-center items-start overflow-y-auto relative ${
        draggedBlock ? "touch-none" : "touch-pan-y"
      }`}
    >
      {/* Centered Device / Viewport Frame */}
      <div
        className={`${getFrameWidthClass()} bg-neutral-950/95 backdrop-blur-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between my-4 select-none min-h-[700px]`}
      >
        {/* Mobile Notch / Speaker */}
        {viewportMode === "mobile" && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-neutral-800 rounded-full z-30 pointer-events-none" />
        )}

        {/* Ambient Glows Inside Frame */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-[450px] h-[300px] ${preset.glows.primary} blur-[120px] rounded-full transition-all duration-700`}
          />
          <div
            className={`absolute top-1/2 -right-36 w-[300px] h-[300px] ${preset.glows.secondary} blur-[130px] rounded-full transition-all duration-700`}
          />
          <div
            className={`absolute bottom-0 -left-36 w-[300px] h-[300px] ${preset.glows.tertiary} blur-[130px] rounded-full transition-all duration-700`}
          />
        </div>

        {/* Inner Content */}
        <div className="relative z-10 flex flex-col items-center w-full">
          {/* Header Preview (Clickable to Edit Page Info) */}
          <div
            onClick={onOpenPageSettings}
            title="Klik untuk mengubah avatar, bio, atau judul halaman"
            className="w-full cursor-pointer p-2 rounded-2xl hover:bg-white/[0.03] transition group border border-transparent hover:border-white/10"
          >
            <div className="flex justify-end pr-2 -mb-4 opacity-0 group-hover:opacity-100 transition">
              <span className="text-[10px] text-neutral-400 bg-neutral-900 border border-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Pencil size={10} />
                <span>Edit Header</span>
              </span>
            </div>
            <PageHeader page={page} profile={profile} isStudio />
          </div>

          {/* Bento Grid Canvas */}
          <div className="w-full mt-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <span>Blok Konten</span>
                <span className="text-[10px] text-neutral-500 font-normal">
                  ({blocks.length} item)
                </span>
              </span>
              <span className="text-[10px] text-neutral-400 flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/5">
                <GripVertical size={11} className="text-indigo-400" />
                <span>Tarik ikon pegangan atau geser kartu untuk memindahkan</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 auto-rows-auto grid-flow-dense w-full relative">
              {displayBlocks.length === 0 && (
                <div className="col-span-2 sm:col-span-4 p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-neutral-400 text-xs sm:text-sm">
                  <p className="font-semibold text-neutral-200">Halaman ini belum memiliki kartu bento.</p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Gunakan tombol di bawah untuk menambahkan tautan, gambar, peta, catatan, atau kartu bento pertama Anda.
                  </p>
                </div>
              )}

              {displayBlocks.map((block, index) => (
                <StudioGridItem
                  key={block.id}
                  block={block}
                  index={index}
                  totalBlocks={displayBlocks.length}
                  isSelected={selectedBlockId === block.id}
                  isBeingDragged={draggedBlock?.id === block.id}
                  isAnyDragging={draggedBlock !== null}
                  onRegisterRef={(el) => registerBlockElement(block.id, el)}
                  onPointerDown={handlePointerDown}
                  onCardPointerMove={handleCardPointerMove}
                  onCardPointerUp={handleCardPointerUp}
                  onCardPointerCancel={handleCardPointerCancel}
                  wasJustDragged={wasJustDragged}
                  onSelectBlock={onSelectBlock}
                  onQuickResize={onQuickResize}
                  onQuickMove={onQuickMove}
                  onDuplicateBlock={onDuplicateBlock}
                  onRequestDelete={onRequestDeleteBlock}
                />
              ))}

              {/* Add Block Placeholder Button / Drop Zone (Takes 2 or 4 cols) */}
              <div
                ref={addBlockPlaceholderRef}
                onClick={onOpenAddBlock}
                className={`col-span-2 sm:col-span-4 min-h-[72px] rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer p-4 ${
                  isDraggingAtEnd
                    ? "border-indigo-400 bg-indigo-500/20 ring-2 ring-indigo-500/50 text-indigo-300 scale-[1.01]"
                    : "border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-neutral-400 hover:text-white"
                }`}
              >
                <div
                  className={`size-8 rounded-lg flex items-center justify-center border transition ${
                    isDraggingAtEnd
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <Plus size={16} />
                </div>
                <div className="text-left">
                  <span className="text-xs font-semibold block text-neutral-200">
                    {isDraggingAtEnd
                      ? "Lepas di sini untuk memindahkan blok ke posisi akhir"
                      : "+ Tambah Blok Konten Baru"}
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    {isDraggingAtEnd
                      ? "Blok akan diletakkan di bagian paling bawah halaman"
                      : "Sematkan tautan, kartu bento, video YouTube, atau musik Spotify"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Canvas Watermark Footer */}
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-center text-[11px] text-neutral-500">
          <span>
            OpenLynk Bento Studio &bull; Halaman{" "}
            <strong className="text-neutral-400">openlynk.id/{page.slug}</strong>
          </span>
        </div>
      </div>

      {/* Floating Ghost Card during drag */}
      {draggedBlock && (
        <StudioGhostCard
          block={draggedBlock}
          cursorPos={cursorPos}
          dragOffset={dragOffset}
          ghostSize={ghostSize}
        />
      )}
    </div>
  );
}
