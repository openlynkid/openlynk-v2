"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  pages,
  pageBlocks,
  profiles,
  type Page,
  type PageBlock,
} from "@/db/schema";
import { eq, and, ne, asc, sql } from "drizzle-orm";
import {
  createPageSchema,
  updatePageSchema,
  pageBlockSchema,
  updatePageBlockSchema,
  reorderBlocksSchema,
} from "./page-validation";
import type {
  PublicPageData,
  CreatePageInput,
  UpdatePageInput,
  CreatePageBlockInput,
  UpdatePageBlockInput,
} from "../types";

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Security Guard: Memverifikasi bahwa pemanggil server action adalah pemilik sah dari profileId
 */
async function verifyProfileOwnership(profileId: string): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) return false;

    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(and(eq(profiles.id, profileId), eq(profiles.userId, session.user.id)))
      .limit(1);

    return !!profile;
  } catch {
    return false;
  }
}

/**
 * Fetch public page, its creator profile, and active blocks by slug
 * Mendukung pencarian via slug halaman maupun handle username akun (cth: "portofolio", "@thoth", "thoth")
 */
export async function getPageBySlug(
  slug: string
): Promise<PublicPageData | null> {
  let cleanSlug = slug.trim().toLowerCase();
  try {
    cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
  } catch {
    // fallback ke slug asli jika URI malformed
  }
  cleanSlug = cleanSlug.replace(/^@/, "");

  // 1. Prioritas Utama: Cari halaman dengan kecocokan slug halaman eksak
  const [page] = await db
    .select()
    .from(pages)
    .where(
      and(
        sql`lower(${pages.slug}) = ${cleanSlug}`,
        eq(pages.isPublished, true)
      )
    )
    .limit(1);

  if (page) {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, page.profileId))
      .limit(1);

    if (profile) {
      const blocks = await db
        .select()
        .from(pageBlocks)
        .where(
          and(eq(pageBlocks.pageId, page.id), eq(pageBlocks.isActive, true))
        )
        .orderBy(asc(pageBlocks.sortOrder));

      return {
        ...page,
        profile,
        blocks,
      };
    }
  }

  // 2. Fallback: Jika slug halaman tidak ditemukan, cari apakah cleanSlug adalah username akun profil
  const [profileByUsername] = await db
    .select()
    .from(profiles)
    .where(sql`lower(${profiles.username}) = ${cleanSlug}`)
    .limit(1);

  if (profileByUsername) {
    // Ambil halaman utama (isDefault = true) atau halaman terbitan pertama milik kreator
    const [defaultPage] = await db
      .select()
      .from(pages)
      .where(
        and(
          eq(pages.profileId, profileByUsername.id),
          eq(pages.isPublished, true)
        )
      )
      .orderBy(sql`${pages.isDefault} DESC`, sql`${pages.createdAt} ASC`)
      .limit(1);

    if (defaultPage) {
      const blocks = await db
        .select()
        .from(pageBlocks)
        .where(
          and(
            eq(pageBlocks.pageId, defaultPage.id),
            eq(pageBlocks.isActive, true)
          )
        )
        .orderBy(asc(pageBlocks.sortOrder));

      return {
        ...defaultPage,
        profile: profileByUsername,
        blocks,
      };
    }
  }

  return null;
}

/**
 * Fetch all pages owned by a creator profile
 */
export async function getPagesByProfileId(profileId: string): Promise<Page[]> {
  return await db
    .select()
    .from(pages)
    .where(eq(pages.profileId, profileId))
    .orderBy(sql`${pages.isDefault} DESC`, sql`${pages.createdAt} DESC`);
}

/**
 * Fetch a specific page and its blocks for dashboard editor
 */
export async function getPageById(
  pageId: string,
  profileId: string
): Promise<{ page: Page | null; blocks: PageBlock[] }> {
  const [page] = await db
    .select()
    .from(pages)
    .where(and(eq(pages.id, pageId), eq(pages.profileId, profileId)))
    .limit(1);

  if (!page) {
    return { page: null, blocks: [] };
  }

  const blocks = await db
    .select()
    .from(pageBlocks)
    .where(eq(pageBlocks.pageId, page.id))
    .orderBy(asc(pageBlocks.sortOrder));

  return { page, blocks };
}

