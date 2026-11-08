import type { Metadata } from "next";
import { ObsidianDesignSystemView } from "@/modules/obsidian";

export const metadata: Metadata = {
  title: "Obsidian — Modern Tactile Design System",
  description:
    "Sistem desain Obsidian: fondasi visual presisi tinggi, tactile glassmorphism, tipografi modern, dan primitif Base UI.",
  keywords: [
    "Obsidian",
    "Design System",
    "Glassmorphism",
    "Base UI",
    "Tailwind CSS v4",
    "RuneIcon",
    "Geist",
    "Next.js 16",
  ],
};

export default function ObsidianPage() {
  return <ObsidianDesignSystemView />;
}
