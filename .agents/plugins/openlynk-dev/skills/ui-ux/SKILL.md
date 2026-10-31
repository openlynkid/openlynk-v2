---
name: ui-ux
description: >-
  Use this skill when designing UI/UX, crafting user interfaces, applying Runeicon theme,
  obsidian glassmorphism, responsive layouts, accessibility (a11y), Tailwind CSS v4 styling,
  Base UI primitives, animations, micro-interactions, or evaluating design consistency in OpenLynk.
---

# OpenLynk UI/UX Design & Engineering Guide

Panduan standar desain UI/UX untuk proyek **OpenLynk**, mengadopsi estetika **Runeicon**, tema **Obsidian Glassmorphism**, primitif **Base UI**, dan **Tailwind CSS v4**.

---

## 💎 Filosofi Desain OpenLynk

1. **Obsidian Clarity**: Latar belakang hitam obsidian pekat (`oklch(0.12 0.012 260)`) memberikan kontras tinggi bagi teks putih dan aksen halus.
2. **Tactile Glassmorphism**: Permukaan kartu semi-transparan dengan efek kabut (*backdrop blur*), border tipis berkilau (`border-white/10`), dan bayangan bertingkat.
3. **Intentional Iconography**: Memanfaatkan ikon RuneIcon dengan 5 gaya visual yang memiliki fungsi semantik jelas.
4. **Instant Feedback**: Setiap aksi pengguna (klik, input, hover, error, sukses) harus memiliki respon visual yang halus dan jelas.

---

## 🎨 Sistem Desain: Obsidian Glassmorphism

Gunakan kelas utilitas khusus yang didefinisikan di [`src/app/globals.css`](file:///home/thoth/openlynk/src/app/globals.css):

### 1. Panel & Kartu Kaca (`.rune-glass` & `.rune-glass-hover`)
```tsx
// Kartu Kaca Statis
<div className="rune-glass p-6 rounded-2xl border-white/10">
  <h3 className="text-white font-semibold">Judul Kartu</h3>
</div>

// Kartu Kaca Interaktif (Hover Efek)
<div className="rune-glass rune-glass-hover p-6 rounded-2xl border-white/10 cursor-pointer">
  <h3 className="text-white font-semibold">Kartu Interaktif</h3>
</div>
```

### 2. Status Badge / Pill (`.rune-pill`)
Gunakan untuk menampilkan status aktif, badge kategori, atau label fitur:
```tsx
<div className="rune-pill">
  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
  <span className="text-xs font-medium text-emerald-300">Sesi Aktif</span>
</div>
```

### 3. Ambient Glow Lighting
Tambahkan pencahayaan latar radial halus di belakang elemen hero atau kartu utama:
```tsx
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-[130px] pointer-events-none rounded-full" />
```

---

## 🔮 Panduan Ikon: RuneIcon (`runeicons-react`)

Proyek ini menggunakan paket resmi `runeicons-react`. Ikon tersedia dalam 5 varian gaya:

| Gaya (`type`) | Contoh Nama | Karakter & Kegunaan |
| :--- | :--- | :--- |
| **`glass`** | `glass-chain-link-3-1`, `glass-lock-1`, `glass-email` | **Aksen Utama**: Hero section, logo, kartu fitur unggulan, dan header modal. |
| **`duotone`** | `identity-shield-check`, `identity-user-plus` | **Status / Identitas**: Menampilkan dua nada kedalaman pada daftar item atau kartu profil. |
| **`normal`** (Outline) | `identity-shield`, `documents-file-lock` | **UI Minimalis**: Navigasi bar, tombol sekunder, dan input prefix. |
| **`fill`** | `identity-shield-check` | **Penekanan**: Tab aktif, badge konfirmasi, atau status terselesaikan. |
| **`pixelated`** | `identity-shield` | **Retro / Gamifikasi**: Elemen statistik, badge prestasi, atau easter eggs. |

### Contoh Penggunaan Komponen:
```tsx
import { RuneIcon } from "runeicons-react";

// Ikon Glass (Default hero/branding)
<RuneIcon name="glass-chain-link-3-1" type="glass" size={28} />

// Ikon Duotone (Status profil)
<RuneIcon name="identity-user-plus" type="duotone" size={20} />

// Ikon Normal (Navigasi)
<RuneIcon name="identity-shield" type="normal" size={18} />
```

---

## 🧱 Komponen Primitif (Base UI + Tailwind v4)

Komponen UI bersama berada di `src/components/ui/`:
* **`Button`**: Berbasis `@base-ui/react/button`.
  * Primary: `bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl`
  * Secondary / Outline: `border-white/10 text-neutral-300 hover:bg-white/5 rounded-xl`
* **`Input`**: Berbasis `@base-ui/react/input`.
  * Styling standar: `border-white/10 bg-black/40 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-indigo-500 rounded-xl`
* **`Label`**: Ukuran teks `text-xs font-medium text-neutral-300`.
* **Utility `cn()`**: Selalu impor dari `"cn"` (`import { cn } from "cn"`).

---

## 🚦 Pola State UX & Umpan Balik

### 1. State Pemuatan (*Loading State*)
* Tampilkan spinner berputar tipis dengan warna aksen indigo/sky:
  ```tsx
  <div className="size-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
  ```
* Tombol submit harus dinonaktifkan (`disabled={loading}`) dengan label *"Memproses..."*.

### 2. Pesan Peringatan & Sukses (*Alert Feedback*)
* **Error**: Latar belakang merah lembut transparan dengan border tegas:
  ```tsx
  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
    <span>⚠️</span>
    <span>{errorMessage}</span>
  </div>
  ```
* **Success**: Latar belakang hijau emerald transparan:
  ```tsx
  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2">
    <span>✓</span>
    <span>{successMessage}</span>
  </div>
  ```

---

## ♿ Standar Aksesibilitas (a11y) & Responsivitas

* **Keyboard Focus**: Semua elemen interaktif (`<Button>`, `<Input>`, `<Link>`) harus memiliki ring fokus yang terlihat jelas saat di-tab (`focus-visible:ring-2 focus-visible:ring-indigo-500`).
* **Semantic HTML**: Gunakan elemen `<main>`, `<header>`, `<footer>`, `<form>`, `<label>` dengan atribut `htmlFor` yang cocok ke `id` input.
* **Mobile-First Layout**: Gunakan breakpoint Tailwind (`sm:`, `md:`, `lg:`) untuk menyesuaikan ukuran teks, grid kolom, dan padding halaman.
