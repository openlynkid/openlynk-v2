import { RuneIcon } from "runeicons-react";
import type { PageBlock } from "@/db/schema";
import { detectMediaEmbed } from "../../server/embed-helpers";
import type { PageBlockConfig } from "../../types";

interface MediaEmbedBlockProps {
  block: PageBlock;
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

function getSafeEmbedId(id?: string): string | null {
  if (!id) return null;
  const clean = id.trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(clean)) return null;
  return clean;
}

export function MediaEmbedBlock({ block }: MediaEmbedBlockProps) {
  const config = (block.config ?? {}) as PageBlockConfig;
  const detected = detectMediaEmbed(block.url);

  // 1. YouTube Player
  if (
    detected?.platform === "youtube" ||
    config.embedType === "youtube" ||
    config.embedId
  ) {
    const rawVideoId =
      detected?.platform === "youtube" ? detected.videoId : config.embedId;
    const videoId = getSafeEmbedId(rawVideoId);

    if (videoId) {
      return (
        <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-neutral-900/50 backdrop-blur-xl shadow-xl flex flex-col">
          {block.title && (
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-medium text-neutral-300 truncate">
                  {block.title}
                </span>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-neutral-400 hover:text-white transition flex items-center gap-1"
              >
                <span>Buka di YouTube</span>
                <RuneIcon name="glass-arrow-right-circle" type="glass" size={12} />
              </a>
            </div>
          )}
          <div className="relative w-full aspect-video bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
              title={block.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        </div>
      );
    }
  }

  // 2. Spotify Player
  if (
    detected?.platform === "spotify" ||
    config.embedType === "spotify"
  ) {
    const safeSpotifyId = getSafeEmbedId(config.embedId);
    const embedUrl =
      detected?.platform === "spotify"
        ? detected.embedUrl
        : safeSpotifyId
          ? `https://open.spotify.com/embed/track/${safeSpotifyId}`
          : null;

    if (embedUrl) {
      return (
        <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/60 backdrop-blur-xl shadow-lg p-1">
          {block.title && (
            <div className="px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-neutral-300">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="truncate">{block.title}</span>
            </div>
          )}
          <iframe
            src={embedUrl}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl border-0"
          />
        </div>
      );
    }
  }

  // Fallback if URL is not a recognized media embed
  const safeFallbackUrl = getSafeHref(block.url);
  return (
    <a
      href={safeFallbackUrl}
      target={safeFallbackUrl.startsWith("http") ? "_blank" : undefined}
      rel={safeFallbackUrl.startsWith("http") ? "noopener noreferrer" : undefined}
      className="w-full min-h-[56px] px-4 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/10 hover:border-white/20 backdrop-blur-xl shadow-lg transition-all duration-200 flex items-center justify-between gap-3 group select-none"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="size-10 rounded-xl bg-white/[0.04] border border-white/10 flex-shrink-0 flex items-center justify-center text-neutral-300">
          <RuneIcon name="glass-video-recorder" type="glass" size={20} />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm text-neutral-200 truncate">{block.title}</p>
          <p className="text-xs text-neutral-500 truncate">{safeFallbackUrl}</p>
        </div>
      </div>
      <div className="size-8 rounded-lg flex items-center justify-center text-neutral-500 group-hover:text-neutral-200 transition">
        <RuneIcon name="glass-arrow-right-circle" type="glass" size={18} />
      </div>
    </a>
  );
}
