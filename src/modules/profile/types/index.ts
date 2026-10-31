export type { Profile } from "@/db/schema";

export type SocialLinks = {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  whatsapp?: string;
};

export type UpsertProfileInput = {
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: SocialLinks;
};
