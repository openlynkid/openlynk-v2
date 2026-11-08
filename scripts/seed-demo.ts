import "dotenv/config";
import { db } from "../src/db";
import { user, account, profiles, pages, pageBlocks } from "../src/db/schema";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import crypto from "crypto";

async function main() {
  console.log("🌱 Starting seed for Demo Account (@demo / /demo)...");

  const demoEmail = "demo@openlynk.id";
  const demoUsername = "demo";
  const demoSlug = "demo";
  const demoPassword = "demo123456";

  // 1. Clean up existing demo user/profile/page if any
  const existingUsers = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, demoEmail));

  for (const u of existingUsers) {
    console.log(`🧹 Removing existing demo user (${u.id})...`);
    await db.delete(user).where(eq(user.id, u.id));
  }

  // Also clean up by username/slug if decoupled
  const existingProfiles = await db
    .select({ id: profiles.id, userId: profiles.userId })
    .from(profiles)
    .where(eq(profiles.username, demoUsername));

  for (const p of existingProfiles) {
    console.log(`🧹 Removing orphaned profile with username ${demoUsername}...`);
    await db.delete(user).where(eq(user.id, p.userId));
  }

  const existingPages = await db
    .select({ id: pages.id })
    .from(pages)
    .where(eq(pages.slug, demoSlug));

  for (const pg of existingPages) {
    console.log(`🧹 Removing orphaned page with slug ${demoSlug}...`);
    await db.delete(pages).where(eq(pages.id, pg.id));
  }

  // 2. Generate IDs & Password Hash
  const userId = crypto.randomUUID().replace(/-/g, "").slice(0, 32);
  const accountId = crypto.randomUUID().replace(/-/g, "").slice(0, 32);
  const profileId = crypto.randomUUID();
  const pageId = crypto.randomUUID();

  const hashedPassword = await hashPassword(demoPassword);
  const now = new Date();

  // 3. Insert User
  console.log("👤 Creating Demo User...");
  await db.insert(user).values({
    id: userId,
    name: "OpenLynk Showcase",
    email: demoEmail,
    emailVerified: true,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    createdAt: now,
    updatedAt: now,
  });

  // 4. Insert Account
  console.log("🔐 Creating Demo Credential Account...");
  await db.insert(account).values({
    id: accountId,
    accountId: userId,
    providerId: "credential",
    userId: userId,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });

  // 5. Insert Profile
  console.log("✨ Creating Demo Profile (@demo)...");
  await db.insert(profiles).values({
    id: profileId,
    userId: userId,
    username: demoUsername,
    displayName: "OpenLynk Showcase",
    bio: "Kurasi profil digital interaktif & bento grid estetik generasi baru. Ditenagai oleh Next.js 16 & Base UI.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    isVerified: true,
    socialLinks: {
      github: "https://github.com/openlynk/openlynk",
      twitter: "https://x.com/openlynk",
      instagram: "https://instagram.com/openlynk",
      youtube: "https://youtube.com/@openlynk",
      whatsapp: "https://wa.me/628123456789",
    },
    createdAt: now,
    updatedAt: now,
  });

  // 6. Insert Page
  console.log("📄 Creating Demo Page (/demo)...");
  await db.insert(pages).values({
    id: pageId,
    profileId: profileId,
    title: "OpenLynk Showcase",
    slug: demoSlug,
    description: "Eksplorasi showcase fitur bento grid interaktif, rich cards, tactile drag & drop, dan tema obsidian.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    themeConfig: {
      themePreset: "obsidian",
      accentColor: "#6366f1",
    },
    isDefault: true,
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  });

  // 7. Insert 9 Bento Blocks
  console.log("🧱 Creating Showcase Page Blocks...");
  const blocksToInsert = [
    // 0: Header Text
    {
      id: crypto.randomUUID(),
      pageId: pageId,
      type: "header_text" as const,
      title: "⚡ SHOWCASE RESMI OPENLYNK",
      url: "",
      iconName: null,
      colSpan: 2,
      rowSpan: 1,
      sortOrder: 0,
      config: {
        subtitle: "Eksplorasi ekosistem blok interaktif kami",
      },
      isActive: true,
    },
    // 1: Bento Card (2x2)
    {
      id: crypto.randomUUID(),
      pageId: pageId,
      type: "bento_card" as const,
      title: "OpenLynk Bento Studio",
      url: "https://github.com/openlynk/openlynk",
      iconName: "glass-sparkle",
      colSpan: 2,
      rowSpan: 2,
      sortOrder: 1,
      config: {
        variant: "standard",
        subtitle: "Canvas drag & drop bento generasi baru dengan haptic pointer, glassmorphism gelap, dan Base UI.",
        badgeText: "FEATURED",
        accentGlow: "#6366f1",
      },
      isActive: true,
    },
    // 2: Note Card (2x1)
    {
      id: crypto.randomUUID(),
      pageId: pageId,
      type: "bento_card" as const,
      title: "Filosofi Desain",
      url: "",
      iconName: "glass-star",
      colSpan: 2,
      rowSpan: 1,
      sortOrder: 2,
      config: {
        variant: "note",
        badgeText: "Kutipan",
        noteContent: "Membangun identitas digital yang estetik, taktil, dan responsif tanpa kompromi performa.",
      },
      isActive: true,
    },
    // 3: Map Card (1x1)
    {
      id: crypto.randomUUID(),
      pageId: pageId,
      type: "bento_card" as const,
      title: "Domisili",
      url: "https://maps.google.com/?q=Jakarta",
      iconName: "glass-compass",
      colSpan: 1,
      rowSpan: 1,
      sortOrder: 3,
      config: {
        variant: "map",
        locationName: "Jakarta, ID",
        badgeText: "WIB (UTC+7)",
      },
      isActive: true,
    },
    // 4: GitHub Card (2x1)
    {
      id: crypto.randomUUID(),
      pageId: pageId,
      type: "bento_card" as const,
      title: "openlynk/openlynk",
      url: "https://github.com/openlynk/openlynk",
      iconName: "glass-code",
      colSpan: 2,
      rowSpan: 1,
      sortOrder: 4,
      config: {
        variant: "github",
        repoName: "openlynk/openlynk",
        repoStars: 842,
        repoLanguage: "TypeScript",
        subtitle: "Modular Monolith Next.js 16 Bio-Link Platform",
      },
      isActive: true,
    },
    // 5: Social Row (2x1)
    {
      id: crypto.randomUUID(),
      pageId: pageId,
      type: "social_row" as const,
      title: "Sosial Media Resmi",
      url: "",
      iconName: null,
      colSpan: 2,
      rowSpan: 1,
      sortOrder: 5,
      config: {
        socialLinks: {
          github: "https://github.com/openlynk/openlynk",
          twitter: "https://x.com/openlynk",
          instagram: "https://instagram.com/openlynk",
          youtube: "https://youtube.com/@openlynk",
          whatsapp: "https://wa.me/628123456789",
          linkedin: "https://linkedin.com/company/openlynk",
        },
      },
      isActive: true,
    },
    // 6: Photo Showcase Card (1x1)
    {
      id: crypto.randomUUID(),
      pageId: pageId,
      type: "bento_card" as const,
      title: "Karya Visual",
      url: "https://unsplash.com",
      iconName: "glass-heart",
      colSpan: 1,
      rowSpan: 1,
      sortOrder: 6,
      config: {
        variant: "image",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Abstrak Obsidian 3D",
        badgeText: "Art",
        subtitle: "Obsidian Flow",
      },
      isActive: true,
    },
    // 7: Media Embed (2x2)
    {
      id: crypto.randomUUID(),
      pageId: pageId,
      type: "media_embed" as const,
      title: "Next.js 16 App Router Tutorial",
      url: "https://www.youtube.com/watch?v=wm5gMKuwSYk",
      iconName: null,
      colSpan: 2,
      rowSpan: 2,
      sortOrder: 7,
      config: {
        embedType: "youtube",
        embedId: "wm5gMKuwSYk",
      },
      isActive: true,
    },
    // 8: Classic Link Pill (2x1)
    {
      id: crypto.randomUUID(),
      pageId: pageId,
      type: "link" as const,
      title: "Dokumentasi Proyek & Panduan Memulai",
      url: "https://github.com/openlynk/openlynk#readme",
      iconName: "glass-zap",
      colSpan: 2,
      rowSpan: 1,
      sortOrder: 8,
      config: {
        subtitle: "Pelajari arsitektur Modular Monolith & panduan kontribusi",
        badgeText: "Docs",
      },
      isActive: true,
    },
  ];

  await db.insert(pageBlocks).values(blocksToInsert);

  console.log("✅ Seed Demo selesai!");
  console.log("------------------------------------------");
  console.log(`🌐 Halaman Demo: http://localhost:3000/demo`);
  console.log(`📧 Akun Demo:   demo@openlynk.id`);
  console.log(`🔑 Kata Sandi:  demo123456`);
  console.log("------------------------------------------");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
