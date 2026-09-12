import React from "react";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import {
  SELLER_STATS,
  SELLER_ORDERS,
  SELLER_ORDER_STATUS_LABELS,
  type SellerOrder,
  type SellerOrderStatus,
} from "../../mock/sellerData";

// ─── Status badge for seller orders ──────────────────────────────────────────

type BadgeVariant = "default" | "primary" | "success" | "warning" | "destructive" | "outline";

const sellerStatusVariant: Record<SellerOrderStatus, BadgeVariant> = {
  funds_locked: "primary",
  shipped:      "primary",
  completed:    "success",
  disputed:     "destructive",
  refunded:     "warning",
};

function SellerStatusBadge({ status }: { status: SellerOrderStatus }) {
  return (
    <Badge variant={sellerStatusVariant[status]} size="sm" dot>
      {SELLER_ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: "indigo" | "green" | "amber" | "default";
}

const accentClasses = {
  indigo:  { icon: "bg-[var(--secondary)] text-[var(--primary)]", value: "text-[var(--primary)]" },
  green:   { icon: "bg-green-50 text-green-600",                   value: "text-green-700"         },
  amber:   { icon: "bg-amber-50 text-amber-600",                   value: "text-amber-700"         },
  default: { icon: "bg-[var(--muted)] text-[var(--muted-foreground)]", value: "text-[var(--foreground)]" },
};

function StatCard({ label, value, sub, icon, accent = "default" }: StatCardProps) {
  const cls = accentClasses[accent];
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
          {label}
        </p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cls.icon}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-2xl font-bold leading-none ${cls.value}`} style={{ fontFamily: "var(--font-heading)" }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs text-[var(--muted-foreground)] mt-1">{sub}</p>
        )}
      </div>
    </Card>
  );
}

// ─── Recent order row ─────────────────────────────────────────────────────────

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function RecentOrderRow({
  order,
  onView,
}: {
  order: SellerOrder;
  onView: () => void;
}) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-[var(--border)] last:border-0">
      <div className="w-10 h-10 rounded-[var(--radius)] overflow-hidden bg-slate-100 shrink-0">
        <img src={order.product.imageUrl} alt={order.product.title} className="w-full h-full object-cover" loading="lazy" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[11px] font-medium text-[var(--muted-foreground)]" style={{ fontFamily: "var(--font-data)" }}>
            #{order.id}
          </span>
          <SellerStatusBadge status={order.status} />
        </div>
        <p className="text-sm font-semibold text-[var(--foreground)] truncate" style={{ fontFamily: "var(--font-heading)" }}>
          {order.product.title}
        </p>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5 truncate">
          <span style={{ fontFamily: "var(--font-data)" }}>{truncateAddress(order.buyerAddress)}</span>
          {" · "}{formatDate(order.createdAt)}
        </p>
      </div>

      <div className="text-right shrink-0 hidden sm:block">
        <p className="text-sm font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
          {order.amountUsdc.toLocaleString("en-US")}
        </p>
        <p className="text-[10px] font-semibold text-[var(--muted-foreground)]">USDC</p>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={onView}
        icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
        iconPosition="right"
        className="shrink-0"
      >
        Ver
      </Button>
    </div>
  );
}

// ─── Seller Dashboard ─────────────────────────────────────────────────────────

interface SellerDashboardProps {
  onViewOrder: (order: SellerOrder) => void;
}

const RECENT_COUNT = 5;

export default function SellerDashboard({ onViewOrder }: SellerDashboardProps) {
  const recent = [...SELLER_ORDERS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, RECENT_COUNT);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Órdenes activas"
          value={SELLER_STATS.activeOrders}
          sub="Financiadas o enviadas"
          accent="indigo"
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8" /></svg>}
        />
        <StatCard
          label="Ventas completadas"
          value={SELLER_STATS.completedSales}
          sub="Histórico"
          accent="green"
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
        />
        <StatCard
          label="Balance en escrow"
          value={`${SELLER_STATS.escrowBalanceUsdc.toLocaleString("en-US")}`}
          sub="USDC bloqueados"
          accent="indigo"
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
        />
        <StatCard
          label="Productos"
          value={SELLER_STATS.totalProducts}
          sub="En catálogo"
          accent="default"
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" /></svg>}
        />
      </div>

      {/* Attention banner for funded orders */}
      {SELLER_STATS.activeOrders > 0 && (
        <div className="flex items-start gap-3 p-4 bg-[var(--secondary)] border border-emerald-200 rounded-[var(--radius-lg)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--secondary-foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
              {SELLER_STATS.escrowBalanceUsdc.toLocaleString("en-US")} USDC protegidos en escrow
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">
              Tienes {SELLER_STATS.activeOrders} {SELLER_STATS.activeOrders === 1 ? "orden activa" : "órdenes activas"}.
              Los fondos se liberarán a tu billetera cuando los compradores confirmen la entrega.
            </p>
          </div>
        </div>
      )}

      {/* Órdenes recientes */}
      <div>
        <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
          Órdenes recientes
        </p>
        <Card padding="none">
          <div className="px-4">
            {recent.map((order) => (
              <RecentOrderRow key={order.id} order={order} onView={() => onViewOrder(order)} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
