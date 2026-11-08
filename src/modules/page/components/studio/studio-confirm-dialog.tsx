"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface StudioConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  isPending?: boolean;
}

export function StudioConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Hapus",
  cancelText = "Batal",
  variant = "destructive",
  isPending = false,
}: StudioConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-neutral-900 border-white/10 text-neutral-100 shadow-2xl backdrop-blur-2xl">
        <DialogHeader className="gap-2.5">
          <div className="flex items-center gap-3">
            {variant === "destructive" ? (
              <div className="size-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} />
              </div>
            ) : (
              <div className="size-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} />
              </div>
            )}
            <DialogTitle className="text-base font-bold text-white leading-snug">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-neutral-400 text-xs sm:text-sm leading-relaxed pl-12">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2 border-t border-white/10 pt-3">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
            className="border-white/10 text-neutral-300 hover:bg-white/5 hover:text-white text-xs h-9"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={() => {
              onConfirm();
            }}
            className={`text-xs font-semibold h-9 px-4 shadow-lg ${
              variant === "destructive"
                ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/30"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
            }`}
          >
            {isPending ? "Memproses..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
