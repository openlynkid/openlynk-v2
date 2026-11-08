"use client";

import { useState } from "react";
import { Check, Copy, Bot, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { OBSIDIAN_AI_MARKDOWN } from "../data/obsidian-ai-prompt";
import { useObsidianToast } from "./obsidian-toast";

interface ObsidianAiGuideDialogProps {
  trigger?: React.ReactNode;
}

export function ObsidianAiGuideDialog({ trigger }: ObsidianAiGuideDialogProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useObsidianToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(OBSIDIAN_AI_MARKDOWN);
      setCopied(true);
      showToast("Panduan AI Markdown Disalin", "Prompt sistem desain Obsidian siap pakai untuk LLM");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          trigger ? (
            (trigger as React.ReactElement)
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 text-neutral-300 hover:bg-white/5 rounded-xl text-xs h-8 px-2.5 gap-1.5 cursor-pointer"
            >
              <Bot size={13} className="text-violet-400" />
              <span>Panduan AI</span>
            </Button>
          )
        }
      />

      <DialogContent className="max-w-3xl bg-neutral-950/95 border border-white/15 shadow-2xl backdrop-blur-2xl text-neutral-100 rounded-3xl p-6 sm:p-7">
        <DialogHeader className="space-y-1.5 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Bot size={16} />
            </div>
            <DialogTitle className="text-base sm:text-lg font-bold text-white tracking-tight">
              Panduan Sistem Desain Obsidian untuk AI Agent
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-neutral-400">
            Salin seluruh spesifikasi Markdown ini ke dalam Cursor rules, system prompt Claude, ChatGPT, atau AI Agent untuk menghasilkan UI yang 100% selaras dengan Obsidian.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Markdown Code Block */}
        <div className="relative rounded-2xl bg-black/60 border border-white/10 p-4 max-h-[50vh] overflow-y-auto [scrollbar-width:thin] font-mono text-[11px] leading-relaxed text-neutral-300 whitespace-pre-wrap selection:bg-violet-500/30">
          {OBSIDIAN_AI_MARKDOWN}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
            <FileText size={13} className="text-violet-400" />
            <span>Format: Markdown (.md) &bull; Obsidian Design System v1.0</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <DialogClose
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-neutral-300 hover:bg-white/5 rounded-xl text-xs h-9 px-4 flex-1 sm:flex-initial cursor-pointer"
                >
                  Tutup
                </Button>
              }
            />

            <Button
              size="sm"
              onClick={handleCopy}
              className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs h-9 px-4 gap-2 flex-1 sm:flex-initial cursor-pointer shadow-lg"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? "Berhasil Disalin" : "Salin Markdown"}</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
