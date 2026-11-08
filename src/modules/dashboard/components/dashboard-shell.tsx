import type { ReactNode } from "react";
import { DashboardNav } from "./dashboard-nav";

interface DashboardShellProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  username?: string;
  children: ReactNode;
}

export function DashboardShell({
  user,
  username,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between relative selection:bg-neutral-800 overflow-x-hidden w-full">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-cyan-500/5 blur-[140px] rounded-full" />
      </div>

      {/* Top Header Navigation */}
      <DashboardNav user={user} username={username} />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 w-full relative z-10 min-w-0">
        {children}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-neutral-500 relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-neutral-500">
          <p>OpenLynk Creator Platform &copy; 2026 — Ditenagai oleh Next.js 16 &amp; Base UI</p>
          <p className="text-[11px] text-neutral-600">Arsitektur Modular Monolith &bull; Obsidian Glassmorphism</p>
        </div>
      </footer>
    </div>
  );
}
