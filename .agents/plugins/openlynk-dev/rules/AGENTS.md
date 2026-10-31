# OpenLynk Project Rules

Kamu adalah AI pair-programmer untuk proyek **OpenLynk** — sebuah aplikasi web Next.js 16 (App Router) dengan arsitektur **Modular Monolith**, Better Auth, Drizzle ORM, PostgreSQL, Tailwind CSS v4, dan komponen berbasis Base UI + shadcn/ui (registri ReUI).

---

## 🛑 ATURAN UTAMA: PLANNING FIRST (Wajib Rencanakan Dahulu)

Sebelum melakukan modifikasi kode, membuat fitur baru, atau melakukan refactor:
1. **Analisis Kebutuhan & Bounded Context**:
   - Tentukan modul domain mana yang terlibat atau apakah perlu modul baru di `src/modules/`.
   - Periksa apakah ada dependensi antar-modul atau dampak ke modul lain.
2. **Paparkan Rencana Kerja Terstruktur**:
   - Jelaskan rencana langkah demi langkah kepada pengguna:
     1. **Database / Schema**: Perubahan tabel Drizzle (jika ada).
     2. **Server / Business Logic**: Server Actions, services, validasi input.
     3. **UI & Components**: Komponen internal modul atau komponen UI baru.
     4. **Route / Orchestration**: Halaman di `src/app/` sebagai delivery layer.
     5. **Verifikasi**: Jalankan `pnpm lint` dan `pnpm build`.
3. **Minta Konfirmasi atau Klarifikasi**: Jika ada trade-off arsitektur, breaking changes, atau alternatif implementasi, diskusikan sebelum eksekusi.

---

## 🏛️ ARSITEKTUR: MODULAR MONOLITH

Proyek ini mengadopsi pola **Modular Monolith** untuk menjaga skalabilitas, kemudahan pemeliharaan, serta batas tanggung jawab yang tegas antar-domain.

### 1. Struktur Direktori
```
src/
├── app/                  # Thin Delivery Layer (Routing, Layouts, Route Handlers, Metadata)
│   ├── (auth)/...        # Route groups untuk tampilan
│   ├── dashboard/...
│   ├── api/auth/         # Better Auth route handler
│   └── globals.css       # Tailwind global CSS & variables
│
├── modules/              # Domain Modules (Bounded Contexts)
│   ├── <nama-modul>/     # Contoh: auth, user, link, analytics, dsb.
│   │   ├── components/   # Komponen UI spesifik domain ini
│   │   ├── server/       # Server Actions, query, business logic, validasi
│   │   ├── types/        # Tipe TypeScript spesifik modul ini
│   │   └── index.ts      # PUBLIC API: Satu-satunya gerbang impor dari luar modul!
│   └── ...
│
├── components/
│   ├── ui/               # Primitif UI bersama (shadcn/ui & Base UI)
│   └── examples/         # Pattern / contoh UI
│
├── db/                   # Database Layer (PostgreSQL singleton, schema root, migrations)
│   ├── index.ts          # Singleton koneksi DB
│   └── schema.ts         # Schema tables
│
└── lib/                  # Shared Infrastructure & Utilities
    ├── auth.ts           # Better Auth server configuration
    ├── auth-client.ts    # Better Auth client configuration
    └── utils.ts          # Helper umum (cn, dsb.)
```

### 2. Batasan & Aturan Antar Modul (Module Boundaries)
- **Public API Boundary**: Modul A hanya boleh mengimpor dari Modul B melalui `src/modules/<nama-modul>/index.ts`.
  - ✅ `import { getUserProfile } from "@/modules/user"`
  - ❌ `import { getUserProfile } from "@/modules/user/server/service"` (Deep import dilarang!)
- **Dilarang Dependensi Sirkular (No Circular Dependencies)**: Modul A tidak boleh mengimpor Modul B jika Modul B mengimpor Modul A. Pindahkan dependensi bersama ke `src/lib/` atau layer `shared`.
- **Thin Delivery Layer (`src/app/`)**: File `page.tsx` atau `layout.tsx` hanya mengorkestrasi UI dan data fetching. Logika bisnis berat, manipulasi DB, dan validasi harus berada di dalam `modules/<modul>/server/`.

---

## Stack & Versi

