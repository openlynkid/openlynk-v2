import type { Page, PageBlock, Profile } from "@/db/schema";

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
  isDefault?: boolean;
  isPublished?: boolean;
};

export type CreatePageBlockInput = {
  title: string;
  url: string;
  iconName?: string;
  colSpan?: number;
  rowSpan?: number;
};

export type UpdatePageBlockInput = {
  title?: string;
  url?: string;
  iconName?: string;
  colSpan?: number;
  rowSpan?: number;
  isActive?: boolean;
};
