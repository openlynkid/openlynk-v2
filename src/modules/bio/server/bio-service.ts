"use server";

import { db } from "@/db";
import { profiles, bioBlocks, type BioBlock, type Profile } from "@/db/schema";
import { eq, and, ne, asc, sql } from "drizzle-orm";
import { profileSchema, linkBlockSchema } from "./bio-validation";
import type {
  PublicProfile,
  UpsertProfileInput,
  CreateBlockInput,
  UpdateBlockInput,
} from "../types";

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Fetch public profile and active blocks by username slug
 */
export async function getPublicProfile(
  username: string
): Promise<PublicProfile | null> {
  const cleanSlug = username.trim().toLowerCase();

  const [profile] = await db
    .select()
    .from(profiles)
    .where(
      and(
        sql`lower(${profiles.username}) = ${cleanSlug}`,
        eq(profiles.isPublished, true)
      )
    )
    .limit(1);

  if (!profile) return null;

  const blocks = await db
    .select()
    .from(bioBlocks)
    .where(
      and(eq(bioBlocks.profileId, profile.id), eq(bioBlocks.isActive, true))
    )
    .orderBy(asc(bioBlocks.sortOrder));

  return {
    ...profile,
    blocks,
  };
}

/**
 * Fetch creator profile and all blocks for dashboard management
 */
export async function getCreatorProfile(userId: string): Promise<{
  profile: Profile | null;
  blocks: BioBlock[];
}> {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (!profile) {
    return { profile: null, blocks: [] };
  }

  const blocks = await db
    .select()
    .from(bioBlocks)
    .where(eq(bioBlocks.profileId, profile.id))
    .orderBy(asc(bioBlocks.sortOrder));

  return { profile, blocks };
}

/**
 * Upsert creator profile (create initial or update existing)
 */
export async function upsertCreatorProfile(
  userId: string,
  input: UpsertProfileInput
): Promise<ServiceResult<Profile>> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Data profil tidak valid",
    };
  }

  const { username, displayName, bio, avatarUrl, socialLinks, isPublished } =
    parsed.data;

  // Check if username is taken by another user
  const [existingUserWithSlug] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(
      and(
        sql`lower(${profiles.username}) = ${username}`,
        ne(profiles.userId, userId)
      )
    )
    .limit(1);

  if (existingUserWithSlug) {
    return {
      success: false,
      error: `Username "${username}" sudah digunakan kreator lain. Silakan pilih username lain.`,
    };
  }

  const [currentProfile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (currentProfile) {
    const [updated] = await db
      .update(profiles)
      .set({
        username,
        displayName,
        bio: bio ?? null,
        avatarUrl: avatarUrl ? avatarUrl : null,
        socialLinks: socialLinks ?? {},
        isPublished: isPublished ?? true,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, currentProfile.id))
      .returning();

    return { success: true, data: updated };
  } else {
    const [created] = await db
      .insert(profiles)
      .values({
        id: crypto.randomUUID(),
        userId,
        username,
        displayName,
        bio: bio ?? null,
        avatarUrl: avatarUrl ? avatarUrl : null,
        socialLinks: socialLinks ?? {},
        isPublished: isPublished ?? true,
        isVerified: false,
        themeConfig: { themePreset: "obsidian", accentColor: "#6366f1" },
      })
      .returning();

    return { success: true, data: created };
  }
}

/**
 * Create a new link block
 */
export async function createLinkBlock(
  userId: string,
  input: CreateBlockInput
): Promise<ServiceResult<BioBlock>> {
  const [profile] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (!profile) {
    return {
      success: false,
      error: "Profil belum dibuat. Silakan buat profil terlebih dahulu.",
    };
  }

  const parsed = linkBlockSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Data tautan tidak valid",
    };
  }

  const [lastBlock] = await db
    .select({ maxOrder: bioBlocks.sortOrder })
    .from(bioBlocks)
    .where(eq(bioBlocks.profileId, profile.id))
    .orderBy(sql`${bioBlocks.sortOrder} DESC`)
    .limit(1);

  const nextOrder = (lastBlock?.maxOrder ?? -1) + 1;

  const [newBlock] = await db
    .insert(bioBlocks)
    .values({
      id: crypto.randomUUID(),
      profileId: profile.id,
      type: "link",
      title: parsed.data.title,
      url: parsed.data.url,
      iconName: parsed.data.iconName ?? null,
      sortOrder: nextOrder,
      isActive: true,
    })
    .returning();

  return { success: true, data: newBlock };
}

/**
 * Update an existing link block
 */
export async function updateLinkBlock(
  userId: string,
  blockId: string,
  input: UpdateBlockInput
): Promise<ServiceResult<BioBlock>> {
  const [profile] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (!profile) {
    return { success: false, error: "Profil tidak ditemukan" };
  }

  const [block] = await db
    .select()
    .from(bioBlocks)
    .where(
      and(eq(bioBlocks.id, blockId), eq(bioBlocks.profileId, profile.id))
    )
    .limit(1);

  if (!block) {
    return { success: false, error: "Tautan tidak ditemukan" };
  }

  const updateData: Partial<BioBlock> = {
    updatedAt: new Date(),
  };

  if (input.title !== undefined) updateData.title = input.title.trim();
  if (input.url !== undefined) updateData.url = input.url.trim();
  if (input.iconName !== undefined) updateData.iconName = input.iconName;
  if (input.isActive !== undefined) updateData.isActive = input.isActive;

  const [updated] = await db
    .update(bioBlocks)
    .set(updateData)
    .where(eq(bioBlocks.id, blockId))
    .returning();

  return { success: true, data: updated };
}

/**
 * Delete a link block
 */
export async function deleteLinkBlock(
  userId: string,
  blockId: string
): Promise<ServiceResult<{ id: string }>> {
  const [profile] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (!profile) {
    return { success: false, error: "Profil tidak ditemukan" };
  }

  const [deleted] = await db
    .delete(bioBlocks)
    .where(
      and(eq(bioBlocks.id, blockId), eq(bioBlocks.profileId, profile.id))
    )
    .returning({ id: bioBlocks.id });

  if (!deleted) {
    return { success: false, error: "Tautan tidak ditemukan atau sudah dihapus" };
  }

  return { success: true, data: deleted };
}

/**
 * Reorder link blocks
 */
export async function reorderLinkBlocks(
  userId: string,
  orderedBlockIds: string[]
): Promise<ServiceResult<boolean>> {
  const [profile] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (!profile) {
    return { success: false, error: "Profil tidak ditemukan" };
  }

  // Update sortOrder sequentially
  for (let i = 0; i < orderedBlockIds.length; i++) {
    const blockId = orderedBlockIds[i];
    await db
      .update(bioBlocks)
      .set({ sortOrder: i, updatedAt: new Date() })
      .where(
        and(eq(bioBlocks.id, blockId), eq(bioBlocks.profileId, profile.id))
      );
  }

  return { success: true, data: true };
}
