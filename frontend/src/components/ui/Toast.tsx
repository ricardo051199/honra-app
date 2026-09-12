import React, { createContext, useContext, useState, useCallback, useRef } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (opts: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const typeConfig: Record<ToastType, { icon: React.ReactNode; barClass: string; iconClass: string }> = {
  success: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
    barClass: "bg-green-500",
    iconClass: "text-green-600 bg-green-50",
  },
  error: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    ),
    barClass: "bg-red-500",
    iconClass: "text-red-600 bg-red-50",
  },
  info: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    barClass: "bg-indigo-500",
    iconClass: "text-indigo-600 bg-indigo-50",
  },
  warning: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
    barClass: "bg-amber-500",
    iconClass: "text-amber-600 bg-amber-50",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timerRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const t = timerRef.current.get(id);
    if (t) { clearTimeout(t); timerRef.current.delete(id); }
  }, []);

  const toast = useCallback((opts: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-3), { ...opts, id }]);
    const timer = setTimeout(() => dismiss(id), 4000);
    timerRef.current.set(id, timer);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
        {toasts.map((t) => {
          const cfg = typeConfig[t.type];
          return (
            <div
              key={t.id}
              className="pointer-events-auto bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-lg overflow-hidden flex items-start gap-3 p-4 relative"
            >
              <span className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${cfg.iconClass}`}>
                {cfg.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)]">{t.title}</p>
                {t.description && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors shrink-0"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
              <div className={`absolute bottom-0 left-0 h-0.5 w-full ${cfg.barClass} opacity-60`} />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
