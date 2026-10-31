import type { Page, PageBlock, Profile } from "@/db/schema";

export * from "./themes";

export type ThemeConfig = {
  themePreset: string;
  accentColor: string;
};

export type PublicPageData = Page & {
  profile: Profile;
  blocks: PageBlock[];
};

export type CreatePageInput = {
  title: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  isDefault?: boolean;
};

export type UpdatePageInput = {
  title?: string;
  slug?: string;
  description?: string;
  avatarUrl?: string;
  themeConfig?: ThemeConfig;
  isDefault?: boolean;
  isPublished?: boolean;
};

export type PageBlockType =
  | "link"
  | "bento_card"
  | "social_row"
  | "header_text"
  | "media_embed";

export type PageBlockConfig = {
  embedType?: "youtube" | "spotify";
  embedId?: string;
  subtitle?: string;
  badgeText?: string;
  accentGlow?: string;
};

export type CreatePageBlockInput = {
  type?: PageBlockType;
  title: string;
  url: string;
  iconName?: string;
  colSpan?: number;
  rowSpan?: number;
  config?: PageBlockConfig;
};

export type UpdatePageBlockInput = {
  type?: PageBlockType;
  title?: string;
  url?: string;
  iconName?: string;
  colSpan?: number;
  rowSpan?: number;
  config?: PageBlockConfig;
  isActive?: boolean;
};
