// --- PUBLIC CONSTANT: src/modules/obsidian/data/obsidian-ai-prompt.ts ---

export const OBSIDIAN_AI_MARKDOWN = `# Obsidian Design System — AI Agent & Developer Guide

Panduan resmi instruksi sistem desain Obsidian untuk AI Coding Assistants (Cursor, Claude, ChatGPT, v0, Antigravity) dan tim insinyur perangkat lunak. Terinspirasi oleh filosofi desain monolitik presisi tinggi (seperti Vercel Geist), Obsidian menggabungkan kedalaman tak terbatas, tactile glassmorphism, dan kejelasan tipografi ekstrem.

---

## 🏛️ 1. Arsitektur & Prinsip Inti
- Standar Komponen: Primitif taktil Base UI (@base-ui/react) dipadukan dengan utility Tailwind CSS v4.
- Tipografi: Geist Sans untuk antarmuka pengguna & Geist Mono untuk token, data numerik, dan kode.
- Pendekatan Kode: Server Component by default di Next.js App Router (React 19). "use client" hanya untuk interaktivitas DOM.
- Keamanan Tipe: TypeScript ketat — dilarang keras menggunakan \`any\`. Gunakan \`unknown\` lalu type-narrowing.
- Penulisan Kelas: Gunakan utilitas \`cn()\` dari \`"cn"\` (bukan clsx / tailwind-merge langsung).

---

## 💎 2. Filosofi Visual: Pure Obsidian & Glassmorphism
1. **Obsidian Clarity**: Latar belakang hitam obsidian pekat (\`#09090b\` / \`oklch(0.12 0.012 260)\`) memberikan ruang negatif bernafas dengan kontras tinggi yang menonjolkan konten tanpa distraksi.
2. **Tactile Glassmorphism**: Permukaan kartu kaca semi-transparan (\`.rune-glass\`) dengan border kilau 1px (\`border-white/10\`), multi-layer backdrop blur (\`backdrop-blur-xl\`), dan bayangan kedalaman bertingkat.
3. **Intentional Iconography**: Sistem 5 varian RuneIcon terstruktur sesuai peran fungsional antarmuka (glass, duotone, normal, fill, pixelated).
4. **Instant Feedback**: Setiap sentuhan mikro, hover, drag, maupun status mutasi memberikan respon taktil dalam hitungan milidetik.

---

## 🎨 3. Token Desain & Utilitas CSS Kustom
Gunakan utilitas resmi dari \`src/app/globals.css\`:
- **Kartu Kaca Statis**: \`.rune-glass\` (background semi-transparan, border 1px \`border-white/10\`, backdrop blur)
- **Kartu Kaca Interaktif**: \`.rune-glass .rune-glass-hover\` (efek translateY -2px dan border glow saat disentuh)
- **Capsule Status Pill**: \`.rune-pill\` (border rounded-full, backdrop blur 12px, font medium)
- **Ambient Radial Glow**: \`div\` absolut dengan background radial blur 100px - 160px

---

## 🎨 4. Palet Warna & 5 Tema Resmi
### Core Obsidian Palette:
- \`--background\`: \`#09090b\` (\`oklch(0.12 0.012 260)\`) — Obsidian Canvas
- \`--card\`: \`#121218\` (\`oklch(0.16 0.012 260 / 60%)\`) — Obsidian Surface
- \`--border\`: \`rgba(255, 255, 255, 0.08)\` — Subtle Glass Border
- \`--border-hover\`: \`rgba(255, 255, 255, 0.20)\` — Active Glow Border
- \`--foreground\`: \`#fcfcfd\` (\`oklch(0.985 0 0)\`) — Primary High-Contrast Text
- \`--muted-foreground\`: \`#a1a1aa\` (\`oklch(0.68 0.01 260)\`) — Muted Body Text

### 5 Preset Tema Aksen:
1. **Obsidian Violet** (\`#6366f1\`): Default studio accent
2. **Emerald Luxe** (\`#10b981\`): Prestisius, segar, dan berwibawa
3. **Cyberpunk Neon** (\`#ec4899\`): Kontras tinggi, magenta fuchsia
4. **Sunset Amber** (\`#f59e0b\`): Hangat, jingga senja
5. **Monochrome Stealth** (\`#ffffff\`): Minimalisme perak & monokrom absolut

---

## ✍️ 5. Tipografi & Skala Teks
- **Display Giant**: \`text-4xl sm:text-6xl font-extrabold tracking-tight\`
- **Heading 1 (H1)**: \`text-2xl sm:text-4xl font-bold tracking-tight\`
- **Heading 2 (H2)**: \`text-xl sm:text-2xl font-bold tracking-tight\`
- **Heading 3 (H3)**: \`text-base sm:text-lg font-semibold tracking-tight\`
- **Body Regular**: \`text-sm sm:text-base font-normal leading-relaxed\`
- **Micro / Mono**: \`text-xs font-mono tracking-wide\`

---

## 🔮 6. Sistem Ikonografi: RuneIcon
- **glass**: Kartu sorotan & header visual (\`<RuneIcon name="glass-chain-link-3-1" type="glass" size={24} />\`)
- **duotone**: Status profil & verifikasi (\`<RuneIcon name="identity-shield-check" type="duotone" size={20} />\`)
- **normal**: Navigasi bar & tombol sekunder (\`<RuneIcon name="identity-shield" type="normal" size={18} />\`)
- **fill**: Penekanan & indikator aktif (\`<RuneIcon name="interface-star" type="fill" size={18} />\`)
- **pixelated**: Lencana gamifikasi (\`<RuneIcon name="devices-gamepad" type="pixelated" size={20} />\`)
- **Social Icons**: \`<SocialIcon platform="github" size={20} />\` dari \`@/components/ui/social-icon\`

---

## 🧱 7. Komponen UI Standar Base UI
- **Button**: \`import { Button } from "@/components/ui/button"\`
- **Input**: \`import { Input } from "@/components/ui/input"\`
- **Textarea**: \`import { Textarea } from "@/components/ui/textarea"\`
- **Card**: \`import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"\`
- **Badge**: \`import { Badge } from "@/components/ui/badge"\`
- **Switch**: \`import { Switch } from "@/components/ui/switch"\`
- **Tabs**: \`import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"\`

---

## 📏 8. Aturan Penting AI Coding Agent
1. **Server Component First**: Selalu utamakan Server Component; hanya gunakan \`"use client"\` jika ada interaktivitas client (state, hooks, event listeners).
2. **Tanpa \`new Date()\` Dinamis di Root Client**: Hindari \`new Date().getFullYear()\` langsung dievaluasi saat render client component statis karena menyebabkan hydration/PPR error di Next.js 16. Gunakan tahun konstan (contoh: 2026).
3. **Scroll Window Safe**: Jangan pernah memanggil \`element.scrollIntoView()\` di dalam elemen sticky header; gunakan \`container.scrollTo()\` lokal agar halaman tidak melompat ke atas secara otomatis.
4. **Impor Public API**: Selalu impor melalui modul entrypoint \`src/modules/<modul>/index.ts\` (Modular Monolith).
`;
