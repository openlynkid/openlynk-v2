# OpenLynk Design System — AI Agent & Developer Guide

Panduan resmi instruksi sistem desain **OpenLynk** untuk AI Coding Assistants (Cursor, Claude, ChatGPT, v0, Antigravity) dan tim pengembang. Gunakan panduan ini untuk mengkonstruksi antarmuka pengguna yang 100% konsisten dengan estetika dan arsitektur OpenLynk.

---

## 🏛️ 1. Arsitektur & Tech Stack Dasar

* **Framework**: Next.js 16 (App Router, Turbopack) & React 19.
* **Pola Arsitektur**: **Modular Monolith** — semua domain bisnis berada di `src/modules/<nama-modul>/` dengan pintu masuk tunggal `index.ts` (Public API). Dilarang *deep import* ke internal modul lain.
* **Primitif UI**: Base UI (`@base-ui/react`) + shadcn style `base-nova`.
* **Styling**: Tailwind CSS v4 dengan token warna OKLCH.
* **Ikon**: RuneIcon resmi (`runeicons-react`) dengan 5 varian gaya visual.
* **Database & Auth**: PostgreSQL + Drizzle ORM, Better Auth.

---

## 💎 2. Filosofi Desain: Obsidian Glassmorphism

1. **Obsidian Clarity**: Latar belakang hitam obsidian pekat (`oklch(0.12 0.012 260)` / `#09090b`) memberikan ruang negatif bernafas dengan kontras tinggi yang menonjolkan konten utama.
2. **Tactile Glassmorphism**: Permukaan kartu kaca semi-transparan (`.rune-glass`) dengan border kilau 1px (`border-white/10`), multi-layer backdrop blur (`blur(20px)`), dan bayangan bertingkat.
3. **Intentional Iconography**: Memanfaatkan sistem RuneIcon dengan 5 gaya visual terstruktur sesuai semantik antarmuka.
4. **Instant Feedback**: Setiap aksi klik, hover, drag, form input, dan status mutasi memberikan respon visual taktil dalam hitungan milidetik.

---

## 🎨 3. Token Desain & Utilitas CSS Kustom

Gunakan kelas utilitas bawaan yang terdaftar di `src/app/globals.css`:

### A. Permukaan Kaca Kustom
```tsx
// 1. Kartu Kaca Statis (Bento Card, Header, Container Modal)
<div className="rune-glass p-6 rounded-2xl border-white/10 shadow-lg">
  {children}
</div>

// 2. Kartu Kaca Interaktif (Hover Elevation + Inner Shimmer Border)
<div className="rune-glass rune-glass-hover p-6 rounded-2xl border-white/10 cursor-pointer transition-all">
  {children}
</div>

// 3. Capsule Status Pill (Badge Sesi, Status Rilis, Tag Kategori)
<div className="rune-pill">
  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
  <span className="text-xs font-medium text-emerald-300">Sesi Aktif</span>
</div>
```

### B. Ambient Radial Glow (Pencahayaan Latar)
Tempatkan di belakang container hero atau kartu bento utama untuk menghasilkan dimensi ruang:
```tsx
<div className="absolute inset-0 pointer-events-none overflow-hidden">
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-indigo-500/10 blur-[130px] rounded-full" />
  <div className="absolute top-1/2 -right-40 w-[350px] h-[350px] bg-cyan-500/5 blur-[140px] rounded-full" />
</div>
```

---

## 🎨 4. Palet Warna & 5 Tema Resmi

### A. Core Obsidian & Neutral Palette
| Token Token / Variabel | Nilai HEX / OKLCH | Peran Semantik |
| :--- | :--- | :--- |
| `--background` | `#09090b` (`oklch(0.12 0.012 260)`) | Latar belakang aplikasi utama |
| `--card` | `#121218` (`oklch(0.16 0.012 260 / 60%)`) | Dasar kartu bento & modal |
| `--border` | `rgba(255,255,255,0.08)` | Garis batas kartu statis |
| `--border-hover` | `rgba(255,255,255,0.20)` | Garis batas kartu saat hover |
| `--foreground` | `#fcfcfd` (`oklch(0.985 0 0)`) | Teks utama, judul, teks tebal |
| `--muted-foreground` | `#a1a1aa` (`oklch(0.68 0.01 260)`) | Deskripsi, label bantuan, teks sekunder |

### B. 5 Preset Tema Bio-Link
1. **Obsidian Violet** (`#6366f1`): Aksen default platform (indigo-violet & cyan).
2. **Emerald Luxe** (`#10b981`): Nuansa hijau zamrud alami dan prestisius.
3. **Cyberpunk Neon** (`#ec4899`): Aksen fuchsia magenta berenergi tinggi.
4. **Sunset Amber** (`#f59e0b`): Kehangatan jingga senja dan rose.
5. **Monochrome Stealth** (`#ffffff`): Minimalisme murni hitam pekat dan perak.

