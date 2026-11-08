import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfileByUserId, upsertProfile } from "@/modules/profile";
import { getPagesByProfileId, PagesListView } from "@/modules/page";
import { DashboardShell } from "@/modules/dashboard";

export const metadata: Metadata = {
  title: "Kelola Halaman Micro-site — OpenLynk",
  description: "Kelola daftar halaman publik dan micro-site Anda.",
};

async function PagesDashboardContent() {
  let session = null;
  let baseUrl = "https://openlynk.id";
  try {
    const h = await headers();
    session = await auth.api.getSession({
      headers: h,
    });
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto =
      h.get("x-forwarded-proto") ||
      (host?.includes("localhost") ? "http" : "https");
    if (host) {
      baseUrl = `${proto}://${host}`;
    }
  } catch {
    session = null;
  }

  if (!session) {
    redirect("/login");
  }

  let profile = await getProfileByUserId(session.user.id);

  // Auto initialize default profile if first time
  if (!profile) {
    const rawUsername = (session.user.email.split("@")[0] || "user")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");
    const safeUsername =
      rawUsername.length >= 3 ? rawUsername : `user_${session.user.id.slice(0, 4)}`;

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
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
      username={profile.username}
    >
      <PagesListView
        profileId={profile.id}
        pages={userPages}
        baseUrl={baseUrl}
      />
    </DashboardShell>
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
