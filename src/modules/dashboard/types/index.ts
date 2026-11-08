import type { Page, Profile } from "@/db/schema";

export interface DashboardUserProps {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
}

export interface DashboardPageSummary extends Page {
  blocksCount: number;
}

export interface DashboardStats {
  totalPages: number;
  totalBlocks: number;
  totalLinks: number;
  isPublished: boolean;
}

export interface CreatorChecklist {
  hasProfile: boolean;
  hasBio: boolean;
  hasAvatar: boolean;
  hasSocials: boolean;
  hasPages: boolean;
  hasBlocks: boolean;
  completedCount: number;
  totalCount: number;
  percentage: number;
}

export interface DashboardOverviewData {
  user: DashboardUserProps;
  profile: Profile;
  pages: DashboardPageSummary[];
  primaryPage: DashboardPageSummary | null;
  stats: DashboardStats;
  checklist: CreatorChecklist;
}
