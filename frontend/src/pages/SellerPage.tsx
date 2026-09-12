import React, { useState } from "react";
import SellerDashboard from "./seller/SellerDashboard";
import SellerProducts from "./seller/SellerProducts";
import SellerOrderDetail from "./seller/SellerOrderDetail";
import type { SellerOrder } from "../mock/sellerData";

type SellerView = "dashboard" | "products" | "order-detail";

type SellerTab = "dashboard" | "products";

const TABS: { id: SellerTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "dashboard",
    label: "Panel",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "products",
    label: "Productos",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function SellerPage() {
  const [activeTab, setActiveTab] = useState<SellerTab>("dashboard");
  const [view, setView]           = useState<SellerView>("dashboard");
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);

  const handleViewOrder = (order: SellerOrder) => {
    setSelectedOrder(order);
    setView("order-detail");
  };

  const handleBack = () => {
    setSelectedOrder(null);
    setView(activeTab);
  };

  const handleTabChange = (tab: SellerTab) => {
    setActiveTab(tab);
    setView(tab);
    setSelectedOrder(null);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-5 py-6">
        {/* Page header */}
        {view !== "order-detail" && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
              Panel de vendedor
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
              Administra tus publicaciones y órdenes de escrow.
            </p>
          </div>
        )}

        {/* Sub-navigation tabs */}
        {view !== "order-detail" && (
          <div className="flex items-center gap-1 mb-6 bg-[var(--muted)] rounded-[var(--radius)] p-1 w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                  activeTab === tab.id
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {view === "dashboard" && (
          <SellerDashboard onViewOrder={handleViewOrder} />
        )}
        {view === "products" && (
          <SellerProducts />
        )}
        {view === "order-detail" && selectedOrder && (
          <SellerOrderDetail
            order={selectedOrder}
            onBack={handleBack}
            onStatusChange={(updated) => setSelectedOrder(updated)}
          />
        )}
      </div>
    </div>
  );
}