/**
 * Create a new page under a creator profile
 */
export async function createPage(
  profileId: string,
  input: CreatePageInput
): Promise<ServiceResult<Page>> {
  if (!(await verifyProfileOwnership(profileId))) {
    return {
      success: false,
      error: "Akses ditolak: Anda tidak memiliki wewenang untuk akun profil ini.",
    };
  }

  const parsed = createPageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Data halaman tidak valid",
    };
  }

  const { title, slug, description, avatarUrl, isDefault } = parsed.data;

  // Check slug uniqueness
  const [existingSlug] = await db
    .select({ id: pages.id })
    .from(pages)
    .where(sql`lower(${pages.slug}) = ${slug}`)
    .limit(1);

  if (existingSlug) {
    return {
      success: false,
      error: `Slug URL "${slug}" sudah digunakan. Silakan pilih slug lain.`,
    };
  }

  // Cross-namespace guard: Pastikan slug tidak digunakan sebagai username akun profil lain
  const [profileCollision] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(
      and(
        sql`lower(${profiles.username}) = ${slug}`,
        ne(profiles.id, profileId)
      )
    )
    .limit(1);

  if (profileCollision) {
    return {
      success: false,
      error: `Slug URL "${slug}" tidak dapat digunakan karena merupakan username terdaftar akun lain.`,
    };
  }

  // If this page is set as default, unset other default pages for this profile
  if (isDefault) {
    await db
      .update(pages)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(eq(pages.profileId, profileId));
  }

  const [created] = await db
    .insert(pages)
    .values({
      id: crypto.randomUUID(),
      profileId,
      title,
      slug,
      description: description ?? null,
      avatarUrl: avatarUrl ? avatarUrl : null,
      themeConfig: { themePreset: "obsidian", accentColor: "#6366f1" },
      isDefault: isDefault ?? false,
      isPublished: true,
    })
    .returning();

  return { success: true, data: created };
}

/**
 * Update an existing page
 */
export async function updatePage(
  profileId: string,
  pageId: string,
  input: UpdatePageInput
): Promise<ServiceResult<Page>> {
  if (!(await verifyProfileOwnership(profileId))) {
    return {
      success: false,
      error: "Akses ditolak: Anda tidak memiliki wewenang untuk halaman ini.",
    };
  }

  const parsed = updatePageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Data halaman tidak valid",
    };
  }

  const [existingPage] = await db
    .select()
    .from(pages)
    .where(and(eq(pages.id, pageId), eq(pages.profileId, profileId)))
    .limit(1);

  if (!existingPage) {
    return { success: false, error: "Halaman tidak ditemukan" };
  }

  const {
    title,
    slug,
    description,
    avatarUrl,
    themeConfig,
    isDefault,
    isPublished,
  } = parsed.data;

  // If slug is changing, verify it is not taken
  if (slug && slug !== existingPage.slug.toLowerCase()) {
    const [collision] = await db
      .select({ id: pages.id })
      .from(pages)
      .where(and(sql`lower(${pages.slug}) = ${slug}`, ne(pages.id, pageId)))
      .limit(1);

    if (collision) {
      return {
        success: false,
        error: `Slug URL "${slug}" sudah digunakan. Silakan pilih slug lain.`,
      };
    }

    // Cross-namespace guard: Pastikan slug baru tidak digunakan sebagai username akun profil lain
    const [profileCollision] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(
        and(
          sql`lower(${profiles.username}) = ${slug}`,
          ne(profiles.id, profileId)
        )
      )
      .limit(1);

    if (profileCollision) {
      return {
        success: false,
        error: `Slug URL "${slug}" tidak dapat digunakan karena merupakan username terdaftar akun lain.`,
      };
    }
  }

  if (isDefault) {
    await db
      .update(pages)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(eq(pages.profileId, profileId));
  }

  const updateData: Partial<Page> = {
    updatedAt: new Date(),
  };

  if (title !== undefined) updateData.title = title;
  if (slug !== undefined) updateData.slug = slug;
  if (description !== undefined) updateData.description = description;
  if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl ? avatarUrl : null;
  if (themeConfig !== undefined) updateData.themeConfig = themeConfig;
  if (isDefault !== undefined) updateData.isDefault = isDefault;
  if (isPublished !== undefined) updateData.isPublished = isPublished;

  const [updated] = await db
    .update(pages)
    .set(updateData)
    .where(eq(pages.id, pageId))
    .returning();

  return { success: true, data: updated };
}

