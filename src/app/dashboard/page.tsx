import type { Metadata } from "next";
import { DashboardView } from "@/modules/dashboard";

export const metadata: Metadata = {
  title: "Dashboard — OpenLynk",
  description: "Dashboard pengguna dan manajemen sesi OpenLynk.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
