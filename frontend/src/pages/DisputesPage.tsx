import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import TransactionStatus, { type TxState } from "../components/ui/TransactionStatus";
import TransactionHash from "../components/ui/TransactionHash";
import EscrowCard from "../components/shared/EscrowCard";
import OrderTimeline, { type TimelineStep } from "../components/shared/OrderTimeline";
import { useToast } from "../components/ui/Toast";
import { mockApi } from "../api/mockApi";
import {
  MOCK_DISPUTES,
  DISPUTE_REASON_LABELS,
  type Dispute,
  type DisputeStatus,
  type DisputeTimelineEvent,
} from "../mock/disputeData";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

// ─── Dispute status badge ─────────────────────────────────────────────────────

type BadgeVariant = "default" | "primary" | "success" | "warning" | "destructive" | "outline";

const disputeStatusConfig: Record<DisputeStatus, { label: string; variant: BadgeVariant }> = {
  open:         { label: "Abierta",         variant: "destructive" },
  under_review: { label: "En revisión", variant: "warning"     },
  resolved:     { label: "Resuelta",     variant: "success"     },
};

function DisputeStatusBadge({ status }: { status: DisputeStatus }) {
  const cfg = disputeStatusConfig[status];
  return <Badge variant={cfg.variant} size="sm" dot>{cfg.label}</Badge>;
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

type FilterTab = "all" | DisputeStatus;

const TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "open", label: "Abiertas" },
  { id: "under_review", label: "En revisión" },
  { id: "resolved", label: "Resueltas" },
];

function filterDisputes(disputes: Dispute[], tab: FilterTab): Dispute[] {
  if (tab === "all") return disputes;
  return disputes.filter((d) => d.status === tab);
}

// ─── Dispute row ──────────────────────────────────────────────────────────────

function DisputeRow({ dispute, onView }: { dispute: Dispute; onView: () => void }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-[var(--border)] last:border-0">
      <div className="w-10 h-10 rounded-[var(--radius)] overflow-hidden bg-slate-100 shrink-0">
        <img src={dispute.product.imageUrl} alt={dispute.product.title} className="w-full h-full object-cover" loading="lazy" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="text-[11px] font-medium text-[var(--muted-foreground)]" style={{ fontFamily: "var(--font-data)" }}>
            #{dispute.id}
          </span>
          <DisputeStatusBadge status={dispute.status} />
        </div>
        <p className="text-sm font-semibold text-[var(--foreground)] truncate" style={{ fontFamily: "var(--font-heading)" }}>
          {dispute.product.title}
        </p>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5 truncate">
          {DISPUTE_REASON_LABELS[dispute.reason]} · by {dispute.openedBy} · {formatDate(dispute.createdAt)}
        </p>
      </div>

      <div className="text-right shrink-0 hidden sm:block">
        <p className="text-sm font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
          {dispute.amountUsdc.toLocaleString("en-US")}
        </p>
        <p className="text-[10px] font-semibold text-[var(--muted-foreground)]">USDC</p>
      </div>

      <Button size="sm" variant="outline" onClick={onView}
        icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
        iconPosition="right"
        className="shrink-0"
      >
        View
      </Button>
    </div>
  );
}

// ─── Dispute timeline ─────────────────────────────────────────────────────────

const eventTypeIcon: Record<DisputeTimelineEvent["type"], React.ReactNode> = {
  opened:   <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/></svg>,
  evidence: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>,
  review:   <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  resolved: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  tx:       <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
};

const eventNodeColor: Record<DisputeTimelineEvent["type"], string> = {
  opened:   "bg-red-100 text-red-600",
  evidence: "bg-[var(--muted)] text-[var(--muted-foreground)]",
  review:   "bg-amber-100 text-amber-600",
  resolved: "bg-green-100 text-green-600",
  tx:       "bg-[var(--secondary)] text-[var(--primary)]",
};

