---
name: openlynk-db
description: >-
  Use this skill when the user asks to: run a database migration, push schema changes,
  inspect the database schema or data, open Drizzle Studio, add a new table or column
  to the Drizzle schema, or troubleshoot database connection issues in the OpenLynk project.
---

# OpenLynk — Database & Drizzle ORM Workflow

Proyek ini menggunakan **Drizzle ORM** dengan **PostgreSQL** (via package `postgres`).

## File Utama

- **Schema**: [`src/db/schema.ts`](file:///home/thoth/openlynk/src/db/schema.ts)
- **Koneksi DB**: [`src/db/index.ts`](file:///home/thoth/openlynk/src/db/index.ts)
- **Drizzle config**: [`drizzle.config.ts`](file:///home/thoth/openlynk/drizzle.config.ts)
- **Env**: `DATABASE_URL` di `.env`

## Alur Kerja Standar

### Menambah Tabel / Kolom Baru

1. Edit `src/db/schema.ts` — tambahkan definisi tabel atau kolom menggunakan helper Drizzle (`pgTable`, `text`, `timestamp`, dll.).
2. Generate file migrasi:
   ```bash
   pnpm db:generate
   ```
   File migrasi SQL akan dibuat di folder `drizzle/`.
3. Terapkan migrasi ke database:
   ```bash
   pnpm db:migrate
   ```
4. **Validasi**: Buka Drizzle Studio untuk memastikan schema sudah benar:
   ```bash
   pnpm db:studio
   ```

### Push Langsung (Dev Only)

Untuk pengembangan cepat tanpa file migrasi:
```bash
pnpm db:push
```
> ⚠️ Jangan gunakan `db:push` di production — selalu gunakan `db:generate` + `db:migrate`.

### Menginspeksi Data via MCP

Gunakan tool MCP `openlynk-postgres` untuk:
- Melihat daftar tabel: query `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
- Melihat isi tabel: `SELECT * FROM "user" LIMIT 10`
- Cek skema kolom: `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user'`

## Konvensi Schema

```typescript
// Selalu gunakan text() untuk ID (UUID/CUID dari Better Auth)
id: text("id").primaryKey(),

// Timestamp wajib notNull() untuk created_at / updated_at
createdAt: timestamp("created_at").notNull(),
updatedAt: timestamp("updated_at").notNull(),

// Foreign key dengan onDelete cascade untuk entitas turunan
userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
```

## Tabel yang Ada (Better Auth)

| Tabel | Deskripsi |
| :--- | :--- |
| `user` | Data pengguna (id, name, email, emailVerified, image) |
| `session` | Sesi aktif (token, expiresAt, userId) |
| `account` | Provider auth (untuk OAuth di masa depan) |
| `verification` | Token verifikasi email |
