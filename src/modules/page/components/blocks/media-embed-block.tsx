import { ExternalLink, ArrowRight } from "lucide-react";
import { RuneIcon } from "@/components/ui/rune-icon";
import type { PageBlock } from "@/db/schema";
import { detectMediaEmbed } from "../../server/embed-helpers";
import type { PageBlockConfig } from "../../types";

interface MediaEmbedBlockProps {
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

function getSafeEmbedId(id?: string): string | null {
  if (!id) return null;
  const clean = id.trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(clean)) return null;
  return clean;
}

export function MediaEmbedBlock({
  block,
  isStudio = false,
}: MediaEmbedBlockProps) {
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
        <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 rune-glass shadow-2xl flex flex-col relative group">
          {/* Studio overlay so dragging or clicking to select is not captured by the iframe */}
          {isStudio && (
            <div className="absolute inset-0 z-20 cursor-pointer" />
          )}

          {block.title && (
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="size-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                <span className="text-xs font-semibold text-neutral-200 truncate">
                  {block.title}
                </span>
              </div>
              {!isStudio ? (
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-neutral-400 hover:text-white transition flex items-center gap-1 shrink-0"
                >
                  <span>Buka YouTube</span>
                  <ExternalLink size={12} />
                </a>
              ) : (
                <span className="text-[11px] text-neutral-500 flex items-center gap-1 shrink-0 font-mono">
                  <span>YouTube</span>
                  <ExternalLink size={12} />
                </span>
              )}
            </div>
          )}

          <div className="relative w-full aspect-video bg-black/60">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
              title={block.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className={`absolute inset-0 w-full h-full border-0 ${
                isStudio ? "pointer-events-none" : ""
              }`}
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
        <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 rune-glass shadow-xl p-1.5 relative group">
          {isStudio && (
            <div className="absolute inset-0 z-20 pointer-events-none" />
          )}

          {block.title && (
            <div className="px-3.5 py-2 flex items-center justify-between border-b border-white/5 mb-1">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-neutral-200 truncate">
                  {block.title}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Spotify</span>
            </div>
          )}

          <iframe
            src={embedUrl}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className={`rounded-xl sm:rounded-2xl border-0 ${
              isStudio ? "pointer-events-none" : ""
            }`}
          />
        </div>
      );
    }
  }

  // Fallback for custom media
  const safeFallbackUrl = getSafeHref(block.url);
  const fallbackClassName =
    "w-full min-h-[60px] px-4 py-3.5 rounded-2xl rune-glass rune-glass-hover border border-white/10 hover:border-white/20 shadow-lg transition-all duration-200 flex items-center justify-between gap-3 group select-none";

  const fallbackInner = (
    <>
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="size-10 rounded-xl bg-white/[0.08] border border-white/10 flex-shrink-0 flex items-center justify-center text-neutral-300 group-hover:text-white transition">
          <RuneIcon name="glass-video-2" type="glass" size={20} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-neutral-200 truncate">{block.title}</p>
          <p className="text-xs text-neutral-500 truncate font-mono">{safeFallbackUrl}</p>
        </div>
      </div>
      <div className="size-8 rounded-lg flex items-center justify-center text-neutral-500 group-hover:text-neutral-200 transition">
        <ArrowRight size={18} />
      </div>
    </>
  );

  if (!isStudio && safeFallbackUrl && safeFallbackUrl !== "#") {
    return (
      <a
        href={safeFallbackUrl}
        target={safeFallbackUrl.startsWith("http") ? "_blank" : undefined}
        rel={safeFallbackUrl.startsWith("http") ? "noopener noreferrer" : undefined}
        className={fallbackClassName}
      >
        {fallbackInner}
      </a>
    );
  }

  return <div className={fallbackClassName}>{fallbackInner}</div>;
}
