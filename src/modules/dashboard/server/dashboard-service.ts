import { db } from "@/db";
import { pages, pageBlocks, type PageBlock } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { getProfileByUserId, upsertProfile } from "@/modules/profile";
import type {
  DashboardOverviewData,
  DashboardPageSummary,
  DashboardStats,
  CreatorChecklist,
  DashboardUserProps,
} from "../types";

export async function getDashboardOverviewData(
  user: DashboardUserProps
): Promise<DashboardOverviewData> {
  // 1. Get or initialize creator profile
  let profile = await getProfileByUserId(user.id);

  if (!profile) {
    const rawUsername = (user.email.split("@")[0] || "user")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");
    const safeUsername =
      rawUsername.length >= 3 ? rawUsername : `user_${user.id.slice(0, 4)}`;

    const res = await upsertProfile(user.id, {
      username: safeUsername,
      displayName: user.name || "Kreator OpenLynk",
    });

    if (res.success) {
      profile = res.data;
    } else {
      // Fallback object if upsert failed for edge cases
      profile = {
        id: `temp_${user.id}`,
        userId: user.id,
        username: safeUsername,
        displayName: user.name || "Kreator OpenLynk",
        bio: null,
        avatarUrl: null,
        isVerified: false,
        socialLinks: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  // 2. Fetch all pages owned by this profile
  const userPages = await db
    .select()
    .from(pages)
    .where(eq(pages.profileId, profile.id))
    .orderBy(sql`${pages.isDefault} DESC`, sql`${pages.createdAt} DESC`);

  // 3. Fetch all blocks across user's pages
  const pageIds = userPages.map((p) => p.id);
  let allBlocks: PageBlock[] = [];
  if (pageIds.length > 0) {
    allBlocks = await db
      .select()
      .from(pageBlocks)
      .where(inArray(pageBlocks.pageId, pageIds));
  }

  // 4. Compute block metrics
  const blocksCountByPageId = new Map<string, number>();
  let totalLinks = 0;
  for (const b of allBlocks) {
    if (b.isActive) {
      blocksCountByPageId.set(
        b.pageId,
        (blocksCountByPageId.get(b.pageId) || 0) + 1
      );
      if (b.type === "link" || b.type === "social_row") {
        totalLinks++;
      }
    }
  }

  const socialLinksObj = (profile.socialLinks as Record<string, string>) || {};
  const socialCount = Object.values(socialLinksObj).filter((v) =>
    Boolean(v && v.trim())
  ).length;
  totalLinks += socialCount;

  const pagesWithBlocks: DashboardPageSummary[] = userPages.map((p) => ({
    ...p,
    blocksCount: blocksCountByPageId.get(p.id) || 0,
  }));

  const primaryPage =
    pagesWithBlocks.find((p) => p.isDefault) || pagesWithBlocks[0] || null;

  // 5. Checklist computation
  const hasProfile = Boolean(profile.username);
  const hasBio = Boolean(profile.bio && profile.bio.trim().length > 0);
  const hasAvatar = Boolean(profile.avatarUrl && profile.avatarUrl.trim().length > 0);
  const hasSocials = socialCount > 0;
  const hasPages = userPages.length > 0;
  const hasBlocks = allBlocks.filter((b) => b.isActive).length >= 3;

  const checklistItems = [
    hasProfile,
    hasBio,
    hasAvatar,
    hasSocials,
    hasPages,
    hasBlocks,
  ];
  const completedCount = checklistItems.filter(Boolean).length;
  const totalCount = checklistItems.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const checklist: CreatorChecklist = {
    hasProfile,
    hasBio,
    hasAvatar,
    hasSocials,
    hasPages,
    hasBlocks,
    completedCount,
    totalCount,
    percentage,
  };

  const stats: DashboardStats = {
    totalPages: userPages.length,
    totalBlocks: allBlocks.filter((b) => b.isActive).length,
    totalLinks,
    isPublished: userPages.some((p) => p.isPublished),
  };

  return {
    user,
    profile,
    pages: pagesWithBlocks,
    primaryPage,
    stats,
    checklist,
  };
}
