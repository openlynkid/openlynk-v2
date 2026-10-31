"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Page, PageBlock, Profile } from "@/db/schema";
import type { PageBlockType, PageBlockConfig } from "../../types";
import {
  createPageBlock,
  updatePageBlock,
  deletePageBlock,
  reorderPageBlocks,
  updatePage,
  deletePage,
} from "../../server/page-service";

import { StudioHeader, type ViewportMode } from "./studio-header";
import { StudioCanvas } from "./studio-canvas";
import { BlockInspectorDrawer } from "./block-inspector-drawer";
import { BlockLibraryDrawer } from "./block-library-drawer";
import { PageSettingsDrawer } from "./page-settings-drawer";
import { PageShareModal } from "../page-share-modal";

interface PageStudioBuilderProps {
  profileId: string;
  initialPage: Page;
  profile: Profile;
  initialBlocks: PageBlock[];
}

export function PageStudioBuilder({
  profileId,
  initialPage,
  profile,
  initialBlocks,
}: PageStudioBuilderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State
  const [page, setPage] = useState<Page>(initialPage);
  const [blocks, setBlocks] = useState<PageBlock[]>(initialBlocks);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");
  const [selectedBlock, setSelectedBlock] = useState<PageBlock | null>(null);

  // Drawers & Modals
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"general" | "themes">("general");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${page.slug}`
      : `https://openlynk.id/${page.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  // --- Block Operations ---

  const handleSelectBlock = (block: PageBlock) => {
    setSelectedBlock(block);
    setIsInspectorOpen(true);
  };

  const handleQuickResize = (blockId: string, colSpan: number, rowSpan: number) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, colSpan, rowSpan } : b))
    );

    startTransition(async () => {
      await updatePageBlock(profileId, page.id, blockId, {
        colSpan,
        rowSpan,
      });
      router.refresh();
    });
  };

  const handleQuickMove = (blockId: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === blockId);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    setBlocks(newBlocks);

    startTransition(async () => {
      const orderedIds = newBlocks.map((b) => b.id);
      await reorderPageBlocks(profileId, page.id, orderedIds);
      router.refresh();
    });
  };

  const handleQuickDelete = (blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
      setIsInspectorOpen(false);
    }

    startTransition(async () => {
      await deletePageBlock(profileId, page.id, blockId);
      router.refresh();
    });
  };

  const handleSaveBlock = (
    blockId: string,
    updates: {
      title: string;
      url: string;
      iconName?: string;
      colSpan: number;
      rowSpan: number;
      config: PageBlockConfig;
      isActive: boolean;
    }
  ) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, ...updates } : b))
    );
    setIsInspectorOpen(false);

    startTransition(async () => {
      await updatePageBlock(profileId, page.id, blockId, updates);
      router.refresh();
    });
  };

  const handleAddBlock = (input: {
    type: PageBlockType;
    title: string;
    url: string;
    iconName?: string;
    colSpan: number;
    rowSpan: number;
    config: PageBlockConfig;
  }) => {
    startTransition(async () => {
      const res = await createPageBlock(profileId, page.id, input);
      if (res.success) {
        setBlocks((prev) => [...prev, res.data]);
        router.refresh();
      }
    });
  };

  // --- Page Operations ---

  const handleSavePageSettings = (updates: {
    title: string;
    slug: string;
    description?: string;
    avatarUrl?: string;
    themeConfig: {
      themePreset: string;
      accentColor: string;
    };
    isDefault?: boolean;
    isPublished?: boolean;
  }) => {
    setPage((prev) => ({
      ...prev,
      ...updates,
      avatarUrl: updates.avatarUrl ?? null,
      description: updates.description ?? null,
      isDefault: updates.isDefault ?? prev.isDefault,
      isPublished: updates.isPublished ?? prev.isPublished,
    }));

    startTransition(async () => {
      await updatePage(profileId, page.id, updates);
      router.refresh();
    });
  };

  const handleDeletePage = () => {
    if (
      !confirm(
        `Hapus halaman "${page.title}" (openlynk.id/${page.slug}) secara permanen?`
      )
    )
      return;

    startTransition(async () => {
      const res = await deletePage(profileId, page.id);
      if (res.success) {
        router.push("/dashboard/pages");
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col relative overflow-x-hidden selection:bg-neutral-800">
      {/* Studio Header */}
      <StudioHeader
        pageTitle={page.title}
        pageSlug={page.slug}
        viewportMode={viewportMode}
        onViewportChange={setViewportMode}
        onOpenAddBlock={() => setIsAddDrawerOpen(true)}
        onOpenSettings={() => {
          setSettingsTab("general");
          setIsSettingsOpen(true);
        }}
        onOpenThemes={() => {
          setSettingsTab("themes");
          setIsSettingsOpen(true);
        }}
        onOpenShare={() => setIsShareOpen(true)}
        onCopyLink={handleCopyLink}
        copied={copied}
        isSaving={isPending}
        isPublished={page.isPublished}
      />

      {/* Main Studio Canvas */}
      <StudioCanvas
        page={page}
        profile={profile}
        blocks={blocks}
        viewportMode={viewportMode}
        selectedBlockId={selectedBlock?.id ?? null}
        onSelectBlock={handleSelectBlock}
        onQuickResize={handleQuickResize}
        onQuickMove={handleQuickMove}
        onQuickDelete={handleQuickDelete}
        onOpenAddBlock={() => setIsAddDrawerOpen(true)}
        onOpenPageSettings={() => {
          setSettingsTab("general");
          setIsSettingsOpen(true);
        }}
      />

      {/* Block Inspector Drawer */}
      <BlockInspectorDrawer
        block={selectedBlock}
        isOpen={isInspectorOpen}
        onClose={() => {
          setIsInspectorOpen(false);
          setSelectedBlock(null);
        }}
        onSaveBlock={handleSaveBlock}
        onDeleteBlock={handleQuickDelete}
        onMoveBlock={handleQuickMove}
      />

      {/* Add Block Library Drawer */}
      <BlockLibraryDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onAddBlock={handleAddBlock}
      />

      {/* Page Settings & Themes Drawer */}
      <PageSettingsDrawer
        page={page}
        isOpen={isSettingsOpen}
        initialTab={settingsTab}
        onClose={() => setIsSettingsOpen(false)}
        onSavePage={handleSavePageSettings}
        onDeletePage={handleDeletePage}
        isSaving={isPending}
      />

      {/* QR Code & Share Modal */}
      <PageShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={pageUrl}
        title={page.title}
      />
    </div>
  );
}
