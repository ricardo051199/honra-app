import React, { useState } from "react";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import TransactionStatus, { type TxState } from "../components/ui/TransactionStatus";
import EscrowCard from "../components/shared/EscrowCard";
import OrderTimeline, { type TimelineStep } from "../components/shared/OrderTimeline";
import { useToast } from "../components/ui/Toast";
import { escrowService } from "../services/escrowService";
import { type Order, type OrderStatus } from "../mock/data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Build timeline from order ────────────────────────────────────────────────

function buildTimeline(order: Order): TimelineStep[] {
  const s = order.status;
  const done   = (l: string, sub?: string): TimelineStep => ({ label: l, sublabel: sub, state: "completed" });
  const active = (l: string, sub?: string): TimelineStep => ({ label: l, sublabel: sub, state: "current"   });
  const wait   = (l: string):               TimelineStep => ({ label: l,                state: "pending"   });

  const createdAt = formatDateShort(order.createdAt);
  const shippedAt = order.shippingInfo ? formatDateShort(order.shippingInfo.shippedAt) : undefined;
  const updatedAt = formatDateShort(order.updatedAt);

  switch (s) {
    case "pending_payment": return [active("Orden creada", createdAt), wait("Pago protegido"), wait("Producto enviado"), wait("Entrega confirmada"), wait("Pago liberado")];
    case "funds_locked":    return [done("Orden creada", createdAt), active("Pago protegido", createdAt), wait("Producto enviado"), wait("Entrega confirmada"), wait("Pago liberado")];
    case "shipped":         return [done("Orden creada", createdAt), done("Pago protegido"), active("Producto enviado", shippedAt), wait("Entrega confirmada"), wait("Pago liberado")];
    case "delivered":       return [done("Orden creada", createdAt), done("Pago protegido"), done("Producto enviado", shippedAt), active("Entrega confirmada", updatedAt), wait("Pago liberado")];
    case "completed":       return [done("Orden creada", createdAt), done("Pago protegido"), done("Producto enviado", shippedAt), done("Entrega confirmada"), done("Pago liberado", updatedAt)];
    case "refunded":        return [done("Orden creada", createdAt), done("Pago protegido"), done("Producto enviado", shippedAt), done("Entrega confirmada"), done("Refunded", updatedAt)];
    case "disputed":        return [done("Orden creada", createdAt), done("Pago protegido"), done("Producto enviado", shippedAt), active("Disputa abierta", updatedAt), wait("Resolución pendiente")];
    default:                return [done("Orden creada", createdAt), wait("Pago protegido"), wait("Producto enviado"), wait("Entrega confirmada"), wait("Pago liberado")];
  }
}

// ─── Shipping card ────────────────────────────────────────────────────────────

