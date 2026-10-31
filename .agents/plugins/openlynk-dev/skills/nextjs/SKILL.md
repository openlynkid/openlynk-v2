---
name: nextjs
description: >-
  Use this skill when developing Next.js features, working with Next.js 16 App Router, Turbopack,
  Server & Client Components, Server Actions, Route Handlers, Cache Components, Partial Prefetching,
  metadata, dynamic routing, or troubleshooting Next.js prerendering and build errors in OpenLynk.
---

# Next.js 16 Development Guide (OpenLynk)

Panduan ini berisi arsitektur, konvensi, dan solusi masalah teknis untuk **Next.js 16 (App Router)** dengan **Turbopack** dan **React 19** di proyek OpenLynk.

---

## 🏛️ Pola Arsitektur: Thin Delivery Layer

Di OpenLynk, folder `src/app/` berfungsi murni sebagai **Thin Delivery Layer**:
* **`page.tsx` & `layout.tsx`**: Hanya mengorkestrasi UI, layout, dan metadata. Hindari menulis logika bisnis berat atau manipulasi database langsung di file halaman.
* **Domain Modules**: Logika bisnis, server actions, dan komponen domain harus berada di `src/modules/<nama-modul>/`.
* Impor ke halaman selalu melalui **Public API** modul:
  ```tsx
  // ✅ Benar
  import { LoginForm } from "@/modules/auth";
  import { DashboardView } from "@/modules/dashboard";

  // ❌ Dilarang (Deep Import)
  import { LoginForm } from "@/modules/auth/components/login-form";
  ```

---

## ⚡ Server Components vs Client Components

### 1. Server Components (Default)
Semua komponen di Next.js App Router adalah **Server Component** secara default kecuali ditandai `"use client"`.
* Gunakan Server Component untuk data fetching, render statis, dan SEO metadata.
* Server Component dapat mengeksekusi kode asynchronous langsung (`async function Page()`).

### 2. Client Components (`"use client"`)
Tambahkan direktif `"use client"` di baris paling atas hanya jika komponen:
* Menggunakan React hooks (`useState`, `useEffect`, `useCallback`, dsb.).
* Menggunakan browser event listener (`onClick`, `onChange`, `onSubmit`).
* Menggunakan browser-only APIs (`window`, `localStorage`) atau client hooks (`useRouter`, `useSearchParams`).

> [!TIP]
> **Push Client Boundaries Down**: Jadikan `page.tsx` sebagai Server Component, dan bungkus interaktivitas di dalam komponen terpisah di `src/modules/<modul>/components/`.

---

## 🚀 Fitur Next.js 16: Cache Components & Partial Prefetching

Proyek ini mengaktifkan `cacheComponents: true` dan `partialPrefetching: true` di `next.config.ts`. Perhatikan aturan berikut saat membuat halaman:

### 1. Nilai Dinamis Waktu Prerender (`new Date()`, random, dll.)
* **Masalah**: Memanggil `new Date()` langsung di dalam template Server Component statis memicu error prerender:
  `Error: Route "...": Next.js encountered the unstable value new Date() while prerendering.`
* **Solusi**:
  1. Untuk teks statis (misal copyright tahun), gunakan nilai statis konstan: `2026`.
  2. Jika memang membutuhkan tanggal dinamis pengguna, render di Client Component (`"use client"`).
  3. Atau gunakan `"use cache"` bila data berasal dari backend yang di-cache.

### 2. Komponen yang Menggunakan `useSearchParams()`
Setiap Client Component yang memanggil `useSearchParams()` **WAJIB** dibungkus dalam `<Suspense>` boundary untuk mencegah *de-opting* seluruh halaman menjadi client-rendered:

```tsx
import { Suspense } from "react";
import { ResetPasswordFormContent } from "./reset-password-form-content";

export function ResetPasswordForm() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
```

---

## 🛡️ Proteksi Halaman & Sesi

### Di Sisi Server (Server Component / Layout / Route Handler)
```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return <div>Halo, {session.user.name}</div>;
}
```

### Di Sisi Client (Client Component)
```tsx
"use client";

import { authClient } from "@/lib/auth-client";

export function ClientProtected() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div>Memuat sesi...</div>;
  if (!session) return <div>Akses ditolak</div>;

  return <div>Halo, {session.user.name}</div>;
}
```

---

## 🧭 Navigasi & Redirect

* Selalu gunakan `next/navigation` (jangan pernah import dari `next/router`).
* Navigasi imperatif:
  ```tsx
  import { useRouter } from "next/navigation";
  const router = useRouter();
  router.push("/dashboard");
  ```
* Navigasi deklaratif menggunakan `<Link href="...">` dari `next/link`.

---

## 🛠️ Langkah Verifikasi Standar
Setiap kali menambahkan atau mengubah rute/komponen Next.js:
1. `pnpm lint` — Pastikan 0 error ESLint (tidak ada unused vars, no `any`).
2. `pnpm build` — Verifikasi TypeScript typecheck dan prerendering semua rute.
