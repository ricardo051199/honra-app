import React from "react";
import TransactionHash from "./TransactionHash";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TxStateType =
  | "idle"
  | "waiting_wallet"
  | "pending"
  | "confirmed"
  | "failed"
  | "network_error"
  | "insufficient_usdc"
  | "insufficient_gas"
  | "order_not_found";

export interface TxState {
  type: TxStateType;
  txHash?: string;
  message?: string;
  amountUsdc?: number;
}

interface TransactionStatusProps {
  state: TxState;
  className?: string;
}

// ─── Config map ───────────────────────────────────────────────────────────────

const config: Record<
  TxStateType,
  {
    icon: (props: { className?: string }) => React.ReactElement;
    containerClass: string;
    title: (s: TxState) => string;
    subtitle: (s: TxState) => string | null;
  }
> = {
  idle: {
    icon: () => <></>,
    containerClass: "",
    title: () => "",
    subtitle: () => null,
  },
  waiting_wallet: {
    icon: ({ className }) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
    containerClass: "bg-[var(--secondary)] border-emerald-200",
    title: () => "Esperando confirmación de billetera",
    subtitle: () => "Tu billetera te pedirá confirmar la transacción.",
  },
  pending: {
    icon: ({ className }) => (
      <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="14" height="14">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    ),
    containerClass: "bg-[var(--muted)] border-[var(--border)]",
    title: () => "Esperando confirmación de la blockchain",
    subtitle: (s) =>
      s.amountUsdc != null
        ? `Tus ${s.amountUsdc.toLocaleString("en-US")} USDC permanecen protegidos.`
        : "Tu transacción ha sido enviada.",
  },
  confirmed: {
    icon: ({ className }) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
    containerClass: "bg-green-50 border-green-200",
    title: () => "Transacción confirmada",
    subtitle: () => null,
  },
  failed: {
    icon: ({ className }) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    ),
    containerClass: "bg-red-50 border-red-200",
    title: () => "Transacción fallida",
    subtitle: (s) => s.message ?? "Algo salió mal. Tus fondos no fueron movidos.",
  },
  network_error: {
    icon: ({ className }) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    containerClass: "bg-amber-50 border-amber-200",
    title: () => "Red incorrecta",
    subtitle: (s) => s.message ?? "Cambia tu billetera a HSK Chain (ID 177) para continuar.",
  },
  insufficient_usdc: {
    icon: ({ className }) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" /><path d="M12 6v12M9 9h4.5a2.5 2.5 0 0 1 0 5H9" />
      </svg>
    ),
    containerClass: "bg-red-50 border-red-200",
    title: () => "USDC insuficiente",
    subtitle: (s) => s.message ?? "No tienes suficiente USDC para completar esta transacción.",
  },
  insufficient_gas: {
    icon: ({ className }) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 22V8l9-6 9 6v14H3z" /><path d="M9 22V12h6v10" />
      </svg>
    ),
    containerClass: "bg-red-50 border-red-200",
    title: () => "Gas insuficiente",
    subtitle: () => "Necesitas una pequeña cantidad de HSK para pagar las comisiones de red.",
  },
  order_not_found: {
    icon: ({ className }) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9.5 12.5l5 5M14.5 12.5l-5 5" />
      </svg>
    ),
    containerClass: "bg-[var(--muted)] border-[var(--border)]",
    title: () => "Orden no encontrada",
    subtitle: () => "Esta orden no pudo encontrarse en la blockchain.",
  },
};

const textColors: Record<TxStateType, string> = {
  idle:              "",
  waiting_wallet:    "text-[var(--primary)]",
  pending:           "text-[var(--muted-foreground)]",
  confirmed:         "text-green-700",
  failed:            "text-red-700",
  network_error:     "text-amber-700",
  insufficient_usdc: "text-red-700",
  insufficient_gas:  "text-red-700",
  order_not_found:   "text-[var(--muted-foreground)]",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function TransactionStatus({ state, className = "" }: TransactionStatusProps) {
  if (state.type === "idle") return null;

  const cfg = config[state.type];
  const color = textColors[state.type];
  const title = cfg.title(state);
  const subtitle = cfg.subtitle(state);

  return (
    <div className={`flex items-start gap-2.5 p-3.5 rounded-[var(--radius)] border ${cfg.containerClass} ${className}`}>
      <span className={`shrink-0 mt-0.5 ${color}`}>
        <cfg.icon className={color} />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-semibold leading-snug ${color}`}>{title}</p>
        {subtitle && (
          <p className={`text-xs mt-0.5 leading-relaxed ${color} opacity-80`}>{subtitle}</p>
        )}
        {state.type === "confirmed" && state.txHash && (
          <div className="mt-1.5">
            <TransactionHash hash={state.txHash} />
          </div>
        )}
      </div>
    </div>
  );
}
