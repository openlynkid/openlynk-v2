import { SocialIcon } from "@/components/ui/social-icon";
import type { PageBlock } from "@/db/schema";
import type { PageBlockConfig } from "../../types";

interface SocialRowBlockProps {
  block: PageBlock;
  isStudio?: boolean;
}

const DEFAULT_PLATFORMS = [
  { key: "instagram", label: "Instagram", url: "https://instagram.com" },
  { key: "github", label: "GitHub", url: "https://github.com" },
  { key: "twitter", label: "X / Twitter", url: "https://x.com" },
  { key: "youtube", label: "YouTube", url: "https://youtube.com" },
  { key: "tiktok", label: "TikTok", url: "https://tiktok.com" },
  { key: "whatsapp", label: "WhatsApp", url: "https://wa.me" },
];

export function SocialRowBlock({
  block,
  isStudio = false,
}: SocialRowBlockProps) {
  const config = (block.config ?? {}) as PageBlockConfig;
  const userSocialLinks = config.socialLinks ?? {};

  // Build active platforms list
  const activePlatforms = Object.entries(userSocialLinks)
    .filter(([, url]) => typeof url === "string" && url.trim().length > 0)
    .map(([key, url]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      url: url.trim(),
    }));

  const displayList = activePlatforms.length > 0 ? activePlatforms : DEFAULT_PLATFORMS.slice(0, 4);

  return (
    <div className="relative w-full h-full min-h-[110px] p-4 sm:p-5 rounded-2xl sm:rounded-3xl rune-glass rune-glass-hover border border-white/10 hover:border-white/20 shadow-xl flex flex-col justify-between overflow-hidden group select-none transition-all duration-300">
      {/* Background ambient glow */}
      <div className="absolute -top-10 -right-10 size-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
          {block.title || "Sosial Media"}
        </span>
        <span className="text-[10px] text-neutral-500 font-mono">
          {displayList.length} platform
        </span>
      </div>

      {/* Social Icons Row / Grid */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 relative z-10">
        {displayList.map((item) => {
          const buttonElement = (
            <div
              key={item.key}
              title={item.label}
              className="size-10 sm:size-11 rounded-xl sm:rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.18] border border-white/10 hover:border-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm cursor-pointer group/btn"
            >
              <SocialIcon platform={item.key} size={20} />
            </div>
          );

          if (!isStudio && item.url && item.url !== "#") {
            return (
              <a
                key={item.key}
                href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {buttonElement}
              </a>
            );
          }

          return buttonElement;
        })}
      </div>
    </div>
  );
}
