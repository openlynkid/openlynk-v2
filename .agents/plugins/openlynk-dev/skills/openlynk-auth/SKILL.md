---
name: openlynk-auth
description: >-
  Use this skill when the user asks to: add route/page protection, implement session checks,
  add a new auth provider (OAuth, magic link, etc.), customize the login/signup flow,
  or troubleshoot authentication issues in the OpenLynk project.
---

# OpenLynk — Autentikasi (Better Auth)

Proyek ini menggunakan **Better Auth** dengan adapter Drizzle dan email/password authentication.

## File Utama

- **Server config**: [`src/lib/auth.ts`](file:///home/thoth/openlynk/src/lib/auth.ts)
- **Client config**: [`src/lib/auth-client.ts`](file:///home/thoth/openlynk/src/lib/auth-client.ts)
- **Route handler**: [`src/app/api/auth/[...all]/route.ts`](file:///home/thoth/openlynk/src/app/api/auth/[...all]/route.ts)
- **Login page**: [`src/app/login/page.tsx`](file:///home/thoth/openlynk/src/app/login/page.tsx)
- **Dashboard**: [`src/app/dashboard/page.tsx`](file:///home/thoth/openlynk/src/app/dashboard/page.tsx)

## Cara Proteksi Halaman

### Server Component / Layout
```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const session = await auth.api.getSession({ headers: await headers() });
if (!session) redirect("/login");
```

### Client Component
```typescript
"use client";
import { authClient } from "@/lib/auth-client";

const { data: session, isPending } = authClient.useSession();

if (isPending) return <LoadingSpinner />;
if (!session) return <AccessDenied />;
```

## Operasi Auth Client-Side

```typescript
import { signIn, signUp, signOut } from "@/lib/auth-client";

// Sign up
await authClient.signUp.email({ email, password, name }, {
  onSuccess: () => router.push("/dashboard"),
  onError: (ctx) => setError(ctx.error.message),
});

// Sign in
await authClient.signIn.email({ email, password }, {
  onSuccess: () => router.push("/dashboard"),
  onError: (ctx) => setError(ctx.error.message),
});

// Sign out
await authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/login") } });
```

## Menambah Provider OAuth

1. Install plugin yang sesuai (misalnya Google):
   ```typescript
   // src/lib/auth.ts
   import { betterAuth } from "better-auth";
   import { socialProviders } from "better-auth/providers";

   export const auth = betterAuth({
     // ...existing config...
     socialProviders: {
       google: {
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
       },
     },
   });
   ```
2. Tambahkan env vars di `.env`.
3. Jalankan `pnpm db:generate && pnpm db:migrate` jika skema berubah (biasanya tidak perlu untuk OAuth standar).

## Environment Variables

| Variable | Scope | Keterangan |
| :--- | :--- | :--- |
| `BETTER_AUTH_SECRET` | Server | Secret key — wajib panjang dan acak |
| `BETTER_AUTH_URL` | Server | URL base aplikasi |
| `NEXT_PUBLIC_APP_URL` | Client | URL base untuk `authClient` |
