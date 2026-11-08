import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfileByUserId, ProfileSettingsForm } from "@/modules/profile";
import { DashboardShell } from "@/modules/dashboard";
import { RuneIcon } from "@/components/ui/rune-icon";

export const metadata: Metadata = {
  title: "Pengaturan Profil Akun — OpenLynk",
  description: "Kelola identitas akun, media sosial resmi, dan detail keamanan Anda.",
};

async function ProfileDashboardContent() {
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    session = null;
  }

  if (!session) {
    redirect("/login");
  }

  const profile = await getProfileByUserId(session.user.id);

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
      username={profile?.username}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Settings Form */}
        <ProfileSettingsForm
          userId={session.user.id}
          initialProfile={profile}
        />

        {/* Security & Active Session Details Panel */}
        <div className="rounded-2xl rune-glass border-white/10 p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
              <RuneIcon name="glass-shield-check-1" type="glass" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Keamanan &amp; Sesi Login Aktif
              </h3>
              <p className="text-xs text-neutral-400">
                Informasi teknis autentikasi dan status sesi saat ini.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-neutral-500 block text-[11px]">User ID</span>
              <span className="font-mono text-neutral-300 truncate block mt-0.5" title={session.user.id}>
                {session.user.id}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-neutral-500 block text-[11px]">Status Email</span>
              <span className={`font-medium block mt-0.5 ${session.user.emailVerified ? "text-emerald-400" : "text-amber-400"}`}>
                {session.user.emailVerified ? "✓ Terverifikasi" : "Belum Verifikasi"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-neutral-500 block text-[11px]">Session ID</span>
              <span className="font-mono text-neutral-300 truncate block mt-0.5" title={session.session.id}>
                {session.session.id}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-neutral-500 block text-[11px]">IP Address</span>
              <span className="font-mono text-neutral-300 block mt-0.5">
                {session.session.ipAddress || "127.0.0.1"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default function ProfileDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
          <div className="size-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProfileDashboardContent />
    </Suspense>
  );
}
