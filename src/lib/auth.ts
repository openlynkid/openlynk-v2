import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const fromEmail = process.env.EMAIL_FROM ?? "OpenLynk <noreply@openlynk.local>";
const appUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

/**
 * Mencetak tautan verifikasi atau reset password langsung ke terminal server
 * sebagai fallback andal saat Resend belum aktif atau gagal mengirim email.
 */
function logTerminalAuthFallback(
  type: "VERIFIKASI EMAIL" | "RESET PASSWORD",
  recipient: { name?: string | null; email: string },
  url: string
) {
  const border = "═".repeat(68);
  console.log(`\n\x1b[36m${border}\x1b[0m`);
  console.log(`\x1b[1m\x1b[33m🔔 [OPENLYNK AUTH TERMINAL FALLBACK] ${type}\x1b[0m`);
  console.log(`\x1b[36m${border}\x1b[0m`);
  console.log(`👤 Pengguna : \x1b[1m${recipient.name || "User"}\x1b[0m`);
  console.log(`📧 Email    : \x1b[1m${recipient.email}\x1b[0m`);
  console.log(`🔗 Tautan   : \x1b[4m\x1b[32m${url}\x1b[0m`);
  console.log(
    `\x1b[90m👉 Salin dan buka tautan di atas di browser untuk melanjutkan proses.\x1b[0m`
  );
  console.log(`\x1b[36m${border}\x1b[0m\n`);
}

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
      // 1. Fallback verifikasi langsung ke terminal server
      logTerminalAuthFallback("RESET PASSWORD", user, url);

      // 2. Kirim via Resend jika API key valid
      try {
        const isDummyKey =
          !process.env.RESEND_API_KEY ||
          process.env.RESEND_API_KEY.includes("your_resend_api_key");

        if (!isDummyKey) {
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
                <p style="color:#aaa;font-size:12px">OpenLynk &copy; 2026</p>
              </div>
            `,
          });
        }
      } catch (err: unknown) {
        console.warn(
          "⚠️ [AUTH] Gagal mengirim email reset via Resend. Tautan fallback tersedia di terminal server di atas.",
          err
        );
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // 1. Fallback verifikasi langsung ke terminal server
      logTerminalAuthFallback("VERIFIKASI EMAIL", user, url);

      // 2. Kirim via Resend jika API key valid
      try {
        const isDummyKey =
          !process.env.RESEND_API_KEY ||
          process.env.RESEND_API_KEY.includes("your_resend_api_key");

        if (!isDummyKey) {
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
                <p style="color:#aaa;font-size:12px">OpenLynk &copy; 2026</p>
              </div>
            `,
          });
        }
      } catch (err: unknown) {
        console.warn(
          "⚠️ [AUTH] Gagal mengirim email verifikasi via Resend. Tautan fallback tersedia di terminal server di atas.",
          err
        );
      }
    },
  },
});
