"use client";

import { RuneIcon } from "runeicons-react";
import type { Page, PageBlock, Profile } from "@/db/schema";
import { getThemePreset } from "../../types/themes";
import { PageHeader } from "../page-header";
import { PageCard } from "../page-card";
import { getBentoBlockSpan } from "../bento-grid";
import type { ViewportMode } from "./studio-header";

interface StudioCanvasProps {
  page: Page;
  profile: Profile;
  blocks: PageBlock[];
  viewportMode: ViewportMode;
  selectedBlockId: string | null;
  onSelectBlock: (block: PageBlock) => void;
  onQuickResize: (blockId: string, colSpan: number, rowSpan: number) => void;
  onQuickMove: (blockId: string, direction: "up" | "down") => void;
  onQuickDelete: (blockId: string) => void;
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
  onQuickDelete,
  onOpenAddBlock,
  onOpenPageSettings,
}: StudioCanvasProps) {
  const preset = getThemePreset(page.themeConfig?.themePreset);

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
    <div className="flex-1 w-full min-h-[calc(100vh-4rem)] bg-neutral-950 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] p-4 sm:p-8 flex justify-center items-start overflow-y-auto relative">
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
                <RuneIcon name="glass-edit-pen" type="glass" size={10} />
                <span>Edit Header</span>
              </span>
            </div>
            <PageHeader page={page} profile={profile} />
          </div>

          {/* Bento Grid Canvas */}
          <div className="w-full mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 auto-rows-auto w-full">
              {blocks.map((block, index) => {
                const isSelected = selectedBlockId === block.id;
                const spanClass = getBentoBlockSpan(block);

                return (
                  <div
                    key={block.id}
                    className={`${spanClass} relative group transition-all duration-200 min-w-0`}
                  >
                    {/* Block Card Container */}
                    <div
                      onClick={() => onSelectBlock(block)}
                      className={`w-full h-full cursor-pointer rounded-2xl transition-all duration-200 relative ${
                        isSelected
                          ? "ring-2 ring-indigo-500 shadow-indigo-500/20 shadow-xl scale-[1.01]"
                          : "hover:ring-1 hover:ring-white/30"
                      } ${!block.isActive ? "opacity-50 grayscale-[40%]" : ""}`}
                    >
                      <PageCard block={block} />
                    </div>

                    {/* Contextual Floating Toolbar on Hover */}
                    <div className="absolute -top-3.5 right-2 opacity-0 group-hover:opacity-100 transition-all duration-150 z-20 flex items-center gap-1 bg-neutral-900/95 border border-white/20 p-1 rounded-xl shadow-2xl backdrop-blur-md">
                      {/* Quick Resize if bento_card */}
                      {block.type === "bento_card" && (
                        <div className="flex items-center gap-0.5 border-r border-white/10 pr-1 mr-0.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickResize(block.id, 1, 1);
                            }}
                            title="Ubah ke 1x1 Kotak"
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                              block.colSpan === 1 && block.rowSpan === 1
                                ? "bg-indigo-600 text-white"
                                : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            1x1
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickResize(block.id, 2, 1);
                            }}
                            title="Ubah ke 2x1 Lebar"
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                              block.colSpan === 2 && block.rowSpan === 1
                                ? "bg-indigo-600 text-white"
                                : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            2x1
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickResize(block.id, 2, 2);
                            }}
                            title="Ubah ke 2x2 Besar"
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                              block.colSpan === 2 && block.rowSpan === 2
                                ? "bg-indigo-600 text-white"
                                : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            2x2
                          </button>
                        </div>
                      )}

                      {/* Move Up / Down */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickMove(block.id, "up");
                        }}
                        title="Geser ke Atas"
                        className="size-6 rounded flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-20 transition"
                      >
                        ▲
                      </button>

                      <button
                        type="button"
                        disabled={index === blocks.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickMove(block.id, "down");
                        }}
                        title="Geser ke Bawah"
                        className="size-6 rounded flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-20 transition"
                      >
                        ▼
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBlock(block);
                        }}
                        title="Edit Properti Blok"
                        className="size-6 rounded flex items-center justify-center text-indigo-400 hover:text-indigo-300 transition"
                      >
                        <RuneIcon name="glass-edit-pen" type="glass" size={12} />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Hapus blok ini dari kanvas?")) {
                            onQuickDelete(block.id);
                          }
                        }}
                        title="Hapus Blok"
                        className="size-6 rounded flex items-center justify-center text-red-400 hover:text-red-300 transition"
                      >
                        <RuneIcon name="glass-trash" type="glass" size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add Block Placeholder Button (Takes 2 or 4 cols) */}
              <div
                onClick={onOpenAddBlock}
                className="col-span-2 sm:col-span-4 min-h-[72px] rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-neutral-400 hover:text-white p-4"
              >
                <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <RuneIcon name="glass-plus" type="glass" size={16} />
                </div>
                <div className="text-left">
                  <span className="text-xs font-semibold block text-neutral-200">
                    + Tambah Blok Konten Baru
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    Sematkan tautan, kartu bento, video YouTube, atau musik Spotify
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
    </div>
  );
}
