"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Check } from "lucide-react";

interface ToastState {
  title: string;
  description?: string;
}

interface ObsidianToastContextValue {
  showToast: (title: string, description?: string) => void;
}

const ObsidianToastContext = createContext<ObsidianToastContextValue | null>(null);

export function ObsidianToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (title: string, description?: string) => {
    setToast({ title, description });
    setTimeout(() => {
      setToast(null);
    }, 2400);
  };

  return (
    <ObsidianToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-neutral-900/95 border border-white/20 text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="size-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check size={14} className="stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white tracking-tight">{toast.title}</p>
            {toast.description && (
              <p className="text-[11px] text-neutral-400">{toast.description}</p>
            )}
          </div>
        </div>
      )}
    </ObsidianToastContext.Provider>
  );
}

export function useObsidianToast() {
  const context = useContext(ObsidianToastContext);
  if (!context) {
    return {
      showToast: () => {},
    };
  }
  return context;
}