---

## ✍️ 5. Tipografi & Skala Teks

* **Font Utama UI**: Geist Sans (`font-sans` / `--font-sans`) untuk teks judul, paragraf, dan tombol.
* **Font Data & Kode**: Geist Mono (`font-mono` / `--font-mono`) untuk URL handle, kode warna, angka metrik, dan badge.

### Hirarki Teks:
* **Display Hero**: `text-4xl sm:text-6xl font-extrabold tracking-tight text-white`
* **Heading 1**: `text-2xl sm:text-4xl font-bold tracking-tight text-white`
* **Heading 2**: `text-xl sm:text-2xl font-bold tracking-tight text-white`
* **Heading 3 (Card Title)**: `text-base sm:text-lg font-semibold text-white`
* **Body Regular**: `text-sm sm:text-base text-neutral-400 leading-relaxed`
* **Body Compact**: `text-xs sm:text-sm text-neutral-400`
* **Micro Label**: `text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-500`

---

## 🔮 6. Sistem Ikonografi: RuneIcon (`runeicons-react`)

Gunakan pustaka resmi `runeicons-react` dengan memilih varian `type` yang sesuai kebutuhan semantik:

| Gaya (`type`) | Karakteristik & Kegunaan | Contoh Kode JSX |
| :--- | :--- | :--- |
| **`glass`** | **Aksen Hero & Kartu Utama**: Tekstur kaca prisma dengan refraksi dan kedalaman gradien | `<RuneIcon name="glass-chain-link-3-1" type="glass" size={24} />` |
| **`duotone`** | **Status & Verifikasi**: Dua nada kontras lembut | `<RuneIcon name="identity-shield-check" type="duotone" size={20} />` |
| **`normal`** | **Navigasi & Input Prefix**: Garis stroke minimalis seragam | `<RuneIcon name="identity-shield" type="normal" size={18} />` |
| **`fill`** | **Penekanan & Tab Aktif**: Bentuk pejal solid | `<RuneIcon name="interface-star" type="fill" size={18} />` |
| **`pixelated`** | **Retro & Gamifikasi**: Estetika 8-bit untuk lencana statistik | `<RuneIcon name="devices-gamepad" type="pixelated" size={20} />` |

Untuk ikon media sosial, selalu gunakan `<SocialIcon platform="github" size={20} />` dari `@/components/ui/social-icon`.

---

## 🧱 7. Standar Primitif Komponen Base UI

Komponen berada di `src/components/ui/`:

### A. Tombol (`Button`)
```tsx
import { Button } from "@/components/ui/button";

// Primary
<Button className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs h-9 px-4">
  Simpan Perubahan
</Button>

// Outline Glass
<Button variant="outline" className="border-white/10 text-neutral-300 hover:bg-white/5 rounded-xl text-xs h-9 px-4">
  Batal
</Button>

// Destructive
<Button variant="destructive" className="bg-red-600/90 hover:bg-red-600 text-white rounded-xl text-xs h-9 px-4">
  Hapus Blok
</Button>
```

### B. Input & Feedback Validasi Formulir
Sesuai standar UX OpenLynk, selalu sediakan umpan balik visual yang jelas:
```tsx
import { Input } from "@/components/ui/input";

// Input Berbasis Base UI
<Input
  type="text"
  className="h-10 bg-black/40 border-white/10 focus-visible:ring-indigo-500 rounded-xl text-xs text-neutral-100 placeholder:text-neutral-500 font-mono"
  placeholder="openlynk.id/username"
/>

// Feedback Alert Sukses
<div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-2">
  <span>✓</span>
  <span>Slug profil tersedia dan siap digunakan.</span>
</div>

// Feedback Alert Error
<div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/70 text-red-200 text-xs flex items-center gap-2">
  <span>⚠️</span>
  <span>Slug hanya boleh huruf kecil, angka, dan tanda hubung (-).</span>
</div>
```

---

## 📏 8. Aturan Koding AI Agent (Do's & Don'ts)

* ✅ **Server Component by default**: Tambahkan `"use client"` hanya jika komponen membutuhkan React hooks (`useState`, `useEffect`) atau browser event listener.
* ✅ **Gunakan utility `cn` dari `"cn"`**: `import { cn } from "cn";` (bukan dari clsx atau tailwind-merge langsung).
* ✅ **Tipe Ketat (Strict Mode)**: Dilarang keras menggunakan tipe `any`. Gunakan `unknown` lalu narrowing/type guard.
* ✅ **Nilai Waktu Prerender**: Jangan mengevaluasi `new Date().getFullYear()` di dalam render root Client Component statis (memicu error Next.js 16 PPR). Gunakan tahun statis konstan `2026`.
* ✅ **Modular Monolith**: Impor antar modul domain selalu melalui `src/modules/<nama-modul>/index.ts` (Public API). Dilarang deep import.
