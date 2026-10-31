import { z } from "zod";

export const RESERVED_PAGE_SLUGS = new Set([
  "api",
  "dashboard",
  "login",
  "register",
  "admin",
  "settings",
  "pages",
  "profile",
  "p",
  "order",
  "help",
  "auth",
  "checkout",
  "forgot-password",
  "reset-password",
  "terms",
  "privacy",
  "static",
  "public",
  "favicon.ico",
  "openlynk",
  "root",
  "support",
  "explore",
  "bio",
]);

export function isPageSlugReserved(slug: string): boolean {
  return RESERVED_PAGE_SLUGS.has(slug.toLowerCase().trim());
}

const SLUG_REGEX = /^[a-z0-9][a-z0-9_-]{1,28}[a-z0-9]$/;

export const createPageSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Judul halaman wajib diisi")
    .max(80, "Judul halaman maksimal 80 karakter"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Slug URL minimal 3 karakter")
    .max(30, "Slug URL maksimal 30 karakter")
    .regex(
      SLUG_REGEX,
      "Slug hanya boleh huruf kecil, angka, tanda minus (-), atau underscore (_)"
    )
    .refine((val) => !isPageSlugReserved(val), {
      message: "Slug ini tidak dapat digunakan (reserved system slug)",
    }),
  description: z
    .string()
    .trim()
    .max(200, "Deskripsi maksimal 200 karakter")
    .optional()
    .default(""),
  avatarUrl: z.string().trim().url("URL gambar tidak valid").or(z.literal("")).optional(),
  isDefault: z.boolean().optional().default(false),
});

export const updatePageSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Judul halaman wajib diisi")
    .max(80, "Judul halaman maksimal 80 karakter")
    .optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Slug URL minimal 3 karakter")
    .max(30, "Slug URL maksimal 30 karakter")
    .regex(
      SLUG_REGEX,
      "Slug hanya boleh huruf kecil, angka, tanda minus (-), atau underscore (_)"
    )
    .refine((val) => !isPageSlugReserved(val), {
      message: "Slug ini tidak dapat digunakan (reserved system slug)",
    })
    .optional(),
  description: z
    .string()
    .trim()
    .max(200, "Deskripsi maksimal 200 karakter")
    .optional(),
  avatarUrl: z.string().trim().url("URL gambar tidak valid").or(z.literal("")).optional(),
  themeConfig: z
    .object({
      themePreset: z.string(),
      accentColor: z.string(),
    })
    .optional(),
  isDefault: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export const pageBlockSchema = z.object({
  type: z
    .enum(["link", "bento_card", "social_row", "header_text", "media_embed"])
    .optional()
    .default("link"),
  title: z
    .string()
    .trim()
    .min(1, "Judul blok wajib diisi")
    .max(80, "Judul blok maksimal 80 karakter"),
  url: z
    .string()
    .trim()
    .min(1, "URL wajib diisi"),
  iconName: z.string().trim().optional(),
  colSpan: z.number().int().min(1).max(2).optional().default(1),
  rowSpan: z.number().int().min(1).max(2).optional().default(1),
  config: z
    .object({
      embedType: z.enum(["youtube", "spotify"]).optional(),
      embedId: z.string().trim().optional(),
      subtitle: z.string().trim().max(160).optional(),
      badgeText: z.string().trim().max(30).optional(),
      accentGlow: z.string().trim().optional(),
    })
    .optional()
    .default({}),
});
