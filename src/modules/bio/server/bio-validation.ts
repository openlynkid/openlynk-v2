import { z } from "zod";

export const RESERVED_USERNAMES = new Set([
  "api",
  "dashboard",
  "login",
  "register",
  "admin",
  "settings",
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

export function isUsernameReserved(username: string): boolean {
  return RESERVED_USERNAMES.has(username.toLowerCase().trim());
}

const USERNAME_REGEX = /^[a-z0-9][a-z0-9_-]{1,28}[a-z0-9]$/;

export const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username minimal 3 karakter")
    .max(30, "Username maksimal 30 karakter")
    .regex(
      USERNAME_REGEX,
      "Username hanya boleh huruf kecil, angka, tanda minus (-), atau underscore (_)"
    )
    .refine((val) => !isUsernameReserved(val), {
      message: "Username ini tidak dapat digunakan (reserved system slug)",
    }),
  displayName: z
    .string()
    .trim()
    .min(1, "Nama tampilan wajib diisi")
    .max(50, "Nama tampilan maksimal 50 karakter"),
  bio: z.string().trim().max(160, "Bio maksimal 160 karakter").optional().default(""),
  avatarUrl: z.string().trim().url("URL avatar tidak valid").or(z.literal("")).optional(),
  socialLinks: z
    .object({
      instagram: z.string().trim().optional(),
      tiktok: z.string().trim().optional(),
      youtube: z.string().trim().optional(),
      twitter: z.string().trim().optional(),
      github: z.string().trim().optional(),
      linkedin: z.string().trim().optional(),
      whatsapp: z.string().trim().optional(),
    })
    .optional()
    .default({}),
  isPublished: z.boolean().optional().default(true),
});

export const linkBlockSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Judul tautan wajib diisi")
    .max(80, "Judul tautan maksimal 80 karakter"),
  url: z
    .string()
    .trim()
    .min(1, "URL tautan wajib diisi")
    .url("Format URL tidak valid (gunakan http:// atau https://)"),
  iconName: z.string().trim().optional(),
});
