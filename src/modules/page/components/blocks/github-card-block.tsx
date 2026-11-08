import { Star, GitFork, ExternalLink } from "lucide-react";
import { SocialIcon } from "@/components/ui/social-icon";
import type { PageBlock } from "@/db/schema";
import type { PageBlockConfig } from "../../types";

interface GitHubCardBlockProps {
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

export function GitHubCardBlock({
  block,
  isStudio = false,
}: GitHubCardBlockProps) {
  const config = (block.config ?? {}) as PageBlockConfig;
  const repoName = config.repoName || block.title;
  const stars = config.repoStars ?? 128;
  const language = config.repoLanguage || "TypeScript";
  const safeUrl = getSafeHref(block.url || `https://github.com/${repoName}`);

  const cardContent = (
    <div className="relative w-full h-full min-h-[140px] p-5 rounded-2xl sm:rounded-3xl rune-glass rune-glass-hover border border-white/10 hover:border-white/25 shadow-xl flex flex-col justify-between overflow-hidden group select-none transition-all duration-300">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 size-36 rounded-full bg-neutral-700/10 blur-3xl pointer-events-none group-hover:bg-neutral-600/20 transition-all duration-500" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="size-10 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition duration-300">
            <SocialIcon platform="github" size={20} />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 font-mono block">github.com</span>
            <span className="text-xs font-semibold text-white truncate block">
              {repoName}
            </span>
          </div>
        </div>

        <div className="size-7 rounded-lg flex items-center justify-center text-neutral-500 group-hover:text-white transition">
          <ExternalLink size={15} />
        </div>
      </div>

      {/* Middle Description */}
      <div className="relative z-10 my-2">
        <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
          {config.subtitle || block.title}
        </p>
      </div>

      {/* Bottom Stats Row */}
      <div className="relative z-10 pt-2 border-t border-white/5 flex items-center gap-4 text-xs text-neutral-400">
        {/* Language Badge */}
        <div className="flex items-center gap-1.5 font-medium">
          <span className="size-2 rounded-full bg-blue-400" />
          <span>{language}</span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 font-mono text-neutral-300">
          <Star size={13} className="text-amber-400 fill-amber-400" />
          <span>{stars}</span>
        </div>

        {/* Fork icon */}
        <div className="flex items-center gap-1 font-mono text-neutral-400">
          <GitFork size={13} />
          <span>forks</span>
        </div>
      </div>
    </div>
  );

  if (!isStudio && safeUrl && safeUrl !== "#") {
    return (
      <a
        href={safeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
