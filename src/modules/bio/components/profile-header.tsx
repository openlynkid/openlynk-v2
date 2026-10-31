import Image from "next/image";
import { RuneIcon } from "runeicons-react";
import type { Profile } from "@/db/schema";
import type { SocialLinks } from "../types";

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const social = (profile.socialLinks ?? {}) as SocialLinks;
  const initials = profile.displayName
    ? profile.displayName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "OL";

  return (
    <div className="flex flex-col items-center text-center w-full max-w-md mx-auto">
      {/* Avatar Container with Glow Ring */}
      <div className="relative group mb-4">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-cyan-500/40 blur-md opacity-70 group-hover:opacity-100 transition duration-500" />
        <div className="relative size-24 sm:size-28 rounded-full bg-neutral-900 border-2 border-white/15 overflow-hidden flex items-center justify-center shadow-2xl">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.displayName}
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

      {/* Name & Verified Badge */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {profile.displayName}
        </h1>
        {profile.isVerified && (
          <span
            title="Kreator Terverifikasi OpenLynk"
            className="inline-flex items-center justify-center text-indigo-400"
          >
            <RuneIcon name="glass-badge-check" type="glass" size={20} />
          </span>
        )}
      </div>

      {/* Username Handle */}
      <p className="text-xs sm:text-sm font-medium text-neutral-400 mt-0.5">
        @{profile.username}
      </p>

      {/* Bio Description */}
      {profile.bio && (
        <p className="text-sm text-neutral-300/90 max-w-sm mt-3 leading-relaxed whitespace-pre-line px-2 font-normal">
          {profile.bio}
        </p>
      )}

      {/* Social Links Row */}
      {social && Object.keys(social).length > 0 && (
        <div className="flex items-center justify-center gap-2.5 mt-4 flex-wrap">
          {social.instagram && (
            <a
              href={`https://instagram.com/${social.instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="size-10 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-95"
            >
              <RuneIcon name="glass-camera" type="glass" size={18} />
            </a>
          )}

          {social.tiktok && (
            <a
              href={`https://tiktok.com/@${social.tiktok.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="size-10 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-95"
            >
              <RuneIcon name="glass-play-circle" type="glass" size={18} />
            </a>
          )}

          {social.youtube && (
            <a
              href={
                social.youtube.startsWith("http")
                  ? social.youtube
                  : `https://youtube.com/${social.youtube}`
              }
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="size-10 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-95"
            >
              <RuneIcon name="glass-video" type="glass" size={18} />
            </a>
          )}

          {social.twitter && (
            <a
              href={`https://x.com/${social.twitter.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
              className="size-10 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-95"
            >
              <RuneIcon name="glass-message" type="glass" size={18} />
            </a>
          )}

          {social.github && (
            <a
              href={`https://github.com/${social.github.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="size-10 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-95"
            >
              <RuneIcon name="glass-code" type="glass" size={18} />
            </a>
          )}

          {social.whatsapp && (
            <a
              href={`https://wa.me/${social.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="size-10 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] flex items-center justify-center text-neutral-300 hover:text-white transition active:scale-95"
            >
              <RuneIcon name="glass-phone" type="glass" size={18} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