/**
 * Delete a page
 */
export async function deletePage(
  profileId: string,
  pageId: string
): Promise<ServiceResult<{ id: string }>> {
  if (!(await verifyProfileOwnership(profileId))) {
    return {
      success: false,
      error: "Akses ditolak: Anda tidak memiliki wewenang untuk menghapus halaman ini.",
    };
  }

  const userPages = await db
    .select({ id: pages.id, isDefault: pages.isDefault })
    .from(pages)
    .where(eq(pages.profileId, profileId));

  if (userPages.length <= 1) {
    return {
      success: false,
      error: "Anda harus memiliki minimal satu halaman aktif. Halaman ini tidak dapat dihapus.",
    };
  }

  const [target] = await db
    .delete(pages)
    .where(and(eq(pages.id, pageId), eq(pages.profileId, profileId)))
    .returning({ id: pages.id });

  if (!target) {
    return { success: false, error: "Halaman tidak ditemukan atau sudah dihapus" };
  }

  // If the deleted page was default, set the first remaining page as default
  const remaining = userPages.filter((p) => p.id !== pageId);
  const hasDefault = remaining.some((p) => p.isDefault);
  if (!hasDefault && remaining[0]) {
    await db
      .update(pages)
      .set({ isDefault: true, updatedAt: new Date() })
      .where(eq(pages.id, remaining[0].id));
  }

  return { success: true, data: target };
}

/**
 * Create a new block inside a page
 */
export async function createPageBlock(
  profileId: string,
  pageId: string,
  input: CreatePageBlockInput
): Promise<ServiceResult<PageBlock>> {
  if (!(await verifyProfileOwnership(profileId))) {
    return {
      success: false,
      error: "Akses ditolak: Anda tidak memiliki wewenang untuk menambahkan blok pada halaman ini.",
    };
  }

  const [page] = await db
    .select({ id: pages.id })
    .from(pages)
    .where(and(eq(pages.id, pageId), eq(pages.profileId, profileId)))
    .limit(1);

  if (!page) {
    return { success: false, error: "Halaman tidak ditemukan" };
  }

  const parsed = pageBlockSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Data tautan tidak valid",
    };
  }

  const [lastBlock] = await db
    .select({ maxOrder: pageBlocks.sortOrder })
    .from(pageBlocks)
    .where(eq(pageBlocks.pageId, page.id))
    .orderBy(sql`${pageBlocks.sortOrder} DESC`)
    .limit(1);

  const nextOrder = (lastBlock?.maxOrder ?? -1) + 1;

  const [newBlock] = await db
    .insert(pageBlocks)
    .values({
      id: crypto.randomUUID(),
      pageId: page.id,
      type: parsed.data.type ?? "link",
      title: parsed.data.title,
      url: parsed.data.url,
      iconName: parsed.data.iconName ?? null,
      colSpan: parsed.data.colSpan ?? 1,
      rowSpan: parsed.data.rowSpan ?? 1,
      config: parsed.data.config ?? {},
      sortOrder: nextOrder,
      isActive: true,
    })
    .returning();

  return { success: true, data: newBlock };
}

/**
 * Update a block in a page
 */
