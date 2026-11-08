"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUp, Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ObsidianAiGuideDialog } from "./obsidian-ai-guide-dialog";
import { useObsidianToast } from "./obsidian-toast";
import type { ObsidianSectionId } from "../types";

export const OBSIDIAN_SECTIONS: { id: ObsidianSectionId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "logo", label: "Identity" },
  { id: "colors", label: "Colors" },
  { id: "themes", label: "Themes" },
  { id: "typography", label: "Typography" },
  { id: "surfaces", label: "Surfaces" },
  { id: "components", label: "Components" },
  { id: "icons", label: "Icons" },
];

export function ObsidianHeader() {
  const [activeSection, setActiveSection] = useState<ObsidianSectionId>("overview");
  const activeSectionRef = useRef<ObsidianSectionId>("overview");
  const [copied, setCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const { showToast } = useObsidianToast();

  // Scrollspy & scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollY / docHeight) * 100)));
      }
      setShowScrollTop(scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        visibleEntries.sort(
          (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
        );
        const sectionId = visibleEntries[0].target.id as ObsidianSectionId;
        if (sectionId && sectionId !== activeSectionRef.current) {
          activeSectionRef.current = sectionId;
          setActiveSection(sectionId);

          // Scroll horizontal container ONLY (never use scrollIntoView which scrolls the window)
          if (mobileNavRef.current) {
            const container = mobileNavRef.current;
            const activeBtn = document.getElementById(`obsidian-mobile-tab-${sectionId}`);
            if (activeBtn) {
              const containerWidth = container.clientWidth;
              const btnLeft = activeBtn.offsetLeft;
              const btnWidth = activeBtn.clientWidth;
              const targetLeft = btnLeft - containerWidth / 2 + btnWidth / 2;
              container.scrollTo({
                left: Math.max(0, targetLeft),
                behavior: "smooth",
              });
            }
          }
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.2, 0.5],
    });

    OBSIDIAN_SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleCopyLink = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "https://obsidian.design";
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast("Tautan Berhasil Disalin", url);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Scroll Progress Bar at very top */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 z-50 transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Brand Mark & Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-2.5 text-neutral-400 hover:text-white transition"
              title="Kembali ke Beranda"
            >
              <div className="size-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/10 transition">
                <ArrowLeft size={14} />
              </div>
            </Link>

            <div className="h-4 w-[1px] bg-white/10" />

            <Link href="/obsidian" className="flex items-center gap-2.5 group">
              {/* Obsidian Prism Icon */}
              <div className="size-7 rounded-lg bg-neutral-900 border border-white/20 flex items-center justify-center relative overflow-hidden group-hover:border-violet-500/50 transition">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-indigo-500/10" />
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white relative z-10"
                >
                  <polygon
                    points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinejoin="round"
                  />
                  <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.4" />
                  <polyline points="2,8.5 12,14 22,8.5" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.4" />
                </svg>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                  Obsidian
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 hidden sm:inline-block">
                  Design System v1.0
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/10 p-1 rounded-2xl">
            {OBSIDIAN_SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white/10 text-white shadow-sm font-semibold"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]"
                  }`}
                >
                  {section.label}
                </a>
              );
            })}
          </nav>

          {/* Actions: AI Guide & Share Link */}
          <div className="flex items-center gap-2">
            <ObsidianAiGuideDialog />

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="border-white/10 text-neutral-300 hover:bg-white/5 rounded-xl text-xs h-8 px-2.5 gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span className="hidden sm:inline">{copied ? "Disalin" : "Tautan"}</span>
            </Button>
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation */}
        <div
          ref={mobileNavRef}
          className="lg:hidden border-t border-white/5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:none px-4 py-2 flex items-center gap-1.5 bg-neutral-950/60"
        >
          {OBSIDIAN_SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <a
                key={section.id}
                id={`obsidian-mobile-tab-${section.id}`}
                href={`#${section.id}`}
                className={`whitespace-nowrap px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 shrink-0 ${
                  isActive
                    ? "bg-violet-500/20 text-violet-200 border border-violet-500/30"
                    : "text-neutral-400 hover:text-neutral-200 bg-white/[0.02] border border-white/5"
                }`}
              >
                {section.label}
              </a>
            );
          })}
        </div>
      </header>

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          className="fixed bottom-6 left-6 z-40 size-10 rounded-2xl bg-neutral-900/90 border border-white/20 text-neutral-200 shadow-xl backdrop-blur-xl flex items-center justify-center hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          <ArrowUp size={16} />
        </button>
      )}
    </>
  );
}
