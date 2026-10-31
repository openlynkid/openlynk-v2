import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const fromEmail = process.env.EMAIL_FROM ?? "OpenLynk <noreply@openlynk.local>";
const appUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  baseURL: appUrl,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: "Reset kata sandi Anda — OpenLynk",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
            <h2 style="color:#0ea5e9">Reset Kata Sandi</h2>
            <p>Halo <strong>${user.name}</strong>,</p>
            <p>Kami menerima permintaan untuk mereset kata sandi akun Anda.</p>
            <p>
              <a href="${url}" style="display:inline-block;padding:10px 20px;background:#0ea5e9;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
                Reset Kata Sandi
              </a>
            </p>
            <p style="color:#888;font-size:13px">
              Tautan ini berlaku selama 1 jam. Jika Anda tidak meminta reset ini, abaikan email ini.
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
            <p style="color:#aaa;font-size:12px">OpenLynk &copy; ${new Date().getFullYear()}</p>
          </div>
        `,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: "Verifikasi email Anda — OpenLynk",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
            <h2 style="color:#0ea5e9">Selamat Datang di OpenLynk!</h2>
            <p>Halo <strong>${user.name}</strong>,</p>
            <p>Terima kasih sudah mendaftar. Klik tombol di bawah untuk memverifikasi alamat email Anda.</p>
            <p>
              <a href="${url}" style="display:inline-block;padding:10px 20px;background:#0ea5e9;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
                Verifikasi Email
              </a>
            </p>
            <p style="color:#888;font-size:13px">
              Jika Anda tidak mendaftar di OpenLynk, abaikan email ini.
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
            <p style="color:#aaa;font-size:12px">OpenLynk &copy; ${new Date().getFullYear()}</p>
          </div>
        `,
      });
    },
  },
});
