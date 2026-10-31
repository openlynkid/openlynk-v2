<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# OpenLynk Project Rules & Architecture

Untuk aturan lengkap dan terpadu, lihat: [`.agents/plugins/openlynk-dev/rules/AGENTS.md`](./.agents/plugins/openlynk-dev/rules/AGENTS.md)

## 🛑 1. Planning First (Wajib Rencanakan Sebelum Berubah)
Sebelum memodifikasi atau membuat fitur:
1. **Analisis scope**: Bounded context modul mana yang terpengaruh (`src/modules/<nama-modul>/`).
2. **Susun rencana kerja langkah-demi-langkah**:
   - Schema & DB
   - Server Actions / Business Logic
   - UI / Components
   - App Router Integration (Delivery Layer)
   - Verifikasi (`pnpm lint`, `pnpm build`)
3. Diskusikan jika ada trade-off arsitektur atau breaking changes.

## 🏛️ 2. Modular Monolith Architecture
- Organisasi kode fitur berbasis domain di `src/modules/<nama-modul>/`:
  - `components/`: UI khusus modul.
  - `server/`: Server actions, queries, logic bisnis.
  - `types/`: Tipe internal modul.
  - `index.ts`: **Public API** modul. Impor dari luar modul **WAJIB** melalui file ini (dilarang deep import).
- **No Circular Dependencies** antar modul domain.
- `src/app/` hanya berfungsi sebagai **Thin Delivery Layer** (routing, layout, metadata), bukan tempat business logic berat.
- Primitif bersama tetap berada di `src/components/ui/`, `src/lib/`, `src/db/`.
