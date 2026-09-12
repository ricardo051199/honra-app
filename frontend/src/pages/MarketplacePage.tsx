import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { MOCK_PRODUCTS, MOCK_WALLET, type Product } from "../mock/data";
import ProductDetailPage from "./ProductDetailPage";
import CheckoutPage from "./CheckoutPage";

type MarketplaceView = "list" | "detail" | "checkout";

// ─── Hero ────────────────────────────────────────────────────────────────────

function EscrowFlowStep({ icon, label, sublabel }: { icon: React.ReactNode; label: string; sublabel: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="w-12 h-12 rounded-2xl bg-white border border-[var(--border)] shadow-[0_1px_4px_rgba(15,23,42,0.08)] flex items-center justify-center text-[var(--primary)]">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)] font-[var(--font-heading)]">{label}</p>
        <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{sublabel}</p>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex flex-col items-center justify-center pb-5 px-1">
      <div className="flex items-center gap-0.5">
        <div className="w-8 h-px bg-[var(--border)]" />
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-[var(--muted-foreground)] -ml-1">
          <path d="M1 5h8M6 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function TrustPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[var(--border)] rounded-full shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <span className="text-[var(--primary)]">{icon}</span>
      <span className="text-xs font-semibold text-[var(--foreground)]">{label}</span>
    </div>
  );
}

function Hero() {
  return (
    <div className="w-full bg-gradient-to-b from-[#ECFDF5] to-[var(--background)] border-b border-[var(--border)] px-5 py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center">
        <Badge variant="primary" size="sm" dot className="mb-5 mx-auto">
          Powered by HSK Chain
        </Badge>
        <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-[var(--foreground)] leading-tight tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Compra con confianza.
        </h1>
        <p className="mt-3 text-base md:text-lg text-[var(--muted-foreground)] max-w-lg mx-auto leading-relaxed">
          Tu pago permanece protegido en escrow hasta que tu pedido sea entregado.
        </p>

        <div className="mt-10 flex items-center justify-center gap-0">
          <EscrowFlowStep label="Comprador" sublabel="Paga en USDC"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" /></svg>}
          />
          <FlowArrow />
          <EscrowFlowStep label="Escrow" sublabel="Fondos bloqueados on-chain"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
          />
          <FlowArrow />
          <EscrowFlowStep label="Vendedor" sublabel="Recibe al confirmar entrega"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" /></svg>}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          <TrustPill label="USDC"
            icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M9 9h4.5a2.5 2.5 0 0 1 0 5H9m0 0h4.5a2.5 2.5 0 0 1 0 5H9" /></svg>}
          />
          <TrustPill label="HSK Chain"
            icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>}
          />
          <TrustPill label="Escrow seguro"
            icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onView }: { product: Product; onView: (p: Product) => void }) {
  return (
    <Card className="flex flex-col overflow-hidden group" padding="none" hoverable>
      <div className="relative overflow-hidden bg-slate-100 h-48">
        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <Badge variant="default" size="sm" className="absolute top-3 left-3 bg-white/90 text-slate-600 backdrop-blur-sm shadow-sm">
          {product.category}
        </Badge>
      </div>
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1 min-h-0">
          <h3 className="text-sm font-semibold text-[var(--foreground)] leading-snug line-clamp-2" style={{ fontFamily: "var(--font-heading)" }}>
            {product.title}
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
        <p className="text-[11px] text-[var(--muted-foreground)]">
          por <span className="font-medium text-[var(--foreground)]">{product.seller}</span>
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
              {product.priceUsdc.toLocaleString("en-US")}
            </span>
            <span className="text-xs font-semibold text-[var(--muted-foreground)]">USDC</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => onView(product)}
            icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
            iconPosition="right"
          >
            Ver producto
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ─── Marketplace Page ─────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [view, setView] = useState<MarketplaceView>("list");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [walletConnected, setWalletConnected] = useState(MOCK_WALLET.connected);
  const [walletAddress, setWalletAddress] = useState<string | null>(
    MOCK_WALLET.connected ? MOCK_WALLET.address : null
  );

  if (view === "checkout" && activeProduct) {
    return (
      <CheckoutPage
        product={activeProduct}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        onBack={() => setView("detail")}
        onWalletConnected={(addr) => {
          setWalletConnected(true);
          setWalletAddress(addr);
        }}
        onComplete={() => {
          setView("list");
          setActiveProduct(null);
        }}
      />
    );
  }

  if (view === "detail" && activeProduct) {
    return (
      <ProductDetailPage
        product={activeProduct}
        onBack={() => setView("list")}
        onCheckout={() => setView("checkout")}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <Hero />
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
              Publicaciones disponibles
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {MOCK_PRODUCTS.length} productos · Todas las compras protegidas por escrow
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} onView={(p) => { setActiveProduct(p); setView("detail"); }} />
          ))}
        </div>
      </div>
    </div>
  );
}
