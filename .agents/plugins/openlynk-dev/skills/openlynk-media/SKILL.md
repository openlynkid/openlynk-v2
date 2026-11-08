---
name: openlynk-media
description: >-
  Use this skill when configuring ImageKit CDN (@imagekit/next), handling image uploads
  and transformations, setting up or sending transactional emails with Resend (resend),
  or configuring media delivery in OpenLynk.
---

# OpenLynk — Media Delivery (ImageKit) & Transactional Email (Resend)

Panduan konfigurasi dan integrasi penyedia media CDN **ImageKit** (`@imagekit/next`) serta layanan email transaksional **Resend** (`resend`) di OpenLynk.

---

## 🖼️ 1. Pengiriman Media CDN (ImageKit)

OpenLynk menggunakan ImageKit sebagai CDN terpadu untuk mengoptimasi gambar avatar profil, cover banner bento, dan kartu galeri secara real-time.

### Konfigurasi Provider (`src/app/layout.tsx`)
Provider utama dibungkus di root layout aplikasi:

```tsx
import { ImageKitProvider } from "@imagekit/next";

const imagekitUrlEndpoint =
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/openlynk";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <ImageKitProvider urlEndpoint={imagekitUrlEndpoint}>
          {children}
        </ImageKitProvider>
      </body>
    </html>
  );
}
```

### Optimasi URL Gambar & Transformasi Real-Time
ImageKit mendukung transformasi parameter URL tanpa memerlukan pemrosesan gambar di server lokal:

```typescript
export function getOptimizedImageUrl(
  rawUrl: string,
  options: { width?: number; height?: number; quality?: number; format?: "webp" | "auto" } = {}
): string {
  if (!rawUrl) return "/placeholder-avatar.png";

  // Jika URL berasal dari ImageKit, tambahkan parameter transformasi
  if (rawUrl.includes("ik.imagekit.io")) {
    const params: string[] = [];
    if (options.width) params.push(`w-${options.width}`);
    if (options.height) params.push(`h-${options.height}`);
    if (options.quality) params.push(`q-${options.quality}`);
    params.push(`f-${options.format || "auto"}`);

    const transformQuery = `tr=${params.join(",")}`;
    const separator = rawUrl.includes("?") ? "&" : "?";
    return `${rawUrl}${separator}${transformQuery}`;
  }

  return rawUrl;
}
```

---

## 📧 2. Email Transaksional (Resend)

Proyek ini mengintegrasikan **Resend** untuk mengirim email verifikasi akun pengguna, reset kata sandi, dan notifikasi aktivitas tautan.

### Inisialisasi Klien Resend Server
Gunakan singleton klien yang diinisialisasi hanya di sisi server:

```typescript
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || "OpenLynk <noreply@openlynk.id>";
```

### Mengirim Email Reset Kata Sandi
```typescript
import { resend, EMAIL_FROM } from "@/lib/email";

export async function sendPasswordResetEmail({
  email,
  resetUrl,
}: {
  email: string;
  resetUrl: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [email],
      subject: "Atur Ulang Kata Sandi Akun OpenLynk Anda",
      html: `
        <div style="font-family: sans-serif; background: #09090b; color: #ffffff; padding: 32px; border-radius: 16px;">
          <h2 style="color: #818cf8;">Permintaan Reset Kata Sandi</h2>
          <p style="color: #a1a1aa;">Kami menerima permintaan untuk mengatur ulang kata sandi akun OpenLynk Anda.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #ffffff; color: #000000; font-weight: bold; padding: 12px 24px; border-radius: 12px; text-decoration: none; margin-top: 16px;">
            Atur Ulang Kata Sandi
          </a>
          <p style="color: #71717a; font-size: 12px; margin-top: 24px;">Tautan ini berlaku selama 1 jam. Jika Anda tidak meminta ini, abaikan email ini.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Gagal mengirim email via Resend:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan email";
    return { success: false, error: msg };
  }
}
```

---

## ⚙️ Variabel Lingkungan Terkait

| Variable | Scope | Keterangan |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | Client & Server | URL endpoint CDN ImageKit publik |
| `IMAGEKIT_PRIVATE_KEY` | Server-Only | Kunci privat untuk operasi upload server |
| `RESEND_API_KEY` | Server-Only | API key dari dashboard Resend |
| `RESEND_FROM_EMAIL` | Server-Only | Alamat email pengirim terverifikasi (misal: `noreply@openlynk.id`) |

---

## 🔍 Checklist Verifikasi

* [ ] Pastikan `RESEND_API_KEY` dan `IMAGEKIT_PRIVATE_KEY` tidak pernah diakses di file yang memiliki `"use client"`.
* [ ] Uji fallback avatar jika URL gambar kosong atau ImageKit offline.
* [ ] Selalu bungkus pemanggilan `resend.emails.send` dalam blok `try/catch` dengan tipe error `catch (err: unknown)`.
