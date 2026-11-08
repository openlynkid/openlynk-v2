"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ExternalLink, LogOut, LayoutDashboard, Layers, User, ChevronRight } from "lucide-react";
import { RuneIcon } from "@/components/ui/rune-icon";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface DashboardNavProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  username?: string;
}

export function DashboardNav({ user, username }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Halaman Saya",
      href: "/dashboard/pages",
      icon: Layers,
      active: pathname.startsWith("/dashboard/pages"),
    },
    {
      label: "Profil Akun",
      href: "/dashboard/profile",
      icon: User,
      active: pathname.startsWith("/dashboard/profile"),
    },
  ];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
        },
      });
    } catch {
      setIsSigningOut(false);
    }
  };

  const publicUrl = username ? `/${username}` : null;
  const userInitials = (user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="border-b border-white/10 bg-neutral-950/75 backdrop-blur-xl sticky top-0 z-40 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between min-w-0">
        {/* Brand & Desktop Navigation */}
        <div className="flex items-center gap-4 sm:gap-7 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="size-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-white/20 transition-all duration-200">
              <RuneIcon name="glass-chain-link-3-1" type="glass" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white leading-tight">
                OpenLynk
              </span>
              <span className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase -mt-0.5 hidden xs:inline">
                Creator Hub
              </span>
            </div>
          </Link>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    item.active
                      ? "text-white bg-white/[0.08] border border-white/10 shadow-sm"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon size={14} className={item.active ? "text-indigo-400" : "text-neutral-500"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Quick Actions & User Pill */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {publicUrl && (
            <Link
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white hover:bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 transition-all duration-200"
              title="Buka halaman publik di tab baru"
            >
              <span>Pratinjau</span>
              <ExternalLink size={12} className="text-neutral-500" />
            </Link>
          )}

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl hover:bg-white/[0.04] transition group"
            >
              <div className="size-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold text-xs flex items-center justify-center shrink-0">
                {userInitials}
              </div>
              <div className="flex flex-col text-left max-w-[120px] truncate">
                <span className="text-xs font-medium text-white truncate group-hover:text-indigo-300 transition-colors">
                  {user.name}
                </span>
                {username && (
                  <span className="text-[10px] text-neutral-500 truncate -mt-0.5">
                    @{username}
                  </span>
                )}
              </div>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="border-white/10 text-neutral-400 hover:bg-red-950/30 hover:text-red-300 hover:border-red-800/80 rounded-xl text-xs h-8 px-2.5 shrink-0"
              title="Keluar dari akun"
            >
              <LogOut size={13} />
            </Button>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          {publicUrl && (
            <Link
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl text-neutral-400 hover:text-white border border-white/10 bg-white/[0.02]"
              title="Pratinjau Publik"
            >
              <ExternalLink size={16} />
            </Link>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
            className="border-white/10 text-white hover:bg-white/10 rounded-xl size-9 p-0 flex items-center justify-center"
            aria-label="Buka Menu"
          >
            <Menu size={18} />
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="bg-neutral-950/95 border-l border-white/10 text-white w-72 p-6 flex flex-col justify-between backdrop-blur-2xl">
          <SheetHeader className="text-left pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold text-sm flex items-center justify-center">
                {userInitials}
              </div>
              <div className="flex flex-col min-w-0">
                <SheetTitle className="text-white text-sm font-semibold truncate">
                  {user.name}
                </SheetTitle>
                {username && (
                  <span className="text-xs text-indigo-400 font-medium">@{username}</span>
                )}
                <span className="text-[11px] text-neutral-500 truncate">{user.email}</span>
              </div>
            </div>
          </SheetHeader>

          {/* Navigation Links */}
          <div className="flex-1 py-6 space-y-1">
            <p className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider mb-2 px-3">
              Menu Utama
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    item.active
                      ? "text-white bg-indigo-600/20 border border-indigo-500/30 text-indigo-200"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={item.active ? "text-indigo-400" : "text-neutral-500"} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={14} className="text-neutral-600" />
                </Link>
              );
            })}

            {publicUrl && (
              <div className="pt-4 mt-4 border-t border-white/10">
                <Link
                  href={publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink size={15} />
                    <span>Halaman Publik Anda</span>
                  </div>
                  <span className="text-[10px] bg-indigo-500/30 px-1.5 py-0.5 rounded text-indigo-200">
                    Buka ↗
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Drawer Footer with Sign Out */}
          <div className="pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full justify-center gap-2 border-red-500/20 text-red-400 hover:bg-red-950/40 hover:border-red-500/40 rounded-xl text-xs h-10"
            >
              <LogOut size={14} />
              <span>{isSigningOut ? "Keluar..." : "Keluar dari Akun"}</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
