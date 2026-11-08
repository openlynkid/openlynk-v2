import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { SocialIcon } from "@/components/ui/social-icon";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { Page, Profile } from "@/db/schema";
import type { SocialLinks } from "@/modules/profile";
import { getThemePreset } from "../types/themes";

interface PageHeaderProps {
  page: Page;
  profile: Profile;
  isStudio?: boolean;
}

export function PageHeader({
  page,
  profile,
  isStudio = false,
}: PageHeaderProps) {
  const social = (profile.socialLinks ?? {}) as SocialLinks;
  const avatar = page.avatarUrl || profile.avatarUrl;
  const displayName = page.title || profile.displayName;
  const description = page.description || profile.bio;
  const preset = getThemePreset(page.themeConfig?.themePreset);

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "OL";

  return (
    <div className="flex flex-col items-center text-center w-full max-w-md mx-auto">
      {/* Avatar Container with Theme Glow Ring */}
      <div className="relative group mb-4">
        <div
          className={`absolute -inset-1 rounded-full bg-gradient-to-tr ${preset.swatchGradient} blur-md opacity-60 group-hover:opacity-100 transition duration-500`}
        />
        <div className="relative size-24 sm:size-28 rounded-full bg-neutral-900 border-2 border-white/15 overflow-hidden flex items-center justify-center shadow-2xl">
          {avatar ? (
            <Image
              src={avatar}
              alt={displayName}
              width={112}
              height={112}
              className="size-full object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-neutral-300 font-bold text-2xl tracking-wider">
              {initials}
            </div>
          )}
        </div>
      </div>

      {/* Page Title & Verified Badge */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {displayName}
        </h1>
        {profile.isVerified && (
          <Tooltip>
            <TooltipTrigger
              render={
                <span
                  title="Akun Terverifikasi OpenLynk"
                  className="inline-flex items-center justify-center text-indigo-400 cursor-help"
                />
              }
            >
              <BadgeCheck size={20} />
            </TooltipTrigger>
            <TooltipContent>Kreator Terverifikasi OpenLynk</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Author Handle & Page Slug */}
      <p className="text-xs sm:text-sm font-medium text-neutral-400 mt-1 flex items-center justify-center gap-1">
        <span>oleh</span>
        <strong className="text-neutral-200">@{profile.username}</strong>
        {page.slug !== profile.username && (
          <span className="text-neutral-500 font-mono text-xs">({page.slug})</span>
        )}
      </p>

      {/* Description */}
      {description && (
        <p className="text-xs sm:text-sm text-neutral-300/90 max-w-md mt-3 leading-relaxed whitespace-pre-line px-2 font-normal text-balance">
          {description}
        </p>
      )}

      {/* Social Links Row with Tooltips */}
      {social && Object.keys(social).length > 0 && (
        <div
          className={`flex items-center justify-center gap-2.5 mt-4 flex-wrap ${
            isStudio ? "pointer-events-none" : ""
          }`}
        >
          {social.instagram && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href={`https://instagram.com/${social.instagram.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="size-10 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-95 shadow-sm"
                  />
                }
              >
                <SocialIcon platform="instagram" size={18} />
              </TooltipTrigger>
              <TooltipContent>Instagram</TooltipContent>
            </Tooltip>
          )}

          {social.tiktok && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href={`https://tiktok.com/@${social.tiktok.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="size-10 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-95 shadow-sm"
                  />
                }
              >
                <SocialIcon platform="tiktok" size={18} />
              </TooltipTrigger>
              <TooltipContent>TikTok</TooltipContent>
            </Tooltip>
          )}

          {social.youtube && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href={
                      social.youtube.startsWith("http")
                        ? social.youtube
                        : `https://youtube.com/${social.youtube}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="size-10 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-95 shadow-sm"
                  />
                }
              >
                <SocialIcon platform="youtube" size={18} />
              </TooltipTrigger>
              <TooltipContent>YouTube</TooltipContent>
            </Tooltip>
          )}

          {social.twitter && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href={`https://x.com/${social.twitter.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X / Twitter"
                    className="size-10 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-95 shadow-sm"
                  />
                }
              >
                <SocialIcon platform="x" size={18} />
              </TooltipTrigger>
              <TooltipContent>X / Twitter</TooltipContent>
            </Tooltip>
          )}

          {social.github && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href={`https://github.com/${social.github.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="size-10 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-95 shadow-sm"
                  />
                }
              >
                <SocialIcon platform="github" size={18} />
              </TooltipTrigger>
              <TooltipContent>GitHub</TooltipContent>
            </Tooltip>
          )}

          {social.whatsapp && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href={`https://wa.me/${social.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="size-10 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-95 shadow-sm"
                  />
                }
              >
                <SocialIcon platform="whatsapp" size={18} />
              </TooltipTrigger>
              <TooltipContent>WhatsApp</TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
}
