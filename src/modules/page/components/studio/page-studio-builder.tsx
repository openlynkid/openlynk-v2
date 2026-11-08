"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
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
import { StudioConfirmDialog } from "./studio-confirm-dialog";

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

  // Confirmation Modals
  const [blockToDelete, setBlockToDelete] = useState<PageBlock | null>(null);
  const [isDeletePageOpen, setIsDeletePageOpen] = useState(false);

  // Lightweight Toast Feedback
  const [toastMessage, setToastMessage] = useState<{
    type: "error" | "success" | "info";
    text: string;
  } | null>(null);

  const showToast = (text: string, type: "error" | "success" | "info" = "error") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((curr) => (curr?.text === text ? null : curr));
    }, 4000);
  };

  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${page.slug}`
      : `https://openlynk.id/${page.slug}`;

  // Keyboard shortcuts: Escape to deselect active block if no drawer/modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (
          !isInspectorOpen &&
          !isAddDrawerOpen &&
          !isSettingsOpen &&
          !isShareOpen &&
          !blockToDelete &&
          !isDeletePageOpen
        ) {
          setSelectedBlock(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isInspectorOpen,
    isAddDrawerOpen,
    isSettingsOpen,
    isShareOpen,
    blockToDelete,
    isDeletePageOpen,
  ]);

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
    setIsAddDrawerOpen(false);
    setIsSettingsOpen(false);
    setSelectedBlock(block);
    setIsInspectorOpen(true);
  };

  const handleQuickResize = (blockId: string, colSpan: number, rowSpan: number) => {
    const previousBlocks = [...blocks];
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, colSpan, rowSpan } : b))
    );

    startTransition(async () => {
      try {
        const res = await updatePageBlock(profileId, page.id, blockId, {
          colSpan,
          rowSpan,
        });
        if (!res.success) {
          setBlocks(previousBlocks);
          showToast(res.error || "Gagal mengubah ukuran blok.", "error");
        }
      } catch (err: unknown) {
        setBlocks(previousBlocks);
        console.error("Error mengubah ukuran blok:", err);
        showToast("Terjadi kesalahan saat mengubah ukuran blok.", "error");
      }
    });
  };

  const handleQuickMove = (blockId: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === blockId);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const previousBlocks = [...blocks];
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    setBlocks(newBlocks);

    startTransition(async () => {
      try {
        const orderedIds = newBlocks.map((b) => b.id);
        const res = await reorderPageBlocks(profileId, page.id, orderedIds);
        if (!res.success) {
          setBlocks(previousBlocks);
          showToast(res.error || "Gagal mengubah urutan blok.", "error");
        }
      } catch (err: unknown) {
        setBlocks(previousBlocks);
        console.error("Error mengubah urutan blok:", err);
        showToast("Terjadi kesalahan saat mengubah urutan blok.", "error");
      }
    });
  };

  const handleReorderBlocks = (newBlocks: PageBlock[]) => {
    const previousBlocks = [...blocks];
    setBlocks(newBlocks);

    startTransition(async () => {
      try {
        const orderedIds = newBlocks.map((b) => b.id);
        const res = await reorderPageBlocks(profileId, page.id, orderedIds);
        if (!res.success) {
          setBlocks(previousBlocks);
          showToast(res.error || "Gagal mengubah urutan blok.", "error");
        }
      } catch (err: unknown) {
        setBlocks(previousBlocks);
        console.error("Error mengubah urutan blok:", err);
        showToast("Terjadi kesalahan saat mengubah urutan blok.", "error");
      }
    });
  };

  const handleConfirmDeleteBlock = () => {
    if (!blockToDelete) return;

    const blockId = blockToDelete.id;
    const previousBlocks = [...blocks];
    const previousSelected = selectedBlock;
    const wasInspectorOpen = isInspectorOpen;

    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
      setIsInspectorOpen(false);
    }
    setBlockToDelete(null);

    startTransition(async () => {
      try {
        const res = await deletePageBlock(profileId, page.id, blockId);
        if (!res.success) {
          setBlocks(previousBlocks);
          if (previousSelected?.id === blockId) {
            setSelectedBlock(previousSelected);
            setIsInspectorOpen(wasInspectorOpen);
          }
          showToast(res.error || "Gagal menghapus blok dari halaman.", "error");
        } else {
          showToast("Blok berhasil dihapus.", "success");
        }
      } catch (err: unknown) {
        setBlocks(previousBlocks);
        if (previousSelected?.id === blockId) {
          setSelectedBlock(previousSelected);
          setIsInspectorOpen(wasInspectorOpen);
        }
        console.error("Error menghapus blok:", err);
        showToast("Gagal menghapus blok. Silakan muat ulang dan coba lagi.", "error");
      }
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
    const previousBlocks = [...blocks];
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, ...updates } : b))
    );
    setIsInspectorOpen(false);

    startTransition(async () => {
      try {
        const res = await updatePageBlock(profileId, page.id, blockId, updates);
        if (!res.success) {
          setBlocks(previousBlocks);
          showToast(res.error || "Gagal menyimpan perubahan blok.", "error");
        } else {
          showToast("Perubahan blok berhasil disimpan.", "success");
        }
      } catch (err: unknown) {
        setBlocks(previousBlocks);
        console.error("Error menyimpan blok:", err);
        showToast("Gagal menyimpan perubahan blok.", "error");
      }
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
      try {
        const res = await createPageBlock(profileId, page.id, input);
        if (res.success) {
          setBlocks((prev) => [...prev, res.data]);
          showToast("Blok baru berhasil ditambahkan.", "success");
        } else {
          showToast(res.error || "Gagal menambahkan blok baru.", "error");
        }
      } catch (err: unknown) {
        console.error("Error menambahkan blok:", err);
        showToast("Gagal menambahkan blok baru. Silakan coba lagi.", "error");
      }
    });
  };

  const handleDuplicateBlock = (sourceBlock: PageBlock) => {
    startTransition(async () => {
      try {
        const input = {
          type: sourceBlock.type as PageBlockType,
          title: `${sourceBlock.title || "Kartu"} (Salinan)`,
          url: sourceBlock.url || "",
          iconName: sourceBlock.iconName || undefined,
          colSpan: sourceBlock.colSpan ?? 1,
          rowSpan: sourceBlock.rowSpan ?? 1,
          config: (sourceBlock.config as PageBlockConfig) || {},
        };
        const res = await createPageBlock(profileId, page.id, input);
        if (res.success) {
          setBlocks((prev) => [...prev, res.data]);
          showToast(`Kartu "${input.title}" berhasil diduplikasi.`, "success");
        } else {
          showToast(res.error || "Gagal menduplikasi kartu.", "error");
        }
      } catch (err: unknown) {
        console.error("Error menduplikasi blok:", err);
        showToast("Terjadi kesalahan saat menduplikasi kartu.", "error");
      }
    });
  };

  // --- Page Operations ---

  const handlePreviewTheme = (presetId: string, accentColor: string) => {
    setPage((prev) => ({
      ...prev,
      themeConfig: {
        themePreset: presetId,
        accentColor,
      },
    }));
  };

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
    const previousPage = { ...page };
    setPage((prev) => ({
      ...prev,
      ...updates,
      avatarUrl: updates.avatarUrl ?? null,
      description: updates.description ?? null,
      isDefault: updates.isDefault ?? prev.isDefault,
      isPublished: updates.isPublished ?? prev.isPublished,
    }));

    startTransition(async () => {
      try {
        const res = await updatePage(profileId, page.id, updates);
        if (!res.success) {
          setPage(previousPage);
          showToast(res.error || "Gagal menyimpan pengaturan halaman.", "error");
        } else {
          showToast("Pengaturan halaman berhasil disimpan.", "success");
        }
      } catch (err: unknown) {
        setPage(previousPage);
        console.error("Error menyimpan pengaturan halaman:", err);
        showToast("Gagal menyimpan pengaturan halaman.", "error");
      }
    });
  };

  const handleConfirmDeletePage = () => {
    setIsDeletePageOpen(false);

    startTransition(async () => {
      try {
        const res = await deletePage(profileId, page.id);
        if (res.success) {
          router.push("/dashboard/pages");
        } else {
          showToast(res.error || "Gagal menghapus halaman.", "error");
        }
      } catch (err: unknown) {
        console.error("Error menghapus halaman:", err);
        showToast("Gagal menghapus halaman.", "error");
      }
    });
  };

  return (
    <div className="h-screen h-[100dvh] max-h-screen max-h-[100dvh] w-full bg-neutral-950 text-neutral-100 flex flex-col relative overflow-hidden selection:bg-neutral-800">
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
        onDuplicateBlock={handleDuplicateBlock}
        onRequestDeleteBlock={(block) => setBlockToDelete(block)}
        onReorderBlocks={handleReorderBlocks}
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
        onDuplicateBlock={handleDuplicateBlock}
        onRequestDeleteBlock={(block) => setBlockToDelete(block)}
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
        onDeletePage={() => setIsDeletePageOpen(true)}
        onPreviewTheme={handlePreviewTheme}
        isSaving={isPending}
      />

      {/* QR Code & Share Modal */}
      <PageShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={pageUrl}
        title={page.title}
      />

      {/* Dialog Konfirmasi Hapus Blok */}
      <StudioConfirmDialog
        isOpen={blockToDelete !== null}
        onClose={() => setBlockToDelete(null)}
        onConfirm={handleConfirmDeleteBlock}
        title="Hapus Kartu Bento?"
        description={`Apakah Anda yakin ingin menghapus kartu "${blockToDelete?.title || ""}" dari susunan halaman? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Kartu"
        cancelText="Batal"
        variant="destructive"
        isPending={isPending}
      />

      {/* Dialog Konfirmasi Hapus Halaman */}
      <StudioConfirmDialog
        isOpen={isDeletePageOpen}
        onClose={() => setIsDeletePageOpen(false)}
        onConfirm={handleConfirmDeletePage}
        title="Hapus Halaman Ini?"
        description={`Halaman "${page.title}" (openlynk.id/${page.slug}) beserta seluruh blok kartu di dalamnya akan dihapus secara permanen.`}
        confirmText="Hapus Permanen"
        cancelText="Batal"
        variant="destructive"
        isPending={isPending}
      />

      {/* Floating Glass Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto">
          <div
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-2xl text-xs font-medium border ${
              toastMessage.type === "error"
                ? "bg-red-950/90 text-red-200 border-red-500/30 shadow-red-500/10"
                : toastMessage.type === "success"
                ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/30 shadow-emerald-500/10"
                : "bg-neutral-900/90 text-neutral-200 border-white/15"
            }`}
          >
            <span>{toastMessage.text}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-neutral-400 hover:text-white transition cursor-pointer p-0.5 rounded hover:bg-white/10"
              aria-label="Tutup notifikasi"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
