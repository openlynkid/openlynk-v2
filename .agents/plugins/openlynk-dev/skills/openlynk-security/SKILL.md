---
name: openlynk-security
description: >-
  Use this skill when implementing or reviewing Server Actions, API routes, user input validation (Zod),
  authorization checks to prevent BOLA/IDOR, URL sanitization against Stored XSS,
  or handling environment secrets and HTTP security headers in OpenLynk.
---

# OpenLynk — Security Engineering & Server Hardening Guide

Panduan standar keamanan untuk mencegah kerentanan aplikasi web modern di OpenLynk, mencakup proteksi **BOLA (Broken Object Level Authorization)**, sanitasi **Stored XSS**, validasi input **Zod**, serta batas kredensial server.

---

## 🛡️ 1. Pencegahan BOLA / IDOR pada Server Actions

Setiap Server Action yang memodifikasi data (update profil, ubah halaman, hapus atau ubah urutan blok bento) **WAJIB** memverifikasi kepemilikan sumber daya terhadap pengguna yang terautentikasi:

### Pola Standar Proteksi BOLA:
```typescript
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { page, block } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function updateBlockAction(blockId: string, pageId: string, data: unknown) {
  // 1. Dapatkan sesi pengguna yang valid
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Tidak terautentikasi.");
  }

  // 2. VERIFIKASI KEPEMILIKAN: Pastikan pageId benar-benar milik session.user.id
  const targetPage = await db.query.page.findFirst({
    where: and(
      eq(page.id, pageId),
      eq(page.userId, session.user.id) // 🔒 Wajib cek userId!
    ),
  });

  if (!targetPage) {
    throw new Error("Akses ditolak: Anda tidak memiliki izin untuk halaman ini.");
  }

  // 3. Pastikan blok terkait memang berada di dalam targetPage
  const targetBlock = await db.query.block.findFirst({
    where: and(
      eq(block.id, blockId),
      eq(block.pageId, pageId) // 🔒 Wajib verifikasi relasi pageId!
    ),
  });

  if (!targetBlock) {
    throw new Error("Blok tidak ditemukan pada halaman ini.");
  }

  // 4. Lanjutkan mutasi data yang aman
  // ...
}
```

---

## 🧼 2. Sanitasi URL & Pencegahan Stored XSS

Pengguna dapat memasukkan tautan eksternal pada kartu bento, tombol link, atau media sosial. Hindari menyematkan URL mentah ke dalam tag `<a>` atau `<iframe>` tanpa validasi skema protokol.

### Aturan URL Sanitization:
* **Protokol Terlarang**: `javascript:`, `data:`, `vbscript:`, `file:`.
* **Protokol Diizinkan**: `https://`, `http://`, `mailto:`.
* **Gunakan Helper Parser**: Gunakan helper sanitasi yang telah disediakan:

```typescript
export function sanitizeUrl(url?: string | null): string {
  if (!url) return "#";
  const trimmed = url.trim();

  // Tolak skema berbahaya
  const dangerousPatterns = /^(javascript:|data:|vbscript:)/i;
  if (dangerousPatterns.test(trimmed)) {
    return "#";
  }

  // Izinkan URL relatif atau yang diawali protokol aman
  if (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  // Default fallback otomatis tambahkan https:// jika pengguna hanya mengetik domain
  return `https://${trimmed}`;
}
```

---

## 📋 3. Validasi Input Server Menggunakan Zod

Jangan pernah mempercayai input dari client, payload form, atau parameter URL. Semua Server Actions wajib memvalidasi data menggunakan skema Zod sebelum menyentuh database:

```typescript
import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(60, "Nama maksimal 60 karakter"),
  handle: z
    .string()
    .trim()
    .min(3, "Handle minimal 3 karakter")
    .max(30, "Handle maksimal 30 karakter")
    .regex(/^[a-z0-9_-]+$/, "Handle hanya boleh huruf kecil, angka, garis bawah, dan tanda hubung"),
  bio: z.string().trim().max(300, "Bio maksimal 300 karakter").optional(),
});
```

---

## 🔒 4. Pemisahan Kredensial & Secrets

* **Server-Only Secrets**:
  * `BETTER_AUTH_SECRET`, `DATABASE_URL`, `RESEND_API_KEY`.
  * **DILARANG** mengimpor atau menggunakan variabel ini di dalam Client Component (`"use client"`).
* **Client Environment Variables**:
  * Hanya variabel dengan prefix `NEXT_PUBLIC_` yang boleh diakses di browser (contoh: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`).
* **Dokumen `.env`**:
  * Jangan pernah meng-commit file `.env` atau kredensial nyata ke repository git. Selalu gunakan `.env.example` sebagai acuan template.

---

## 🔍 Checklist Verifikasi Keamanan

Sebelum menandai fitur atau Server Action selesai:
* [ ] Apakah ada Server Action yang menerima `id` objek tanpa memvalidasi kepemilikan (`userId`) pengguna saat ini?
* [ ] Apakah semua input eksternal divalidasi dengan Zod?
* [ ] Apakah tautan URL yang disimpan atau dirender sudah lolos sanitasi `sanitizeUrl`?
* [ ] Apakah ada kredensial server yang tidak sengaja bocor ke bundle client?