export async function updatePageBlock(
  profileId: string,
  pageId: string,
  blockId: string,
  input: UpdatePageBlockInput
): Promise<ServiceResult<PageBlock>> {
  if (!(await verifyProfileOwnership(profileId))) {
    return {
      success: false,
      error: "Akses ditolak: Anda tidak memiliki wewenang untuk mengubah blok pada halaman ini.",
    };
  }

  const [page] = await db
    .select({ id: pages.id })
    .from(pages)
    .where(and(eq(pages.id, pageId), eq(pages.profileId, profileId)))
    .limit(1);

  if (!page) {
    return { success: false, error: "Halaman tidak ditemukan" };
  }

  const [block] = await db
    .select()
    .from(pageBlocks)
    .where(
      and(eq(pageBlocks.id, blockId), eq(pageBlocks.pageId, page.id))
    )
    .limit(1);

  if (!block) {
    return { success: false, error: "Tautan tidak ditemukan" };
  }

  const parsed = updatePageBlockSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Data tautan tidak valid",
    };
  }

  const valid = parsed.data;
  const updateData: Partial<PageBlock> = {
    updatedAt: new Date(),
  };

  if (valid.type !== undefined) updateData.type = valid.type;
  if (valid.title !== undefined) updateData.title = valid.title;
  if (valid.url !== undefined) updateData.url = valid.url;
  if (valid.iconName !== undefined) updateData.iconName = valid.iconName ? valid.iconName : null;
  if (valid.colSpan !== undefined) updateData.colSpan = valid.colSpan;
  if (valid.rowSpan !== undefined) updateData.rowSpan = valid.rowSpan;
  if (valid.config !== undefined) updateData.config = valid.config;
  if (valid.isActive !== undefined) updateData.isActive = valid.isActive;

  const [updated] = await db
    .update(pageBlocks)
    .set(updateData)
    .where(eq(pageBlocks.id, blockId))
    .returning();

  return { success: true, data: updated };
}

/**
 * Delete a block in a page
 */
export async function deletePageBlock(
  profileId: string,
  pageId: string,
  blockId: string
): Promise<ServiceResult<{ id: string }>> {
  if (!(await verifyProfileOwnership(profileId))) {
    return {
      success: false,
      error: "Akses ditolak: Anda tidak memiliki wewenang untuk menghapus blok ini.",
    };
  }

  const [page] = await db
    .select({ id: pages.id })
    .from(pages)
    .where(and(eq(pages.id, pageId), eq(pages.profileId, profileId)))
    .limit(1);

  if (!page) {
    return { success: false, error: "Halaman tidak ditemukan" };
  }

  const [deleted] = await db
    .delete(pageBlocks)
    .where(
      and(eq(pageBlocks.id, blockId), eq(pageBlocks.pageId, page.id))
    )
    .returning({ id: pageBlocks.id });

  if (!deleted) {
    return { success: false, error: "Tautan tidak ditemukan atau sudah dihapus" };
  }

  return { success: true, data: deleted };
}

/**
 * Reorder blocks in a page
 */
export async function reorderPageBlocks(
  profileId: string,
  pageId: string,
  orderedBlockIds: string[]
): Promise<ServiceResult<boolean>> {
  if (!(await verifyProfileOwnership(profileId))) {
    return {
      success: false,
      error: "Akses ditolak: Anda tidak memiliki wewenang untuk mengubah urutan blok ini.",
    };
  }

  const [page] = await db
    .select({ id: pages.id })
    .from(pages)
    .where(and(eq(pages.id, pageId), eq(pages.profileId, profileId)))
    .limit(1);

  if (!page) {
    return { success: false, error: "Halaman tidak ditemukan" };
  }

  const parsed = reorderBlocksSchema.safeParse(orderedBlockIds);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Daftar ID blok tidak valid",
    };
  }

  for (let i = 0; i < parsed.data.length; i++) {
    const blockId = parsed.data[i];
    await db
      .update(pageBlocks)
      .set({ sortOrder: i, updatedAt: new Date() })
      .where(
        and(eq(pageBlocks.id, blockId), eq(pageBlocks.pageId, page.id))
      );
  }

  return { success: true, data: true };
}
