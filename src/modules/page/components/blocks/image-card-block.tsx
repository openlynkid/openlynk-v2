import { ArrowUpRight, Image as ImageIcon } from "lucide-react";
import type { PageBlock } from "@/db/schema";
import type { PageBlockConfig } from "../../types";

interface ImageCardBlockProps {
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

export function ImageCardBlock({
  block,
  isStudio = false,
}: ImageCardBlockProps) {
  const config = (block.config ?? {}) as PageBlockConfig;
  const imageUrl = config.imageUrl || block.url;
  const isLarge = (block.colSpan ?? 1) >= 2;
  const safeLink = getSafeHref(block.url);

  const cardContent = (
    <div
      className={`relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-white/25 shadow-xl group select-none transition-all duration-300 flex flex-col justify-end p-4 sm:p-5 ${
        isLarge ? "min-h-[220px]" : "min-h-[140px]"
      }`}
    >
      {/* Background Image / Placeholder */}
      {imageUrl && imageUrl.startsWith("http") ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={config.imageAlt || block.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Gradient Overlay for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-neutral-900/90 flex flex-col items-center justify-center text-neutral-600 gap-2 p-4">
          <ImageIcon size={32} />
          <span className="text-[11px] text-neutral-500 font-mono">Belum ada foto</span>
        </div>
      )}

      {/* Top Floating Link Button */}
      {safeLink && safeLink !== "#" && (
        <div className="absolute top-3 right-3 z-10 size-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition duration-300">
          <ArrowUpRight size={15} />
        </div>
      )}

      {/* Bottom Text Content */}
      <div className="relative z-10">
        <h3 className="font-semibold text-sm sm:text-base text-white line-clamp-1 drop-shadow-md">
          {block.title}
        </h3>
        {config.subtitle && (
          <p className="text-xs text-neutral-300 mt-0.5 line-clamp-2 drop-shadow-sm leading-relaxed">
            {config.subtitle}
          </p>
        )}
      </div>
    </div>
  );

  if (!isStudio && safeLink && safeLink !== "#") {
    return (
      <a
        href={safeLink}
        target={safeLink.startsWith("http") ? "_blank" : undefined}
        rel={safeLink.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block w-full h-full"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
