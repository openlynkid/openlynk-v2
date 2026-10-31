import { z } from "zod";

export const RESERVED_PAGE_SLUGS = new Set([
  "_next",
  "robots.txt",
  "sitemap.xml",
  "manifest.json",
  "index",
  "undefined",
  "null",
  "health",
  "status",
  "account",
  "user",
  "logout",
  "signout",
  "signin",
  "signup",
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
  "feed",
  "rss",
  "assets",
]);

export function isPageSlugReserved(slug: string): boolean {
  return RESERVED_PAGE_SLUGS.has(slug.toLowerCase().trim());
}

/**
 * Pola URL aman: hanya mengizinkan http://, https://, mailto:, tel:, path relatif (/...), atau hash (#).
 * Mencegah eksekusi protokol berbahaya seperti javascript:, data:, vbscript:.
 */
export const SAFE_URL_REGEX = /^(https?:\/\/|mailto:|tel:|\/|#)/i;

export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  if (
    clean.startsWith("javascript:") ||
    clean.startsWith("data:") ||
    clean.startsWith("vbscript:")
  ) {
    return false;
  }
  return SAFE_URL_REGEX.test(clean);
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

export const blockConfigSchema = z
  .object({
    embedType: z.enum(["youtube", "spotify"]).optional(),
    embedId: z
      .string()
      .trim()
      .regex(
        /^[a-zA-Z0-9_-]*$/,
        "Embed ID hanya boleh alfanumerik, minus, atau underscore"
      )
      .max(100, "Embed ID maksimal 100 karakter")
      .optional(),
    subtitle: z
      .string()
      .trim()
      .max(160, "Subjudul maksimal 160 karakter")
      .optional(),
    badgeText: z
      .string()
      .trim()
      .max(30, "Teks lencana maksimal 30 karakter")
      .optional(),
    accentGlow: z.string().trim().max(50).optional(),
  })
  .optional()
  .default({});

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
    .min(1, "URL wajib diisi")
    .refine((val) => isSafeUrl(val), {
      message:
        "Protokol URL tidak aman (hanya diizinkan http://, https://, mailto:, tel:, atau #)",
    }),
  iconName: z.string().trim().optional(),
  colSpan: z.number().int().min(1).max(2).optional().default(1),
  rowSpan: z.number().int().min(1).max(2).optional().default(1),
  config: blockConfigSchema,
});

export const updatePageBlockSchema = z.object({
  type: z
    .enum(["link", "bento_card", "social_row", "header_text", "media_embed"])
    .optional(),
  title: z
    .string()
    .trim()
    .min(1, "Judul blok wajib diisi")
    .max(80, "Judul blok maksimal 80 karakter")
    .optional(),
  url: z
    .string()
    .trim()
    .min(1, "URL wajib diisi")
    .refine((val) => isSafeUrl(val), {
      message:
        "Protokol URL tidak aman (hanya diizinkan http://, https://, mailto:, tel:, atau #)",
    })
    .optional(),
  iconName: z.string().trim().max(60).optional(),
  colSpan: z.number().int().min(1).max(2).optional(),
  rowSpan: z.number().int().min(1).max(2).optional(),
  config: blockConfigSchema,
  isActive: z.boolean().optional(),
});

export const reorderBlocksSchema = z
  .array(z.string().uuid("ID blok harus berformat UUID yang valid"))
  .max(100, "Maksimal 100 blok dalam satu permintaan penataan urutan")
  .refine((items) => new Set(items).size === items.length, {
    message: "Daftar ID blok tidak boleh mengandung duplikasi",
  });