function DisputeTimeline({ events }: { events: DisputeTimelineEvent[] }) {
  return (
    <div className="space-y-0">
      {events.map((ev, i) => (
        <div key={ev.id} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${eventNodeColor[ev.type]}`}>
              {eventTypeIcon[ev.type]}
            </div>
            {i < events.length - 1 && (
              <div className="w-px flex-1 bg-[var(--border)] my-1 min-h-[20px]" />
            )}
          </div>
          <div className="pb-4 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="text-sm font-semibold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
                {ev.label}
              </p>
              <span className="text-[10px] text-[var(--muted-foreground)] shrink-0">
                {formatDateTime(ev.timestamp)}
              </span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">
              {ev.description}
            </p>
            {ev.txHash && (
              <div className="mt-1.5">
                <TransactionHash hash={ev.txHash} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Blockchain transactions list ─────────────────────────────────────────────

function TransactionsList({ dispute }: { dispute: Dispute }) {
  if (dispute.transactions.length === 0) return null;

  const typeLabels: Record<string, string> = {
    fund:      "Escrow financiado",
    approve:   "USDC aprobado",
    ship:      "Envío confirmado",
    confirm:   "Entrega confirmada",
    refund:    "Comprador reembolsado",
    dispute_open:    "Disputa abierta",
    dispute_resolve: "Disputa resuelta",
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <p className="text-sm font-semibold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
          Blockchain transactions
        </p>
        <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          HSK Chain · USDC · Protegido por escrow
        </p>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {dispute.transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between px-4 py-3 gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[var(--foreground)]">
                {typeLabels[tx.type] ?? tx.description}
              </p>
              <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                {formatDateTime(tx.timestamp)}
                {tx.amountUsdc != null && ` · ${tx.amountUsdc.toLocaleString("en-US")} USDC`}
              </p>
            </div>
            <TransactionHash hash={tx.txHash} showExplorer />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin action modal ───────────────────────────────────────────────────────

type AdminAction = "refund" | "release";

function AdminActionModal({
  open,
  action,
  dispute,
  txState,
  onConfirm,
  onClose,
}: {
  open: boolean;
  action: AdminAction;
  dispute: Dispute;
  txState: TxState;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const isRefund  = action === "refund";
  const isLoading = txState.type === "waiting_wallet" || txState.type === "pending";
  const isDone    = txState.type === "confirmed";

  return (
    <Modal
      open={open}
      onClose={() => !isLoading && onClose()}
      title={isRefund ? "¿Reembolsar comprador?" : "¿Liberar fondos al vendedor?"}
      description={
        isRefund
          ? `Esto devolverá ${dispute.amountUsdc.toLocaleString("en-US")} USDC del escrow a la billetera del comprador.`
          : `Esto liberará ${dispute.amountUsdc.toLocaleString("en-US")} USDC del escrow a la billetera del vendedor.`
      }
      size="sm"
      footer={
        isDone ? (
          <Button size="sm" onClick={onClose}>Cerrar</Button>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>Cancelar</Button>
            <Button
              size="sm"
              variant={isRefund ? "primary" : "primary"}
              loading={isLoading}
              onClick={onConfirm}
            >
              {isLoading ? "Confirmando…" : isRefund ? "Reembolsar comprador" : "Liberar al vendedor"}
            </Button>
          </>
        )
      }
    >
      <div className="space-y-3">
        {/* Amount */}
        <div className="flex items-center justify-between p-3 rounded-[var(--radius)] bg-[var(--muted)] border border-[var(--border)]">
          <span className="text-xs text-[var(--muted-foreground)]">Monto en escrow</span>
          <span className="text-sm font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
            {dispute.amountUsdc.toLocaleString("en-US")} <span className="text-xs font-medium text-[var(--muted-foreground)]">USDC</span>
          </span>
        </div>

        {/* Recipient */}
        <div className="flex items-center justify-between p-3 rounded-[var(--radius)] bg-[var(--muted)] border border-[var(--border)]">
          <span className="text-xs text-[var(--muted-foreground)]">
            {isRefund ? "Reembolsar a" : "Liberar a"}
          </span>
          <span className="text-xs font-medium text-[var(--foreground)]" style={{ fontFamily: "var(--font-data)" }}>
            {truncateAddress(isRefund ? dispute.buyerAddress : dispute.sellerAddress)}
          </span>
        </div>

        {/* Transaction status */}
        {txState.type !== "idle" && <TransactionStatus state={txState} />}

        {/* Wallet hint (when idle, before confirming) */}
        {txState.type === "idle" && (
          <div className="flex items-start gap-2 p-3 bg-[var(--secondary)] border border-emerald-100 rounded-[var(--radius)]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary)] mt-0.5 shrink-0">
              <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
            </svg>
            <p className="text-xs text-[var(--secondary-foreground)] leading-snug">
              Tu billetera te pedirá confirmar la transacción.
            </p>
          </div>
        )}

        <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
          Esta acción es irreversible y cerrará la disputa.
        </p>
      </div>
    </Modal>
  );
}

// ─── Dispute Detail ───────────────────────────────────────────────────────────

function buildDisputeTimeline(dispute: Dispute): TimelineStep[] {
  const done   = (l: string, s?: string): TimelineStep => ({ label: l, sublabel: s, state: "completed" });
  const active = (l: string, s?: string): TimelineStep => ({ label: l, sublabel: s, state: "current"   });
  const wait   = (l: string):             TimelineStep => ({ label: l,               state: "pending"   });

  switch (dispute.status) {
    case "open":
      return [done("Disputa abierta"), active("Recopilación de evidencia"), wait("En revisión"), wait("Resuelta")];
    case "under_review":
      return [done("Disputa abierta"), done("Evidencia recopilada"), active("En revisión"), wait("Resuelta")];
    case "resolved":
      return [
        done("Disputa abierta"),
        done("Evidencia recopilada"),
        done("En revisión"),
        done("Resuelta", dispute.resolution === "refunded" ? "Comprador reembolsado" : "Fondos liberados al vendedor"),
      ];
  }
}

function DisputeDetail({
  dispute: initialDispute,
  onBack,
}: {
  dispute: Dispute;
  onBack: () => void;
}) {
  const [dispute, setDispute] = useState<Dispute>(initialDispute);
  const [modalAction, setModalAction] = useState<AdminAction | null>(null);
  const [txState, setTxState] = useState<TxState>({ type: "idle" });
  const { toast } = useToast();

  const canAct = dispute.status !== "resolved";

  const handleConfirm = async () => {
    if (!modalAction) return;
    setTxState({ type: "waiting_wallet" });

    try {
      await new Promise<void>((r) => setTimeout(r, 1000));
      setTxState({ type: "pending", amountUsdc: dispute.amountUsdc });

      const result =
        modalAction === "refund"
          ? await mockApi.disputes.resolveRefund(dispute.id)
          : await mockApi.disputes.resolveRelease(dispute.id);

      setTxState({ type: "confirmed", txHash: result.txHash });

      const updated: Dispute = {
        ...dispute,
        status: "resolved",
        resolution: modalAction === "refund" ? "refunded" : "released_to_seller",
        updatedAt: new Date().toISOString(),
      };
      setDispute(updated);

      toast({
        type: "success",
        title: modalAction === "refund" ? "Comprador reembolsado" : "Funds released",
        description: `${dispute.amountUsdc.toLocaleString("en-US")} USDC transferidos.`,
      });
    } catch {
      setTxState({ type: "failed", message: "Transacción fallida. Los fondos permanecen protegidos." });
    }
  };

  const handleCloseModal = () => {
    setModalAction(null);
    setTxState({ type: "idle" });
  };

  const timelineSteps = buildDisputeTimeline(dispute);

  return (
    <div className="space-y-5">
      {/* Back */}
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors group">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Disputes
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h2 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
              Dispute
            </h2>
            <span className="text-xl font-bold text-[var(--muted-foreground)]" style={{ fontFamily: "var(--font-data)" }}>
              #{dispute.id}
            </span>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">Abierta el {formatDateTime(dispute.createdAt)}</p>
        </div>
        <DisputeStatusBadge status={dispute.status} />
      </div>

      {/* Product + parties */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-4 p-4 border-b border-[var(--border)]">
          <div className="w-14 h-14 rounded-[var(--radius)] overflow-hidden bg-slate-100 shrink-0">
            <img src={dispute.product.imageUrl} alt={dispute.product.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--foreground)] line-clamp-1" style={{ fontFamily: "var(--font-heading)" }}>
              {dispute.product.title}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Orden #{dispute.orderId}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
              {dispute.amountUsdc.toLocaleString("en-US")}
            </p>
            <p className="text-xs font-semibold text-[var(--muted-foreground)]">USDC</p>
          </div>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {[
            { label: "Comprador",        value: truncateAddress(dispute.buyerAddress),  mono: true  },
            { label: "Vendedor",       value: truncateAddress(dispute.sellerAddress), mono: true  },
            { label: "Abierta por",    value: dispute.openedBy === "buyer" ? "Comprador" : "Vendedor", mono: false },
            { label: "Motivo",       value: DISPUTE_REASON_LABELS[dispute.reason],  mono: false },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-xs text-[var(--muted-foreground)]">{label}</span>
              <span className={`text-xs font-medium text-[var(--foreground)] ${mono ? "font-[var(--font-data)]" : ""}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--muted)]">
          <p className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">
            Buyer statement
          </p>
          <p className="text-xs text-[var(--foreground)] leading-relaxed">{dispute.description}</p>
        </div>
      </div>

      {/* Dispute progress timeline */}
      <OrderTimeline steps={timelineSteps} title="Progreso de la disputa" />

      {/* Escrow card */}
      <EscrowCard
        amountUsdc={dispute.amountUsdc}
        escrowContract={dispute.escrowContract}
        escrowId={dispute.escrowId}
        txHash={dispute.transactions[0]?.txHash}
        variant={dispute.status === "resolved" ? "neutral" : "dispute"}
        statusLabel={
          dispute.status === "resolved"
            ? (dispute.resolution === "refunded" ? "Reembolsado" : "Liberado al vendedor")
            : "Congelado"
        }
        description={
          dispute.status === "resolved"
            ? dispute.resolution === "refunded"
              ? `${dispute.amountUsdc.toLocaleString("en-US")} USDC han sido reembolsados al comprador.`
              : `${dispute.amountUsdc.toLocaleString("en-US")} USDC han sido liberados al vendedor.`
            : `${dispute.amountUsdc.toLocaleString("en-US")} USDC congelados mientras se revisa la disputa.`
        }
      />

      {/* Dispute timeline events */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">
          Activity
        </p>
        <DisputeTimeline events={dispute.timeline} />
      </div>

      {/* Blockchain transactions */}
      <TransactionsList dispute={dispute} />

      {/* Admin actions */}
      {canAct && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">
            Resolution
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mb-4 leading-relaxed">
            Una vez resuelta, el USDC en escrow será transferido on-chain. Esta acción es irreversible.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Button
              size="sm"
              variant="outline"
              fullWidth
              onClick={() => setModalAction("refund")}
              icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>}
            >
              Refund buyer
            </Button>
            <Button
              size="sm"
              fullWidth
              onClick={() => setModalAction("release")}
              icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
            >
              Release funds to seller
            </Button>
          </div>
        </div>
      )}

      {/* Resolution result */}
      {dispute.status === "resolved" && (
        <div className={`flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border ${dispute.resolution === "refunded" ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={dispute.resolution === "refunded" ? "#92400E" : "#14532D"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <div>
            <p className={`text-sm font-semibold ${dispute.resolution === "refunded" ? "text-amber-800" : "text-green-800"}`} style={{ fontFamily: "var(--font-heading)" }}>
              {dispute.resolution === "refunded" ? "Comprador reembolsado" : "Fondos liberados al vendedor"}
            </p>
            <p className={`text-xs mt-0.5 ${dispute.resolution === "refunded" ? "text-amber-700" : "text-green-700"}`}>
              {dispute.amountUsdc.toLocaleString("en-US")} USDC · {formatDate(dispute.updatedAt)}
            </p>
          </div>
        </div>
      )}

      {/* Admin action modal */}
      {modalAction && (
        <AdminActionModal
          open={!!modalAction}
          action={modalAction}
          dispute={dispute}
          txState={txState}
          onConfirm={handleConfirm}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

// ─── Disputes Page ────────────────────────────────────────────────────────────

export default function DisputesPage() {
  const [filter, setFilter]       = useState<FilterTab>("all");
  const [selected, setSelected]   = useState<Dispute | null>(null);
  const [disputes, setDisputes]   = useState<Dispute[]>(MOCK_DISPUTES);

  if (selected) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-5 py-6">
          <DisputeDetail
            dispute={selected}
            onBack={() => setSelected(null)}
          />
        </div>
      </div>
    );
  }

  const filtered = filterDisputes(disputes, filter);
  const counts: Record<FilterTab, number> = {
    all:          disputes.length,
    open:         filterDisputes(disputes, "open").length,
    under_review: filterDisputes(disputes, "under_review").length,
    resolved:     filterDisputes(disputes, "resolved").length,
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-5 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
            Disputes
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            {disputes.length} disputes · Escrow funds frozen during review
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-6 bg-[var(--muted)] rounded-[var(--radius)] p-1 w-fit flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                filter === tab.id
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
              {counts[tab.id] > 0 && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none ${
                  filter === tab.id ? "bg-[var(--primary)] text-white" : "bg-slate-200 text-slate-500"
                }`}>
                  {counts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/></svg>}
            title="No disputes found"
            description={filter === "all" ? "No disputes have been opened." : `No ${filter.replace("_", " ")} disputes.`}
          />
        ) : (
          <Card padding="none">
            <div className="px-4">
              {filtered.map((d) => (
                <DisputeRow key={d.id} dispute={d} onView={() => setSelected(d)} />
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
