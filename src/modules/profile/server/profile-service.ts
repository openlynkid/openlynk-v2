"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profiles, pages, type Profile } from "@/db/schema";
import { eq, and, ne, sql } from "drizzle-orm";
import { profileSchema } from "./profile-validation";
import type { UpsertProfileInput } from "../types";

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Helper internal untuk memverifikasi autentikasi pengguna pemanggil server action
 */
async function getAuthenticatedUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user ?? null;
  } catch {
    return null;
  }
}

/**
 * Get creator account profile by auth userId
 */
export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  return profile || null;
}

/**
 * Upsert account profile (create or update user identity)
 */
export async function upsertProfile(
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

  // Security Guard: Verifikasi identitas pemanggil
  const currentUser = await getAuthenticatedUser();
  if (!currentUser) {
    return {
      success: false,
      error: "Tidak terautentikasi: Sesi login diperlukan.",
    };
  }

  if (currentUser.id !== userId) {
    return {
      success: false,
      error: "Akses ditolak: Anda tidak memiliki izin untuk akun ini.",
    };
  }

  const { username, displayName, bio, avatarUrl, socialLinks } = parsed.data;

  const [currentProfile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  // Check username collision with other profiles
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
      error: `Username "${username}" sudah digunakan akun lain. Silakan pilih username lain.`,
    };
  }

  // Cross-namespace collision: Pastikan username tidak dipakai sebagai slug halaman oleh akun lain
  const [existingPageWithSlug] = await db
    .select({ id: pages.id, profileId: pages.profileId })
    .from(pages)
    .where(sql`lower(${pages.slug}) = ${username}`)
    .limit(1);

  if (existingPageWithSlug) {
    if (!currentProfile || existingPageWithSlug.profileId !== currentProfile.id) {
      return {
        success: false,
        error: `Username "${username}" tidak dapat digunakan karena sudah dipakai sebagai slug halaman oleh akun lain.`,
      };
    }
  }

  if (currentProfile) {
    const [updated] = await db
      .update(profiles)
      .set({
        username,
        displayName,
        bio: bio ?? null,
        avatarUrl: avatarUrl ? avatarUrl : null,
        socialLinks: socialLinks ?? {},
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, currentProfile.id))
      .returning();

    return { success: true, data: updated };
  } else {
    const profileId = crypto.randomUUID();
    const [created] = await db
      .insert(profiles)
      .values({
        id: profileId,
        userId,
        username,
        displayName,
        bio: bio ?? null,
        avatarUrl: avatarUrl ? avatarUrl : null,
        socialLinks: socialLinks ?? {},
        isVerified: false,
      })
      .returning();

    // Auto-create initial default page for the new profile
    await db.insert(pages).values({
      id: crypto.randomUUID(),
      profileId,
      title: displayName,
      slug: username,
      description: bio ?? null,
      avatarUrl: avatarUrl ? avatarUrl : null,
      themeConfig: { themePreset: "obsidian", accentColor: "#6366f1" },
      isDefault: true,
      isPublished: true,
    });

    return { success: true, data: created };
  }
}
