---
name: openlynk-ui
description: >-
  Use this skill when the user asks to: add a new UI component from shadcn or ReUI,
  create a new page or layout, work with Tailwind CSS styling, use Base UI primitives,
  or follow the design system conventions for the OpenLynk project.
---

# OpenLynk — UI Components & Styling

Proyek ini menggunakan **shadcn/ui** dengan style `base-nova`, komponen primitif dari **Base UI** (`@base-ui/react`), dan **Tailwind CSS v4**.

## Menambah Komponen

### Komponen shadcn/ui standar
```bash
pnpm dlx shadcn@latest add <nama>
# Contoh:
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add table
```

### Komponen dari ReUI registry
```bash
pnpm dlx shadcn@latest add @reui/<nama>
# Contoh:
pnpm dlx shadcn@latest add @reui/c-button-1
pnpm dlx shadcn@latest add @reui/c-table-1
```

Komponen akan diletakkan di `src/components/ui/`.

## Komponen yang Sudah Ada

| Komponen | File | Primitif |
| :--- | :--- | :--- |
| `Button` | `src/components/ui/button.tsx` | `@base-ui/react/button` |
| `Input` | `src/components/ui/input.tsx` | `@base-ui/react/input` |
| `Label` | `src/components/ui/label.tsx` | HTML `<label>` |
| `Card`, `CardHeader`, dll | `src/components/ui/card.tsx` | HTML `<div>` |

## Konvensi Styling

### Penggunaan `cn()`
```typescript
import { cn } from "cn"; // Selalu dari "cn", bukan "clsx"

<div className={cn("base-class", condition && "conditional-class", className)} />
```

### CSS Variables (Tailwind v4)
Warna menggunakan token dari `globals.css`:
```css
/* Contoh penggunaan token */
bg-background text-foreground    /* Warna dasar */
bg-primary text-primary-foreground  /* Warna utama */
bg-muted text-muted-foreground   /* Warna redup */
border-border                    /* Warna border */
```

### Dark Mode
Dark mode menggunakan class `.dark` pada `<html>`. Gunakan Tailwind `dark:` prefix:
```tsx
<div className="bg-white dark:bg-neutral-900">
```

## Pola Layout Halaman

```tsx
// Server Component (default)
export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur">
        {/* navbar */}
      </header>
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* konten */}
      </main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        {/* footer */}
      </footer>
    </div>
  );
}
```

## Struktur File Layout
```
src/app/
├── layout.tsx        # Root layout (font Inter, metadata)
├── globals.css       # Tailwind import & CSS variables
└── [route]/
    └── page.tsx      # Halaman
```

## Font
Font `Inter` sudah dikonfigurasi sebagai `--font-sans` di `layout.tsx`. Tidak perlu menambahkan font baru kecuali ada kebutuhan spesifik.
