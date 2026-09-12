import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import StatusBadge from "../components/ui/StatusBadge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { MOCK_ORDERS, type Order, type OrderStatus } from "../mock/data";
import OrderDetailPage from "./OrderDetailPage";

// ─── Filter tabs ──────────────────────────────────────────────────────────────

type FilterTab = "all" | "active" | "completed" | "disputed";

const FILTERS: { id: FilterTab; label: string }[] = [
  { id: "all",       label: "Todas"       },
  { id: "active",    label: "Activas"    },
  { id: "completed", label: "Completadas" },
  { id: "disputed",  label: "Disputadas"  },
];

const ACTIVE_STATUSES: OrderStatus[]    = ["pending_payment", "funds_locked", "shipped", "delivered"];
const COMPLETED_STATUSES: OrderStatus[] = ["completed", "refunded", "cancelled"];
const DISPUTED_STATUSES: OrderStatus[]  = ["disputed"];

function filterOrders(orders: Order[], tab: FilterTab): Order[] {
  switch (tab) {
    case "active":    return orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
    case "completed": return orders.filter((o) => COMPLETED_STATUSES.includes(o.status));
    case "disputed":  return orders.filter((o) => DISPUTED_STATUSES.includes(o.status));
    default:          return orders;
  }
}

// ─── Order row ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function OrderRow({ order, onView }: { order: Order; onView: () => void }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-[var(--border)] last:border-0">
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-[var(--radius)] overflow-hidden bg-slate-100 shrink-0">
        <img
          src={order.product.imageUrl}
          alt={order.product.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Info — grows */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-[11px] font-medium text-[var(--muted-foreground)]"
            style={{ fontFamily: "var(--font-data)" }}
          >
            #{order.id}
          </span>
          <StatusBadge status={order.status} size="sm" />
        </div>
        <p
          className="text-sm font-semibold text-[var(--foreground)] truncate leading-snug"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {order.product.title}
        </p>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5 truncate">
          {order.product.seller} · {formatDate(order.createdAt)}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0 hidden sm:block">
        <p className="text-sm font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
          {order.amountUsdc.toLocaleString("en-US")}
        </p>
        <p className="text-[10px] font-semibold text-[var(--muted-foreground)]">USDC</p>
      </div>

      {/* Action */}
      <Button
        size="sm"
        variant="outline"
        onClick={onView}
        icon={
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        }
        iconPosition="right"
        className="shrink-0"
      >
        <span className="hidden xs:inline">Ver orden</span>
        <span className="xs:hidden">Ver</span>
      </Button>
    </div>
  );
}

// ─── Mis órdenes Page ───────────────────────────────────────────────────────────

export default function MyOrdersPage() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (selectedOrder) {
    return (
      <OrderDetailPage
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
        onStatusChange={(updated) => setSelectedOrder(updated)}
      />
    );
  }

  const filtered = filterOrders(MOCK_ORDERS, filter);
  const counts: Record<FilterTab, number> = {
    all:       MOCK_ORDERS.length,
    active:    filterOrders(MOCK_ORDERS, "active").length,
    completed: filterOrders(MOCK_ORDERS, "completed").length,
    disputed:  filterOrders(MOCK_ORDERS, "disputed").length,
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-5 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2
            className="text-xl font-bold text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Mis órdenes
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            {MOCK_ORDERS.length} órdenes · Todos los fondos protegidos por escrow
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-6 bg-[var(--muted)] rounded-[var(--radius)] p-1 w-fit">
          {FILTERS.map((tab) => (
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
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none ${
                    filter === tab.id
                      ? "bg-[var(--primary)] text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {counts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Order list */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8" />
              </svg>
            }
            title="Sin órdenes"
            description={
              filter === "all"
                ? "Todavía no has realizado ninguna orden. Explora el mercado para comenzar."
                : `Sin órdenes de este tipo en este momento.`
            }
          />
        ) : (
          <Card padding="none">
            <div className="px-4">
              {filtered.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onView={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
