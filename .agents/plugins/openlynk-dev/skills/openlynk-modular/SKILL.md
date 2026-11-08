---
name: openlynk-modular
description: >-
  Use this skill when designing, creating, or refactoring domain modules in src/modules/,
  auditing module boundaries, enforcing the Modular Monolith architecture, checking import paths
  to prevent deep imports or circular dependencies, or organizing business logic versus delivery layers in OpenLynk.
---

# OpenLynk — Modular Monolith Architecture & Boundaries

Panduan arsitektur **Modular Monolith** untuk proyek OpenLynk. Pola ini memastikan skalabilitas, kemudahan navigasi kode, dan isolasi tanggung jawab yang tegas antar-domain bisnis.

---

## 🏛️ Anatomi Modul Domain (`src/modules/<nama-modul>/`)

Setiap fitur atau domain bisnis OpenLynk (seperti `auth`, `dashboard`, `page`, `profile`, `brand`) harus terisolasi di dalam folder domainnya sendiri di bawah `src/modules/`:

```text
src/modules/<nama-modul>/
├── components/         # Komponen UI spesifik domain ini
│   ├── ...-card.tsx
│   └── ...-view.tsx
├── server/             # Business logic, Server Actions, query database, validasi Zod
│   ├── ...-service.ts  # Database operations & data mutations
│   └── ...-validation.ts # Zod schemas untuk input validation
├── types/              # Definisi tipe TypeScript domain ini
│   └── index.ts
└── index.ts            # 🚪 PUBLIC API: Satu-satunya gerbang impor dari luar modul!
```

---

## 🛑 Aturan Batas Modul (Module Boundaries)

### 1. Aturan Public API (Wajib)
Semua fungsi, komponen, atau tipe yang dibutuhkan oleh modul lain atau oleh App Router **WAJIB** diekspor melalui `src/modules/<nama-modul>/index.ts`.

* ✅ **Benar**:
  ```typescript
  import { BrandDesignSystemView } from "@/modules/brand";
  import { getUserPages, createPageAction } from "@/modules/page";
  import type { Block, PageWithBlocks } from "@/modules/page";
  ```
* ❌ **Dilarang Keras (Deep Import)**:
  ```typescript
  // Dilarang mengimpor langsung dari subdirektori modul lain!
  import { getUserPages } from "@/modules/page/server/page-service";
  import { BentoCardBlock } from "@/modules/page/components/blocks/bento-card-block";
  import type { Block } from "@/modules/page/types/index";
  ```

### 2. Larangan Dependensi Sirkular (No Circular Dependencies)
* **Aturan**: Modul `A` tidak boleh mengimpor dari Modul `B` jika Modul `B` juga mengimpor dari Modul `A`.
* **Solusi jika ada dependensi bersama**:
  1. Pindahkan tipe data atau utilitas bersama ke `src/lib/` (misal `src/lib/utils.ts`).
  2. Atau jadikan parameter fungsi (dependency injection) alih-alih melakukan impor langsung.

### 3. Thin Delivery Layer (`src/app/`)
* File di `src/app/` (`page.tsx`, `layout.tsx`, `route.ts`) hanya berfungsi sebagai **orkestrator tipis**:
  * Mengambil sesi pengguna via `auth.api.getSession()`.
  * Memanggil service function dari modul terkait (`getUserPages(session.user.id)`).
  * Merender komponen view utama dari modul (`<PagesListView pages={pages} />`).
  * Mengatur metadata SEO (`generateMetadata` / `export const metadata`).
* ❌ **Dilarang**: Menulis query SQL langsung (`db.select().from(...)`), logika bisnis kompleks, atau manipulasi state berat langsung di dalam `src/app/.../page.tsx`.

---

## 🛠️ Langkah Membuat Modul Baru

Ketika fitur baru membutuhkan domain baru (misal: `analytics`, `marketplace`, `billing`):

1. **Buat struktur folder**:
   ```bash
   mkdir -p src/modules/<nama-modul>/{components,server,types}
   touch src/modules/<nama-modul>/index.ts
   ```
2. **Definisikan tipe data di `types/index.ts`**.
3. **Buat service & validasi di `server/`**:
   * Tulis fungsi data fetching dan Server Actions.
   * Pastikan menggunakan query builder Drizzle dari `@/db`.
   * Lakukan validasi input dengan Zod.
4. **Buat komponen UI di `components/`**:
   * Manfaatkan primitif UI bersama dari `@/components/ui/*`.
   * Terapkan styling obsidian glassmorphism (`.rune-glass`, RuneIcon).
5. **Ekspor Public API di `index.ts`**:
   ```typescript
   // src/modules/<nama-modul>/index.ts
   export * from "./types";
   export { MyFeatureView } from "./components/my-feature-view";
   export { getFeatureData, mutateFeatureAction } from "./server/feature-service";
   ```
6. **Hubungkan ke Route App Router di `src/app/`**:
   Impor komponen view atau service dari `@/modules/<nama-modul>`.

---

## 🔍 Checklist Verifikasi Boundary

Sebelum menyelesaikan task:
* [ ] Apakah ada file di luar modul yang melakukan deep import (`@/modules/.../...`)?
* [ ] Apakah `src/app/page.tsx` tetap tipis dan bersih dari query database langsung?
* [ ] Apakah semua ekspor publik terdaftar di `src/modules/<nama-modul>/index.ts`?
* [ ] Jalankan `pnpm lint` untuk memastikan tidak ada lint error atau siklus impor.