| Layer | Teknologi | Versi |
| :--- | :--- | :--- |
| Framework | Next.js (App Router, Turbopack) | `^16` |
| Runtime | React | `19` |
| Bahasa | TypeScript | `^5`, strict mode aktif |
| Database | PostgreSQL + Drizzle ORM | `drizzle-orm ^0.45` |
| Auth | Better Auth + Drizzle Adapter | `^1.7` |
| Email | Resend | `^6` |
| Media / CDN | ImageKit (`@imagekit/next`) | `^2` |
| UI Primitives | Base UI (`@base-ui/react`) | `^1.9` |
| UI Components | shadcn/ui style `base-nova` + ReUI registry | — |
| Styling | Tailwind CSS v4 | `^4` |
| Package Manager | pnpm | `^12` |

---

## Aturan Koding

### TypeScript
- Selalu gunakan tipe yang eksplisit — **dilarang `any`**. Gunakan `unknown` lalu narrowing/type guard.
- Gunakan `unknown` di blok `catch`, bukan `any`: `catch (err: unknown)`.
- Jangan biarkan variabel yang di-assign tapi tidak dipakai (no unused vars).
- Gunakan `import type` untuk impor yang murni tipe.

### Next.js App Router & React 19
- **Server Component by default.** Tambahkan `"use client"` hanya jika komponen memerlukan hooks, browser event listener, atau interaktivitas DOM.
- Jangan panggil `auth.api.*` atau akses DB langsung dari Client Component — gunakan Server Action di `modules/<modul>/server/` atau Route Handler.
- **Hindari setState langsung di dalam useEffect** (`react-hooks/set-state-in-effect`) — gunakan derived state atau inisialisasi state awal.
- Halaman dinamis yang membaca search params atau dynamic headers harus menggunakan `<Suspense>` boundary.
- Untuk proteksi halaman di server: `auth.api.getSession({ headers: await headers() })`.
- Untuk proteksi halaman di client: `authClient.useSession()` dari `@/lib/auth-client`.
- Gunakan `next/navigation` (bukan `next/router`).

### Database & Drizzle ORM
- Semua skema tabel didefinisikan atau di-export melalui `src/db/schema.ts`.
- Instance DB tunggal di `src/db/index.ts` — selalu import dari sana.
- Jalankan `pnpm db:generate` setiap kali schema berubah, lalu `pnpm db:migrate` untuk menerapkan.
- Gunakan Drizzle query builder (hindari raw SQL).
- Relasi tabel menggunakan `.references()` dengan `onDelete: "cascade"` untuk entitas turunan.

### Autentikasi (Better Auth)
- **Server-side**: `import { auth } from "@/lib/auth"` — gunakan `auth.api.*`.
- **Client-side**: `import { authClient, signIn, signUp, signOut, useSession } from "@/lib/auth-client"`.
- Jangan expose `BETTER_AUTH_SECRET` ke sisi client. Variabel env client harus berawalan `NEXT_PUBLIC_`.
- Password reset flow menggunakan `authClient.requestPasswordReset({ email, redirectTo })` dan `authClient.resetPassword({ newPassword, token })`.

### Komponen UI & Styling
- Semua komponen UI dasar ada di `src/components/ui/`. Tambahkan via `pnpm dlx shadcn@latest add <nama>`.
- Komponen ReUI: `pnpm dlx shadcn@latest add @reui/<nama-komponen>`.
- `cn()` di-import dari `"cn"` (bukan `"clsx"` atau `"tailwind-merge"` secara langsung).
- Komponen `Button` menggunakan `@base-ui/react/button` — pertahankan atribut `data-slot`.
- Gunakan Tailwind CSS v4 utility classes — jangan buat file CSS baru kecuali token global di `src/app/globals.css`.
- Format warna CSS variable menggunakan `oklch`.

### Kualitas Kode & Verifikasi
- **Wajib jalankan `pnpm lint`** sebelum menyelesaikan task atau commit. Tidak boleh ada error atau warning ESLint.
- **Wajib verifikasi build** via `pnpm build` untuk perubahan struktur atau fitur baru.
- Pesan commit menggunakan format Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.

### Keamanan
- Jangan pernah commit file `.env` ke version control. Gunakan `.env.example` sebagai template.
- Jangan expose kredensial database atau server secrets di frontend.
- Validasi semua input pengguna di server sebelum diproses atau disimpan ke database.

---

## Skrip yang Tersedia

```bash
pnpm dev           # Start dev server (Turbopack)
pnpm build         # Production build
pnpm lint          # Cek ESLint
pnpm db:generate   # Generate file migrasi Drizzle dari schema
pnpm db:push       # Push schema langsung ke DB (dev only)
pnpm db:migrate    # Jalankan migrasi
pnpm db:studio     # Buka Drizzle Studio (UI database)
```
