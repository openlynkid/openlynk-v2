import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  DashboardShell,
  DashboardOverview,
  getDashboardOverviewData,
} from "@/modules/dashboard";

export const metadata: Metadata = {
  title: "Dashboard Kreator — OpenLynk",
  description: "Kelola profil akun, halaman micro-site, dan performa link Anda dalam satu Creator Hub terintegrasi.",
};

async function DashboardOverviewContent() {
  const headersList = await headers();
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: headersList,
    });
  } catch {
    session = null;
  }

  if (!session) {
    redirect("/login");
  }

  const host =
    headersList.get("x-forwarded-host") ||
    headersList.get("host") ||
    "openlynk.id";
  const proto =
    headersList.get("x-forwarded-proto") ||
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  const baseUrl = `${proto}://${host}`;

  const overviewData = await getDashboardOverviewData({
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    emailVerified: session.user.emailVerified,
    image: session.user.image,
  });

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
      username={overviewData.profile.username}
    >
      <DashboardOverview data={overviewData} baseUrl={baseUrl} />
    </DashboardShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="size-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-neutral-400 text-xs">Memuat Dashboard Kreator...</p>
          </div>
        </div>
      }
    >
      <DashboardOverviewContent />
    </Suspense>
  );
}
