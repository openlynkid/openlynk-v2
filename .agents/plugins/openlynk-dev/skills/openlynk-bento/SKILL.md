---
name: openlynk-bento
description: >-
  Use this skill when developing, refactoring, or debugging the Bento Grid engine,
  interactive Bento Studio canvas, Pragmatic Drag and Drop (@atlaskit/pragmatic-drag-and-drop),
  rich bento block types (bento-card, note-card, media-embed, social-row, github-card, image-card,
  map-card, header-text), block spans, or canvas state in OpenLynk.
---

# OpenLynk — Bento Grid Engine & Interactive Studio

Panduan teknis dan alur kerja untuk mengembangkan sistem **Bento Grid**, editor kanvas interaktif, dan ragam blok bento di proyek OpenLynk.

---

## 🏛️ Arsitektur Direktori Bento (`src/modules/page/`)

```text
src/modules/page/
├── components/
│   ├── bento-grid.tsx                 # Engine renderer bento grid untuk halaman publik
│   ├── blocks/                        # Implementasi renderer masing-masing tipe blok
│   │   ├── bento-card-block.tsx       # Blok kartu standar (link + ikon + judul)
│   │   ├── note-card-block.tsx        # Blok catatan, quote, atau pengumuman
│   │   ├── media-embed-block.tsx      # Embed YouTube, Spotify, atau audio
│   │   ├── social-row-block.tsx       # Baris ikon media sosial
│   │   ├── github-card-block.tsx      # Repositori GitHub & live stars
│   │   ├── image-card-block.tsx       # Gambar mandiri / artwork
│   │   ├── map-card-block.tsx         # Lokasi / peta interaktif
│   │   └── header-text-block.tsx      # Pemisah section & teks judul besar
│   └── studio/                        # Bento Studio Canvas Builder (Editor Drag & Drop)
│       ├── page-studio-builder.tsx    # Root container editor studio
│       ├── studio-canvas.tsx          # Area kanvas grid drop target
│       ├── studio-grid-item.tsx       # Item blok draggable dengan pegangan (handle)
│       ├── studio-ghost-card.tsx      # Indikator visual saat drag berlangsung
│       ├── studio-header.tsx          # Toolbar atas studio (save, preview, undo)
│       ├── block-library-drawer.tsx   # Laci katalog untuk menambahkan blok baru
│       ├── block-inspector-drawer.tsx # Laci konfigurasi properti blok terpilih
│       └── page-settings-drawer.tsx   # Pengaturan umum halaman & tema
├── server/
│   ├── page-service.ts                # Server actions (reorder, update block, save)
│   ├── page-validation.ts             # Skema validasi Zod untuk mutasi blok
│   └── embed-helpers.ts               # Helper parser URL embed YouTube/Spotify
└── types/
    ├── index.ts                       # Definisi tipe Block, BlockType, BentoSpan
    └── themes.ts                      # Preset tema visual bento
```

---

## 📐 Sistem Grid & Ukuran Span

Bento Grid OpenLynk menggunakan sistem grid responsif (1 kolom di mobile, 2 kolom di tablet, hingga 4 kolom di desktop).

| Span Token | Ukuran Kolom x Baris | Karakteristik & Kegunaan |
| :--- | :--- | :--- |
| **`1x1`** | `col-span-1 row-span-1` | Kotak persegi standar: tautan ringkas, media sosial tunggal, metrik angka. |
| **`2x1`** | `col-span-2 row-span-1` | Persegi panjang melebar horizontal: highlight tautan, artikel, status panjang. |
| **`1x2`** | `col-span-1 row-span-2` | Vertikal tinggi: kartu poster, gambar vertikal, daftar poin. |
| **`2x2`** | `col-span-2 row-span-2` | Blok besar: media player embed, video tutorial, peta lokasi interaktif. |

### Pemetaan Class Tailwind Span:
```typescript
export function getSpanClass(span: BentoSpan): string {
  switch (span) {
    case "2x1":
      return "col-span-1 sm:col-span-2 row-span-1";
    case "1x2":
      return "col-span-1 row-span-2";
    case "2x2":
      return "col-span-1 sm:col-span-2 row-span-2";
    case "1x1":
    default:
      return "col-span-1 row-span-1";
  }
}
```

---

## 🖐️ Integrasi Drag & Drop (`@atlaskit/pragmatic-drag-and-drop`)

OpenLynk menggunakan Pragmatic Drag and Drop dari Atlassian untuk performa instan tanpa overhead virtual DOM berat.

### 1. Pola Draggable Item (`studio-grid-item.tsx`):
```typescript
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

useEffect(() => {
  const el = ref.current;
  if (!el) return;

  return draggable({
    element: el,
    getInitialData: () => ({ type: "bento-block", blockId: block.id, index }),
    onDragStart: () => setIsDragging(true),
    onDrop: () => setIsDragging(false),
  });
}, [block.id, index]);
```

### 2. Pola Drop Target dengan Hitbox Reorder:
```typescript
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { attachClosestEdge, extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

useEffect(() => {
  const el = ref.current;
  if (!el) return;

  return dropTargetForElements({
    element: el,
    getData: ({ input }) => {
      return attachClosestEdge({ blockId: block.id, index }, {
        input,
        element: el,
        allowedEdges: ["left", "right", "top", "bottom"],
      });
    },
    onDrop: ({ source, self }) => {
      const edge = extractClosestEdge(self.data);
      onReorder(source.data.blockId as string, block.id, edge);
    },
  });
}, [block.id, index, onReorder]);
```

---

## 🧱 Menambahkan Tipe Blok Baru

Untuk menambahkan tipe blok baru ke dalam Bento Studio:

1. **Tambahkan tipe ke `src/modules/page/types/index.ts`**:
   ```typescript
   export type BlockType =
     | "bento_card"
     | "note_card"
     | "media_embed"
     // ...
     | "nama_tipe_baru";
   ```
2. **Buat renderer komponen di `src/modules/page/components/blocks/nama-tipe-baru-block.tsx`**:
   * Pertahankan atribut gaya obsidian glassmorphism (`.rune-glass`, border subtle).
   * Tangani fallback jika data blok kosong atau format data belum lengkap.
3. **Daftarkan di renderer utama `bento-grid.tsx`**:
   Tambahkan blok baru ke dalam `switch (block.type)` untuk rendering sisi publik.
4. **Daftarkan di `block-library-drawer.tsx`**:
   Tambahkan entri katalog dengan ikon RuneIcon, nama, deskripsi, dan default span.
5. **Tambahkan kontrol edit di `block-inspector-drawer.tsx`**:
   Sediakan input form (Base UI Input, Switch, Textarea) untuk memodifikasi properti blok.
6. **Perbarui Skema Validasi Server di `src/modules/page/server/page-validation.ts`**:
   Validasi payload JSON yang dikirimkan saat blok disimpan.

---

## 🧪 Verifikasi & QA Bento Studio

* **Drag & Drop Reorder**: Pastikan urutan tersimpan secara optimistik di UI lalu disinkronisasi ke server action `reorderBlocksAction`.
* **Span Responsif**: Pastikan blok `2x1` atau `2x2` otomatis menjadi 1 kolom penuh di layar mobile tanpa *horizontal scroll overflow*.
* **XSS Sanitization**: Pastikan seluruh URL link, iframe embed, atau teks catatan disanitasi menggunakan helper `src/modules/page/server/embed-helpers.ts` sebelum dirender.
