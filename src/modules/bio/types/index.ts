import type { Profile, BioBlock } from "@/db/schema";

export type SocialLinks = {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  whatsapp?: string;
};

export type ThemeConfig = {
  themePreset: string;
  accentColor: string;
};

export type PublicProfile = Profile & {
  blocks: BioBlock[];
};

export type UpsertProfileInput = {
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: SocialLinks;
  isPublished?: boolean;
};

export type CreateBlockInput = {
  title: string;
  url: string;
  iconName?: string;
};

export type UpdateBlockInput = {
  title?: string;
  url?: string;
  iconName?: string;
  isActive?: boolean;
};
