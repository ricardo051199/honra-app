import React from "react";
import TransactionHash from "../ui/TransactionHash";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EscrowCardVariant = "buyer" | "seller" | "dispute" | "neutral";

interface EscrowCardProps {
  amountUsdc: number;
  escrowContract: string;
  escrowId: string;
  txHash?: string;
  variant?: EscrowCardVariant;
  statusLabel?: string;
  description?: string;
  footer?: React.ReactNode;
}

// ─── EscrowCard ───────────────────────────────────────────────────────────────

export default function EscrowCard({
  amountUsdc,
  escrowContract,
  escrowId,
  txHash,
  variant = "neutral",
  statusLabel,
  description,
  footer,
}: EscrowCardProps) {
  const headerBg =
    variant === "dispute" ? "bg-red-50 border-b border-red-100"
    : "bg-[var(--secondary)] border-b border-emerald-100";

  const iconBg =
    variant === "dispute" ? "bg-[var(--destructive)]" : "bg-[var(--primary)]";

  const accentText =
    variant === "dispute" ? "text-red-600"
    : "text-[var(--primary)]";

  const label =
    statusLabel ??
    (variant === "dispute"
      ? "Congelado"
      : variant === "seller"
      ? "Bloqueado — esperando tu confirmación"
      : "Protegido");

  const defaultDescription =
    variant === "dispute"
      ? "Los fondos están congelados mientras se revisa la disputa."
      : variant === "seller"
      ? "El pago está en escrow. Envía el producto para continuar."
      : "Tus fondos están actualmente protegidos por el contrato inteligente.";

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3.5 ${headerBg}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${accentText}`}>
            Escrow
          </p>
          <p className="text-sm font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
            {amountUsdc.toLocaleString("en-US")} USDC · {label}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="px-4 py-3 text-xs text-[var(--muted-foreground)] leading-relaxed border-b border-[var(--border)]">
        {description ?? defaultDescription}
      </p>

      {/* Details */}
      <div className="divide-y divide-[var(--border)]">
        {[
          { label: "Red",            value: "HSK Chain · ID 177", mono: false },
          { label: "Contrato",       value: `${escrowContract.slice(0, 10)}…${escrowContract.slice(-6)}`, mono: true },
          { label: "Orden on-chain", value: escrowId, mono: true },
        ].map(({ label: l, value, mono }) => (
          <div key={l} className="flex items-center justify-between px-4 py-2.5">
            <span className="text-xs text-[var(--muted-foreground)]">{l}</span>
            <span className={`text-xs font-medium text-[var(--foreground)] ${mono ? "font-[var(--font-data)]" : ""}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Footer slot + explorer link */}
      {(txHash || footer) && (
        <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between gap-3 flex-wrap">
          {txHash && <TransactionHash hash={txHash} />}
          {footer}
        </div>
      )}
    </div>
  );
}