function ShippingCard({
  order,
  onConfirmDelivery,
  onOpenDispute,
}: {
  order: Order;
  onConfirmDelivery: () => void;
  onOpenDispute: () => void;
}) {
  const { status, shippingInfo, amountUsdc } = order;

  if (status === "completed") {
    return (
      <div className="rounded-[var(--radius-lg)] border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-2 mb-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          <p className="text-sm font-semibold text-green-800" style={{ fontFamily: "var(--font-heading)" }}>Pago liberado</p>
        </div>
        <p className="text-xs text-green-700">{amountUsdc.toLocaleString("en-US")} USDC liberados al vendedor.</p>
      </div>
    );
  }

  if (status === "refunded") {
    return (
      <div className="rounded-[var(--radius-lg)] border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2 mb-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          <p className="text-sm font-semibold text-amber-800" style={{ fontFamily: "var(--font-heading)" }}>Orden reembolsada</p>
        </div>
        <p className="text-xs text-amber-700">{amountUsdc.toLocaleString("en-US")} USDC reembolsados a tu billetera.</p>
      </div>
    );
  }

  if (status === "funds_locked") {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted-foreground)]"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <p className="text-sm font-semibold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>Shipping</p>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mb-4">Esperando que el vendedor envíe tu orden.</p>
        <Button size="sm" variant="destructive" onClick={onOpenDispute}
          icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/></svg>}
        >
          Abrir disputa
        </Button>
      </div>
    );
  }

  if ((status === "shipped" || status === "disputed") && shippingInfo) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <p className="text-sm font-semibold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>Shipping</p>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {[
            { label: "Transportista",         value: shippingInfo.carrier,         mono: false },
            { label: "Número de seguimiento", value: shippingInfo.trackingNumber,  mono: true  },
            { label: "Enviado el",      value: formatDate(shippingInfo.shippedAt), mono: false },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-xs text-[var(--muted-foreground)]">{label}</span>
              <span className={`text-xs font-medium text-[var(--foreground)] ${mono ? "font-[var(--font-data)]" : ""}`}>{value}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-[var(--border)]">
          <a href={shippingInfo.trackingUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>
            Rastrear envío
          </a>
        </div>
        {status === "shipped" && (
          <div className="flex gap-2 px-4 pb-4">
            <Button size="sm" fullWidth onClick={onConfirmDelivery}
              icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
            >
              Confirmar recepción
            </Button>
            <Button size="sm" variant="destructive" onClick={onOpenDispute}
              icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/></svg>}
            >
              Abrir disputa
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ─── Confirmar recepción modal ───────────────────────────────────────────────────

function ConfirmDeliveryModal({
  open, amount, txState, onConfirm, onClose,
}: {
  open: boolean;
  amount: number;
  txState: TxState;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const isLoading = txState.type === "waiting_wallet" || txState.type === "pending";
  const isDone    = txState.type === "confirmed";

  return (
    <Modal
      open={open}
      onClose={() => !isLoading && onClose()}
      title="Confirmar recepción?"
      description="Confirma que recibiste el producto. Esto liberará el USDC en escrow al vendedor."
      size="sm"
      footer={
        isDone ? (
          <Button size="sm" onClick={onClose}>Cerrar</Button>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>Cancelar</Button>
            <Button size="sm" loading={isLoading} onClick={onConfirm}>
              {isLoading ? "Confirmando…" : "Confirmar recepción"}
            </Button>
          </>
        )
      }
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3.5 rounded-[var(--radius)] bg-[var(--muted)] border border-[var(--border)]">
          <span className="text-sm text-[var(--muted-foreground)]">Monto a liberar</span>
          <span className="text-base font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
            {amount.toLocaleString("en-US")} <span className="text-sm font-medium text-[var(--muted-foreground)]">USDC</span>
          </span>
        </div>

        <TransactionStatus state={txState} />

        {txState.type === "idle" && (
          <div className="flex items-start gap-2.5 p-3 bg-[var(--secondary)] rounded-[var(--radius)] border border-emerald-100">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary)] mt-0.5 shrink-0">
              <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
            </svg>
            <p className="text-xs text-[var(--secondary-foreground)] leading-snug">
              Tu billetera te pedirá confirmar la transacción.
            </p>
          </div>
        )}

        <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
          Esta acción es irreversible. Una vez confirmada, el USDC será transferido al vendedor y el escrow se cerrará.
        </p>
      </div>
    </Modal>
  );
}

// ─── Order Detail Page ────────────────────────────────────────────────────────

interface OrderDetailPageProps {
  order: Order;
  onBack: () => void;
  onStatusChange: (updated: Order) => void;
}

export default function OrderDetailPage({ order: initialOrder, onBack, onStatusChange }: OrderDetailPageProps) {
  const [order, setOrder]           = useState<Order>(initialOrder);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [txState, setTxState]       = useState<TxState>({ type: "idle" });
  const { toast } = useToast();

  const timelineSteps = buildTimeline(order);

  const handleConfirmDelivery = async () => {
    setTxState({ type: "waiting_wallet" });
    try {
      await new Promise<void>((r) => setTimeout(r, 1000));
      setTxState({ type: "pending", amountUsdc: order.amountUsdc });
      const result = await escrowService.confirmDelivery(order.escrowId, order.buyerAddress);
      setTxState({ type: "confirmed", txHash: result });
      const updated: Order = { ...order, status: "completed" as OrderStatus, updatedAt: new Date().toISOString() };
      setOrder(updated);
      onStatusChange(updated);
      toast({ type: "success", title: "Entrega confirmada", description: `${order.amountUsdc.toLocaleString("en-US")} USDC liberados al vendedor.` });
    } catch {
      setTxState({ type: "failed", message: "Transaction failed. Your USDC remain secured." });
    }
  };

  const handleCloseModal = () => {
    setConfirmOpen(false);
    setTxState({ type: "idle" });
  };

  const handleOpenDispute = () => {
    toast({ type: "info", title: "Disputes coming soon", description: "Available in the next release." });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-5 py-6">
        {/* Back */}
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-6 group">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Mis órdenes
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>Order</h1>
              <span className="text-xl font-bold text-[var(--muted-foreground)]" style={{ fontFamily: "var(--font-data)" }}>#{order.id}</span>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">Realizada el {formatDate(order.createdAt)}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Product summary */}
        <div className="flex items-center gap-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[0_1px_3px_rgba(15,23,42,0.06)] mb-5">
          <div className="w-16 h-16 rounded-[var(--radius)] overflow-hidden bg-slate-100 shrink-0">
            <img src={order.product.imageUrl} alt={order.product.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--foreground)] leading-snug" style={{ fontFamily: "var(--font-heading)" }}>{order.product.title}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{order.product.seller}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>{order.amountUsdc.toLocaleString("en-US")}</p>
            <p className="text-xs font-semibold text-[var(--muted-foreground)]">USDC</p>
          </div>
        </div>

        {/* Shared timeline */}
        <OrderTimeline steps={timelineSteps} className="mb-5" />

        {/* Two-column: Escrow + Shipping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EscrowCard
            amountUsdc={order.amountUsdc}
            escrowContract={order.escrowContract}
            escrowId={order.escrowId}
            txHash={order.txHash || undefined}
            variant="buyer"
          />
          <ShippingCard
            order={order}
            onConfirmDelivery={() => setConfirmOpen(true)}
            onOpenDispute={handleOpenDispute}
          />
        </div>
      </div>

      <ConfirmDeliveryModal
        open={confirmOpen}
        amount={order.amountUsdc}
        txState={txState}
        onConfirm={handleConfirmDelivery}
        onClose={handleCloseModal}
      />
    </div>
  );
}
