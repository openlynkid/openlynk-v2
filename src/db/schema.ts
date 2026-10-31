import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

// --- BETTER AUTH TABLES ---
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// --- ENUMS ---

export const pageBlockTypeEnum = pgEnum("page_block_type", [
  "link",
  "bento_card",
  "social_row",
  "header_text",
  "media_embed",
]);

// Backward compatibility alias for enum
export const bioBlockTypeEnum = pageBlockTypeEnum;

// --- PROFILES (Akun Pengguna/Kreator - 1 to 1 dengan User) ---

export const profiles = pgTable(
  "profiles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" })
      .unique(),
    username: text("username").notNull().unique(), // Handle unik akun (cth: "iwan")
    displayName: text("display_name").notNull(),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    isVerified: boolean("is_verified").default(false).notNull(),
    socialLinks: jsonb("social_links")
      .$type<{
        instagram?: string;
        tiktok?: string;
        youtube?: string;
        twitter?: string;
        github?: string;
        linkedin?: string;
        whatsapp?: string;
      }>()
      .default({})
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("profiles_username_idx").on(t.username)]
);

// --- PAGES (Halaman Publik - 1 Profile memiliki Banyak Pages) ---

export const pages = pgTable(
  "pages",
  {
    id: text("id").primaryKey(),
    profileId: text("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(), // Judul halaman (cth: "Portofolio Utama", "Kelas Next.js")
    slug: text("slug").notNull().unique(), // URL publik (cth: openlynk.id/iwan, openlynk.id/kelas)
    description: text("description"),
    avatarUrl: text("avatar_url"), // Avatar khusus halaman (opsional, fallback ke profile)
    themeConfig: jsonb("theme_config")
      .$type<{
        themePreset: string;
        accentColor: string;
      }>()
      .default({ themePreset: "obsidian", accentColor: "#6366f1" })
      .notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    isPublished: boolean("is_published").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("pages_profile_idx").on(t.profileId),
    index("pages_slug_idx").on(t.slug),
  ]
);

// --- PAGE BLOCKS (Blok Konten & Bento di Dalam Suatu Page) ---

export const pageBlocks = pgTable(
  "page_blocks",
  {
    id: text("id").primaryKey(),
    pageId: text("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    type: pageBlockTypeEnum("type").default("link").notNull(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    iconName: text("icon_name"),
    colSpan: integer("col_span").default(1).notNull(),
    rowSpan: integer("row_span").default(1).notNull(),
    config: jsonb("config")
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("page_blocks_page_idx").on(t.pageId),
    index("page_blocks_page_sort_idx").on(t.pageId, t.sortOrder),
  ]
);

// Backward compatibility alias for bioBlocks
export const bioBlocks = pageBlocks;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type PageBlock = typeof pageBlocks.$inferSelect;
export type NewPageBlock = typeof pageBlocks.$inferInsert;

// Legacy alias types
export type BioBlock = PageBlock;
export type NewBioBlock = NewPageBlock;
