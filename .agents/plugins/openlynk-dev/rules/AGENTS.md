# OpenLynk Project Rules

Kamu adalah AI pair-programmer untuk proyek **OpenLynk** — sebuah aplikasi web Next.js 16 (App Router) dengan Better Auth, Drizzle ORM, PostgreSQL, Tailwind CSS v4, dan komponen berbasis Base UI + shadcn/ui (registri ReUI).

---

## Stack & Versi

| Layer | Teknologi | Versi |
| :--- | :--- | :--- |
| Framework | Next.js (App Router, Turbopack) | `^16` |
| Runtime | React | `19` |
| Bahasa | TypeScript | `^5`, strict mode aktif |
| Database | PostgreSQL + Drizzle ORM | `drizzle-orm ^0.45` |
| Auth | Better Auth + Drizzle Adapter | `^1.7` |
| UI Primitives | Base UI (`@base-ui/react`) | `^1.9` |
| UI Components | shadcn/ui style `base-nova` + ReUI registry | — |
| Styling | Tailwind CSS v4 | `^4` |
| Package Manager | pnpm | `^12` |

---

## Aturan Koding

### TypeScript
- Selalu gunakan tipe yang eksplisit — **dilarang `any`**. Gunakan `unknown` lalu narrowing.
- Gunakan `unknown` di blok `catch`, bukan `any`: `catch (err: unknown)`.
- Jangan biarkan variabel yang di-assign tapi tidak dipakai (no unused vars).
- Gunakan `import type` untuk impor yang murni tipe.

### Next.js App Router
- **Server Component by default.** Tambahkan `"use client"` hanya jika komponen memerlukan hooks, event handler, atau interaktivitas browser.
- Jangan panggil `auth.api.*` atau akses DB langsung dari Client Component — gunakan Server Action atau Route Handler.
- Untuk proteksi halaman di server, gunakan `auth.api.getSession({ headers: await headers() })`.
- Untuk proteksi halaman di client, gunakan `authClient.useSession()` dari `@/lib/auth-client`.
- File route handler ada di `src/app/api/**`. Auth route sudah ditangani oleh `src/app/api/auth/[...all]/route.ts` — jangan duplikasi.
- Gunakan `next/navigation` (bukan `next/router`) untuk navigasi di App Router.

### Database & Drizzle ORM
- Semua skema tabel didefinisikan di `src/db/schema.ts`.
- Instance DB tunggal di `src/db/index.ts` — selalu import dari sana, jangan buat koneksi baru.
- Jalankan `pnpm db:generate` setiap kali schema berubah, lalu `pnpm db:migrate` untuk menerapkan.
- Jangan gunakan raw SQL kecuali ada alasan kuat — pakai Drizzle query builder.
- Relasi tabel menggunakan `.references()` dengan `onDelete: "cascade"` untuk entitas turunan.

### Autentikasi (Better Auth)
- **Server-side**: `import { auth } from "@/lib/auth"` — gunakan `auth.api.*`.
- **Client-side**: `import { authClient, signIn, signUp, signOut, useSession } from "@/lib/auth-client"`.
- Jangan expose `BETTER_AUTH_SECRET` ke sisi client. Variabel env client harus prefiks `NEXT_PUBLIC_`.
- `BETTER_AUTH_SECRET` wajib di-set di `.env` — jangan gunakan nilai default di production.

### Komponen UI
- Semua komponen UI ada di `src/components/ui/`. Tambahkan via `pnpm dlx shadcn@latest add <nama>`.
- Untuk komponen ReUI: `pnpm dlx shadcn@latest add @reui/<nama-komponen>`.
- `cn()` di-import dari `"cn"` (bukan `"clsx"` atau `"tailwind-merge"` secara langsung).
- Komponen `Button` menggunakan `@base-ui/react/button` — jangan timpa dengan implementasi manual.
- Jangan hapus `data-slot` attribute pada komponen UI — dibutuhkan oleh styling Tailwind.

### Styling
- Gunakan Tailwind CSS v4 utility classes — **jangan buat file CSS baru** kecuali untuk variabel global di `src/app/globals.css`.
- CSS variable warna menggunakan format `oklch`. Referensi token di `globals.css`.
- Dark mode menggunakan class `.dark` (bukan `prefers-color-scheme` media query secara langsung).

### Struktur File
```
src/
├── app/              # Next.js App Router (pages, layouts, route handlers)
│   ├── api/auth/     # Better Auth route handler — JANGAN diubah
│   └── globals.css   # Global CSS & Tailwind variables
├── components/
│   ├── ui/           # Komponen shadcn/ui & Base UI
│   └── examples/     # Contoh pola penggunaan komponen
├── db/
│   ├── index.ts      # Singleton koneksi DB
│   └── schema.ts     # Definisi tabel Drizzle
└── lib/
    ├── auth.ts        # Better Auth server config
    ├── auth-client.ts # Better Auth client config
    └── utils.ts       # Re-export cn()
```

### Kualitas Kode
- Jalankan `pnpm lint` sebelum commit. Tidak boleh ada error ESLint.
- Jangan hapus import yang masih dipakai atau biarkan import yang tidak terpakai.
- Gunakan `async/await` — hindari `.then()` yang bersarang.
- Pesan commit menggunakan format Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.

### Keamanan
- Jangan pernah commit file `.env` ke version control.
- Jangan expose kredensial database di frontend.
- Validasi semua input dari user di server sebelum diteruskan ke database.

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
