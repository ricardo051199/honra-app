import React, { useState } from "react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import EscrowCard from "../../components/shared/EscrowCard";
import { useToast } from "../../components/ui/Toast";
import { escrowService } from "../../services/escrowService";
import {
  SELLER_ORDER_STATUS_LABELS,
  type SellerOrder,
  type SellerOrderStatus,
  type SellerShipping,
} from "../../mock/sellerData";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncateAddress(addr: string) {
  return `${addr.slice(0, 10)}…${addr.slice(-6)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Status badge ─────────────────────────────────────────────────────────────

type BadgeVariant = "default" | "primary" | "success" | "warning" | "destructive" | "outline";
const statusVariant: Record<SellerOrderStatus, BadgeVariant> = {
  funds_locked: "primary",
  shipped:      "primary",
  completed:    "success",
  disputed:     "destructive",
  refunded:     "warning",
};

function SellerStatusBadge({ status }: { status: SellerOrderStatus }) {
  return (
    <Badge variant={statusVariant[status]} size="md" dot>
      {SELLER_ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}


// ─── Mark as shipped modal ────────────────────────────────────────────────────

interface ShipmentFormData {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
}

const EMPTY_SHIPMENT: ShipmentFormData = { carrier: "", trackingNumber: "", trackingUrl: "" };

const inputClass =
  "w-full h-9 px-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-shadow";

function MarkAsShippedModal({
  open,
  amount,
  loading,
  onConfirm,
  onClose,
}: {
  open: boolean;
  amount: number;
  loading: boolean;
  onConfirm: (data: ShipmentFormData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ShipmentFormData>(EMPTY_SHIPMENT);
  const [errors, setErrors] = useState<Partial<ShipmentFormData>>({});

  const set = (field: keyof ShipmentFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<ShipmentFormData> = {};
    if (!form.carrier.trim())       next.carrier       = "El transportista es obligatorio.";
    if (!form.trackingNumber.trim()) next.trackingNumber = "El número de seguimiento es obligatorio.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => { if (validate()) onConfirm(form); };

  const handleClose = () => {
    if (!loading) { setForm(EMPTY_SHIPMENT); setErrors({}); onClose(); }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Marcar como enviado"
      description="Ingresa los detalles del envío. Quedará registrado on-chain y el comprador será notificado."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={handleClose} disabled={loading}>Cancelar</Button>
          <Button size="sm" loading={loading} onClick={handleSubmit}>
            {loading ? "Confirmando…" : "Confirmar envío"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Amount reminder */}
        <div className="flex items-center justify-between p-3 rounded-[var(--radius)] bg-[var(--muted)] border border-[var(--border)]">
          <span className="text-xs text-[var(--muted-foreground)]">Monto en escrow</span>
          <span className="text-sm font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
            {amount.toLocaleString("en-US")} <span className="text-xs font-medium text-[var(--muted-foreground)]">USDC</span>
          </span>
        </div>

        {/* Carrier */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1">
            Transportista <span className="text-[var(--destructive)]">*</span>
          </label>
          <input
            className={`${inputClass} ${errors.carrier ? "border-[var(--destructive)]" : ""}`}
            placeholder="Ej. FedEx, DHL, UPS"
            value={form.carrier}
            onChange={set("carrier")}
          />
          {errors.carrier && <p className="text-[11px] text-[var(--destructive)]">{errors.carrier}</p>}
        </div>

        {/* Tracking number */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1">
            Número de seguimiento <span className="text-[var(--destructive)]">*</span>
          </label>
          <input
            className={`${inputClass} font-[var(--font-data)] text-xs ${errors.trackingNumber ? "border-[var(--destructive)]" : ""}`}
            placeholder="Ej. 794644792798"
            value={form.trackingNumber}
            onChange={set("trackingNumber")}
          />
          {errors.trackingNumber && <p className="text-[11px] text-[var(--destructive)]">{errors.trackingNumber}</p>}
        </div>

        {/* Tracking URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--foreground)]">
            URL de seguimiento <span className="text-[10px] font-normal text-[var(--muted-foreground)]">(opcional)</span>
          </label>
          <input
            className={inputClass}
            placeholder="https://…"
            value={form.trackingUrl}
            onChange={set("trackingUrl")}
          />
        </div>

        {/* Wallet warning */}
        <div className="flex items-start gap-2.5 p-3.5 bg-[var(--secondary)] border border-emerald-100 rounded-[var(--radius)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary)] mt-0.5 shrink-0">
            <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
          <p className="text-xs text-[var(--secondary-foreground)] leading-snug">
            Tu billetera te pedirá confirmar la transacción en la blockchain.
          </p>
        </div>
      </div>
    </Modal>
  );
}

// ─── Seller Order Detail ──────────────────────────────────────────────────────

interface SellerOrderDetailProps {
  order: SellerOrder;
  onBack: () => void;
  onStatusChange: (updated: SellerOrder) => void;
}

export default function SellerOrderDetail({
  order: initialOrder,
  onBack,
  onStatusChange,
}: SellerOrderDetailProps) {
  const [order, setOrder] = useState<SellerOrder>(initialOrder);
  const [shipOpen, setShipOpen] = useState(false);
  const [shipLoading, setShipLoading] = useState(false);
  const { toast } = useToast();

  const handleMarkShipped = async (data: ShipmentFormData) => {
    setShipLoading(true);
    try {
      await escrowService.confirmDelivery(order.escrowId, order.buyerAddress);
      const updated: SellerOrder = {
        ...order,
        status: "shipped",
        updatedAt: new Date().toISOString(),
        shipping: {
          carrier: data.carrier,
          trackingNumber: data.trackingNumber,
          trackingUrl: data.trackingUrl || `https://track.example.com/${data.trackingNumber}`,
          shippedAt: new Date().toISOString(),
        },
      };
      setOrder(updated);
      onStatusChange(updated);
      setShipOpen(false);
      toast({ type: "success", title: "Shipment confirmed", description: "Buyer has been notified." });
    } catch {
      toast({ type: "error", title: "Transaction failed", description: "Please try again." });
    } finally {
      setShipLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors group"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Dashboard
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h2 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>Order</h2>
            <span className="text-xl font-bold text-[var(--muted-foreground)]" style={{ fontFamily: "var(--font-data)" }}>
              #{order.id}
            </span>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">Received {formatDate(order.createdAt)}</p>
        </div>
        <SellerStatusBadge status={order.status} />
      </div>

      {/* Product + buyer card */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-4 p-4 border-b border-[var(--border)]">
          <div className="w-16 h-16 rounded-[var(--radius)] overflow-hidden bg-slate-100 shrink-0">
            <img src={order.product.imageUrl} alt={order.product.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
              {order.product.title}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{order.product.category}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
              {order.amountUsdc.toLocaleString("en-US")}
            </p>
            <p className="text-xs font-semibold text-[var(--muted-foreground)]">USDC</p>
          </div>
        </div>

        {/* Buyer wallet */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs text-[var(--muted-foreground)]">Buyer wallet</span>
          <span className="text-xs font-medium text-[var(--foreground)]" style={{ fontFamily: "var(--font-data)" }}>
            {truncateAddress(order.buyerAddress)}
          </span>
        </div>
      </div>

      {/* Escrow status card */}
      <EscrowCard
        amountUsdc={order.amountUsdc}
        escrowContract={order.escrowContract}
        escrowId={order.escrowId}
        txHash={order.txHash || undefined}
        variant={order.status === "disputed" ? "dispute" : order.status === "completed" || order.status === "refunded" ? "neutral" : "seller"}
        statusLabel={
          order.status === "completed" ? "Liberado" :
          order.status === "refunded"  ? "Reembolsado" :
          order.status === "shipped"   ? "Esperando confirmación" :
          order.status === "disputed"  ? "Congelado" :
          undefined
        }
        description={
          order.status === "funds_locked" ? `${order.amountUsdc.toLocaleString("en-US")} USDC bloqueados en escrow. Envía el producto y márcalo como enviado.` :
          order.status === "shipped"      ? "Envío registrado. Esperando que el comprador confirme la entrega. Los fondos serán liberados a tu billetera al confirmar." :
          order.status === "completed"    ? `${order.amountUsdc.toLocaleString("en-US")} USDC han sido liberados a tu billetera.` :
          order.status === "refunded"     ? `Esta orden fue reembolsada. ${order.amountUsdc.toLocaleString("en-US")} USDC devueltos al comprador.` :
          order.status === "disputed"     ? "El comprador ha abierto una disputa. Los fondos están congelados hasta resolver la disputa." :
          undefined
        }
        footer={
          order.status === "funds_locked" ? (
            <Button
              size="sm"
              onClick={() => setShipOpen(true)}
              icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" /><rect x="9" y="11" width="14" height="10" rx="1" /><path d="M5 17l2-2-2-2" /></svg>}
            >
              Mark as shipped
            </Button>
          ) : undefined
        }
      />

      {/* Shipping details (when shipped) */}
      {order.shipping && order.status !== "funds_locked" && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <p className="text-sm font-semibold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>Shipping</p>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {[
              { label: "Carrier",         value: order.shipping.carrier,        mono: false },
              { label: "Tracking number", value: order.shipping.trackingNumber, mono: true  },
              { label: "Shipped on",      value: formatDateShort(order.shipping.shippedAt), mono: false },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-[var(--muted-foreground)]">{label}</span>
                <span className={`text-xs font-medium text-[var(--foreground)] ${mono ? "font-[var(--font-data)]" : ""}`}>{value}</span>
              </div>
            ))}
          </div>
          {order.shipping.trackingUrl && (
            <div className="px-4 py-3 border-t border-[var(--border)]">
              <a href={order.shipping.trackingUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
                Track shipment
              </a>
            </div>
          )}
        </div>
      )}

      <MarkAsShippedModal
        open={shipOpen}
        amount={order.amountUsdc}
        loading={shipLoading}
        onConfirm={handleMarkShipped}
        onClose={() => setShipOpen(false)}
      />
    </div>
  );
}
