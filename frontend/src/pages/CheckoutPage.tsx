import React from "react";
import Button from "../components/ui/Button";
import { useCheckout } from "../hooks/useCheckout";
import { blockchainService } from "../services/blockchainService";
import type { CheckoutProduct } from "../types/checkout";
import type { StepStatus, CheckoutStep, GlobalErrorType } from "../types/checkout";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CheckoutPageProps {
  product: CheckoutProduct;
  walletConnected: boolean;
  walletAddress: string | null;
  onBack: () => void;
  onWalletConnected: (address: string) => void;
  onComplete: () => void;
}

// ─── Step icon ────────────────────────────────────────────────────────────────

function StepIcon({ status, index }: { status: StepStatus; index: number }) {
  if (status === "confirmed") {
    return (
      <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
    );
  }
  if (status === "failed") {
    return (
      <div className="w-7 h-7 rounded-full bg-red-100 border border-red-200 flex items-center justify-center shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </div>
    );
  }
  if (status === "pending" || status === "waiting_wallet") {
    return (
      <div className="w-7 h-7 rounded-full bg-[var(--secondary)] border border-emerald-200 flex items-center justify-center shrink-0">
        <svg className="animate-spin w-3.5 h-3.5 text-[var(--primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center shrink-0">
      <span className="text-[11px] font-semibold text-[var(--muted-foreground)]">{index + 1}</span>
    </div>
  );
}

// ─── Step status label ────────────────────────────────────────────────────────

function stepStatusLabel(step: CheckoutStep): string {
  switch (step.status) {
    case "idle": return "Pendiente";
    case "pending": return "Esperando confirmación de la blockchain";
    case "waiting_wallet": return "Tu billetera te pedirá confirmar la transacción";
    case "confirmed": return "Confirmado";
    case "failed": return step.errorMessage ?? "Error";
  }
}

function stepStatusColor(status: StepStatus): string {
  switch (status) {
    case "confirmed": return "text-green-600";
    case "failed": return "text-[var(--destructive)]";
    case "pending":
    case "waiting_wallet": return "text-[var(--primary)]";
    default: return "text-[var(--muted-foreground)]";
  }
}

// ─── Step row ─────────────────────────────────────────────────────────────────

function StepRow({ step, index, isCurrent }: { step: CheckoutStep; index: number; isCurrent: boolean }) {
  return (
    <div className={`flex items-start gap-3 py-3.5 ${index < 2 ? "border-b border-[var(--border)]" : ""}`}>
      <StepIcon status={step.status} index={index} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isCurrent && step.status === "idle" ? "text-[var(--foreground)]" : step.status === "idle" ? "text-[var(--muted-foreground)]" : "text-[var(--foreground)]"}`}>
          {step.label}
        </p>
        <p className={`text-xs mt-0.5 leading-snug ${stepStatusColor(step.status)}`}>
          {stepStatusLabel(step)}
        </p>

        {/* Confirmed tx hash */}
        {step.status === "confirmed" && step.txHash && (
          <a
            href={blockchainService.formatExplorerUrl(step.txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-1.5 text-[11px] font-medium text-[var(--primary)] hover:underline"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
            </svg>
            <span style={{ fontFamily: "var(--font-data)", fontSize: "10px" }}>
              {blockchainService.truncateTxHash(step.txHash)}
            </span>
            <span>· Ver en explorador</span>
          </a>
        )}

        {/* Waiting hint */}
        {(step.status === "pending") && (
          <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
            Your {step.id === "fund_escrow" ? `${(0).toLocaleString("en-US")} USDC remain secured` : "transaction has been submitted"}.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Global error banner ──────────────────────────────────────────────────────

const errorMeta: Record<GlobalErrorType, { icon: React.ReactNode; color: string }> = {
  insufficient_usdc: {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h4.5a2.5 2.5 0 0 1 0 5H9"/></svg>,
    color: "bg-red-50 border-red-200 text-red-700",
  },
  insufficient_gas: {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V8l9-6 9 6v14H3z"/><path d="M9 22V12h6v10"/></svg>,
    color: "bg-red-50 border-red-200 text-red-700",
  },
  network_error: {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    color: "bg-amber-50 border-amber-200 text-amber-700",
  },
  wallet_rejected: {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
    color: "bg-red-50 border-red-200 text-red-700",
  },
  unknown: {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 9v4M12 17h.01"/></svg>,
    color: "bg-red-50 border-red-200 text-red-700",
  },
};

// ─── Order summary card ───────────────────────────────────────────────────────

function OrderSummary({ product }: { product: CheckoutProduct }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-12 h-12 rounded-[var(--radius)] object-cover shrink-0 bg-slate-100"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--foreground)] line-clamp-1" style={{ fontFamily: "var(--font-heading)" }}>
            {product.title}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{product.seller}</p>
        </div>
      </div>

      <div className="divide-y divide-[var(--border)]">
        {[
          {
            label: "Precio",
            value: (
              <span className="font-semibold text-[var(--foreground)]">
                {product.priceUsdc.toLocaleString("en-US")}{" "}
                <span className="font-medium text-[var(--muted-foreground)]">USDC</span>
              </span>
            ),
          },
          {
            label: "Red",
            value: (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="font-medium text-[var(--foreground)]">HSK Chain</span>
              </span>
            ),
          },
          {
            label: "Pago",
            value: <span className="font-medium text-[var(--foreground)]">USDC</span>,
          },
          {
            label: "Protección escrow",
            value: (
              <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Activada
              </span>
            ),
          },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-4 py-2.5 text-xs">
            <span className="text-[var(--muted-foreground)]">{label}</span>
            {value}
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 px-4 py-3 bg-[var(--secondary)] border-t border-emerald-100">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary)] mt-0.5 shrink-0">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p className="text-[11px] text-[var(--secondary-foreground)] leading-snug">
          Tus fondos serán bloqueados en el contrato escrow.
        </p>
      </div>
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({
  product,
  txHash,
  onDone,
}: {
  product: CheckoutProduct;
  txHash: string;
  onDone: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5 shadow-[0_0_0_6px_rgba(22,163,74,0.08)]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-[var(--foreground)] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
        Transacción confirmada
      </h2>
      <p className="text-sm text-[var(--muted-foreground)] mb-5 max-w-xs leading-relaxed">
        {product.priceUsdc.toLocaleString("en-US")} USDC bloqueados en HSK Chain. El vendedor será notificado para enviar tu pedido.
      </p>

      <div className="w-full max-w-xs bg-[var(--muted)] rounded-[var(--radius)] px-4 py-3 mb-6 text-left">
        <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Hash de transacción</p>
        <p className="text-xs font-medium text-[var(--foreground)] break-all" style={{ fontFamily: "var(--font-data)" }}>
          {txHash}
        </p>
        <a
          href={blockchainService.formatExplorerUrl(txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-[var(--primary)] hover:underline"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
          </svg>
          Ver en explorador HSK
        </a>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {[
          { icon: "🔒", text: "Fondos protegidos" },
          { icon: "📦", text: "Vendedor notificado" },
          { icon: "🛡", text: "Disputa disponible" },
        ].map(({ icon, text }) => (
          <span key={text} className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] bg-[var(--muted)] border border-[var(--border)] rounded-full px-3 py-1">
            {icon} {text}
          </span>
        ))}
      </div>

      <Button onClick={onDone} size="md">
        Volver al mercado
      </Button>
    </div>
  );
}

// ─── Main CTA label ───────────────────────────────────────────────────────────

function ctaLabel(stepId: string | undefined, status: StepStatus, walletConnected: boolean): string {
  if (!walletConnected) return "Conectar billetera";
  if (!stepId) return "Continuar";
  if (status === "waiting_wallet") return "Esperando billetera…";
  if (status === "pending") return "Esperando confirmación de la blockchain…";
  if (stepId === "approve_usdc") return "Aprobar gasto de USDC";
  if (stepId === "fund_escrow") return "Bloquear USDC en escrow";
  return "Continuar a la billetera";
}

// ─── CheckoutPage ─────────────────────────────────────────────────────────────

export default function CheckoutPage({
  product,
  walletConnected,
  walletAddress,
  onBack,
  onWalletConnected,
  onComplete,
}: CheckoutPageProps) {
  const { state, currentStep, isAdvancing, advance, retryCurrentStep } =
    useCheckout(product, walletConnected, walletAddress, onWalletConnected);

  const completedTxHash = state.isComplete
    ? state.steps.find((s) => s.id === "fund_escrow")?.txHash ?? ""
    : "";

  return (
    <div className="flex-1 overflow-y-auto pb-28 md:pb-8">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Back */}
        {!state.isComplete && (
          <button
            onClick={onBack}
            disabled={isAdvancing}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-6 group disabled:opacity-40 disabled:pointer-events-none"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Volver al producto
          </button>
        )}

        {/* Success */}
        {state.isComplete ? (
          <SuccessScreen
            product={product}
            txHash={completedTxHash}
            onDone={onComplete}
          />
        ) : (
          <>
            {/* Title */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
                Pago seguro
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
                Completa 3 pasos para proteger tu compra.
              </p>
            </div>

            {/* Order summary */}
            <OrderSummary product={product} />

            {/* Global error banner */}
            {state.globalError && (
              <div className={`flex items-start gap-2.5 p-3.5 rounded-[var(--radius)] border mt-4 ${errorMeta[state.globalError.type].color}`}>
                <span className="mt-0.5 shrink-0">{errorMeta[state.globalError.type].icon}</span>
                <p className="text-xs leading-relaxed font-medium">{state.globalError.message}</p>
              </div>
            )}

            {/* Steps */}
            <div className="mt-5 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] px-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
              {state.steps.map((step, i) => (
                <StepRow
                  key={step.id}
                  step={step}
                  index={i}
                  isCurrent={i === state.currentStepIndex}
                />
              ))}
            </div>

            {/* Wallet hint */}
            {currentStep?.status === "waiting_wallet" && (
              <div className="mt-4 flex items-center gap-2.5 p-3.5 bg-[var(--secondary)] border border-emerald-200 rounded-[var(--radius)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary)] shrink-0">
                  <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
                <p className="text-xs text-[var(--secondary-foreground)] font-medium leading-snug">
                  Tu billetera te pedirá confirmar la transacción.
                </p>
              </div>
            )}

            {/* Pending blockchain hint */}
            {currentStep?.status === "pending" && (
              <div className="mt-4 flex items-center gap-2.5 p-3.5 bg-[var(--muted)] border border-[var(--border)] rounded-[var(--radius)]">
                <svg className="animate-spin w-3.5 h-3.5 text-[var(--primary)] shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-xs text-[var(--muted-foreground)] leading-snug">
                  Your {product.priceUsdc.toLocaleString("en-US")} USDC permanecen protegidos.
                </p>
              </div>
            )}

            {/* Retry */}
            {currentStep?.status === "failed" && (
              <div className="mt-4 flex items-center justify-between gap-3 p-3.5 bg-red-50 border border-red-200 rounded-[var(--radius)]">
                <p className="text-xs text-red-700 leading-snug">
                  {currentStep.errorMessage}
                </p>
                <button
                  onClick={retryCurrentStep}
                  className="shrink-0 text-xs font-semibold text-red-700 underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sticky mobile CTA */}
      {!state.isComplete && (
        <div className="fixed bottom-14 md:bottom-0 left-0 right-0 px-4 py-3.5 bg-[var(--card)]/95 backdrop-blur-sm border-t border-[var(--border)] z-30 md:hidden">
          <Button
            size="lg"
            fullWidth
            loading={isAdvancing}
            disabled={currentStep?.status === "confirmed" && state.currentStepIndex === state.steps.length - 1}
            onClick={advance}
          >
            {ctaLabel(currentStep?.id, currentStep?.status ?? "idle", state.walletConnected)}
          </Button>
        </div>
      )}

      {/* Desktop CTA (inline, below steps) */}
      {!state.isComplete && (
        <div className="hidden md:block max-w-lg mx-auto px-4 mt-5">
          <Button
            size="lg"
            fullWidth
            loading={isAdvancing}
            onClick={advance}
          >
            {ctaLabel(currentStep?.id, currentStep?.status ?? "idle", state.walletConnected)}
          </Button>
          {currentStep?.status === "idle" && (
            <p className="text-center text-[11px] text-[var(--muted-foreground)] mt-2">
              Tu billetera te pedirá firmar. Nunca se comparten claves privadas.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
