import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RuneIcon } from "runeicons-react";
import { auth } from "@/lib/auth";
import { getProfileByUserId, upsertProfile } from "@/modules/profile";
import { getPagesByProfileId, PagesListView } from "@/modules/page";

export const metadata: Metadata = {
  title: "Kelola Halaman Micro-site — OpenLynk",
  description: "Kelola daftar halaman publik dan micro-site Anda.",
};

async function PagesDashboardContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  let profile = await getProfileByUserId(session.user.id);

  // Auto initialize default profile if first time
  if (!profile) {
    const rawUsername = (session.user.email.split("@")[0] || "user")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");
    const safeUsername = rawUsername.length >= 3 ? rawUsername : `user_${session.user.id.slice(0, 4)}`;

    const res = await upsertProfile(session.user.id, {
      username: safeUsername,
      displayName: session.user.name || "Kreator OpenLynk",
    });

    if (res.success) {
      profile = res.data;
    } else {
      redirect("/dashboard/profile");
    }
  }

  const userPages = await getPagesByProfileId(profile.id);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between relative selection:bg-neutral-800 overflow-x-hidden w-full">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-cyan-500/5 blur-[140px] rounded-full" />
      </div>

      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-neutral-950/70 backdrop-blur-xl sticky top-0 z-50 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between min-w-0">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="size-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-white/20 transition">
                <RuneIcon name="glass-chain-link-3-1" type="glass" size={20} />
              </div>
              <span className="font-semibold text-base sm:text-lg tracking-tight text-white">
                OpenLynk
              </span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1 shrink-0">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/[0.04] transition"
              >
                Overview
              </Link>
              <Link
                href="/dashboard/pages"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-white/[0.08] border border-white/10 transition"
              >
                Halaman Saya
              </Link>
              <Link
                href="/dashboard/profile"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/[0.04] transition"
              >
                Profil Akun
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="text-xs text-neutral-400 hidden sm:inline truncate max-w-[150px]">
              @{profile.username}
            </span>
            <Link
              href="/dashboard"
              className="text-xs px-3 py-1.5 rounded-xl border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 w-full relative z-10 min-w-0">
        <PagesListView profileId={profile.id} pages={userPages} />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-neutral-500">
        OpenLynk Modular Monolith — Multi-Page Architecture
      </footer>
    </div>
  );
}

export default function PagesDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
          <div className="size-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PagesDashboardContent />
    </Suspense>
  );
}
