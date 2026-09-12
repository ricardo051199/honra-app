import React from "react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { type Product } from "../mock/data";

// ─── Seller info row ───────────────────────────────────────────────────────

function SellerRow({ name, address }: { name: string; address: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-t border-[var(--border)]">
      <div className="w-8 h-8 rounded-full bg-[var(--secondary)] flex items-center justify-center shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary)]">
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21a8 8 0 1 0-16 0" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[var(--muted-foreground)]">Vendido por</p>
        <p className="text-sm font-semibold text-[var(--foreground)] truncate" style={{ fontFamily: "var(--font-heading)" }}>
          {name}
        </p>
        <p className="text-[10px] text-[var(--muted-foreground)] truncate mt-0.5" style={{ fontFamily: "var(--font-data)" }}>
          {address.slice(0, 14)}…{address.slice(-6)}
        </p>
      </div>
    </div>
  );
}

// ─── Escrow protection card ────────────────────────────────────────────────

function EscrowCard() {
  return (
    <div className="rounded-[var(--radius-lg)] bg-[var(--secondary)] border border-emerald-200 p-4 flex gap-3">
      <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--secondary-foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
          Protegido por escrow
        </p>
        <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
          Tu USDC permanece bloqueado en el contrato inteligente hasta confirmar la entrega. El vendedor nunca accede a los fondos hasta que tú apruebes.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["USDC bloqueado on-chain", "HSK Chain · ID 177", "Protección de disputas"].map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--secondary-foreground)] bg-white/70 border border-emerald-200 rounded-full px-2.5 py-0.5">
              <span className="w-1 h-1 rounded-full bg-[var(--primary)] inline-block" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Product Detail Page ───────────────────────────────────────────────────

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onCheckout: () => void;
}

export default function ProductDetailPage({ product, onBack, onCheckout }: ProductDetailPageProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-24 lg:pb-6">
      <div className="max-w-5xl mx-auto px-5 py-6">
        {/* Back */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-6 group"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Volver al mercado
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-slate-100 aspect-[4/3]">
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
              <Badge variant="default" size="sm" className="absolute top-3 left-3 bg-white/90 text-slate-600 backdrop-blur-sm shadow-sm">
                {product.category}
              </Badge>
            </div>
            <div className="hidden lg:flex items-center gap-4 px-1">
              {[{ icon: "🔒", text: "Protegido por escrow" }, { icon: "⛓", text: "HSK Chain" }, { icon: "💵", text: "Pago en USDC" }].map(({ icon, text }) => (
                <span key={text} className="inline-flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)]">
                  <span>{icon}</span>{text}
                </span>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Badge variant="success" size="sm" dot>Disponible</Badge>
                <Badge variant="outline" size="sm">{product.category}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] leading-tight tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                {product.title}
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-baseline gap-2 py-4 border-y border-[var(--border)]">
              <span className="text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
                {product.priceUsdc.toLocaleString("en-US")}
              </span>
              <span className="text-base font-semibold text-[var(--muted-foreground)]">USDC</span>
              <span className="ml-auto text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-1 rounded-md">
                ≈ ${product.priceUsdc.toLocaleString("en-US")} USD
              </span>
            </div>

            <SellerRow name={product.seller} address={product.sellerAddress} />
            <EscrowCard />

            <div className="mt-1">
              <Button
                size="lg"
                fullWidth
                onClick={onCheckout}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                }
              >
                Comprar con USDC
              </Button>
              <p className="text-center text-[11px] text-[var(--muted-foreground)] mt-2">
                Fondos en escrow · Liberados solo al confirmar entrega
              </p>
            </div>

            <div className="flex lg:hidden items-center justify-center gap-5 pt-1">
              {[{ icon: "🔒", text: "Protegido por escrow" }, { icon: "⛓", text: "HSK Chain" }, { icon: "💵", text: "USDC" }].map(({ icon, text }) => (
                <span key={text} className="inline-flex items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
                  <span>{icon}</span>{text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="lg:hidden fixed bottom-14 md:bottom-0 left-0 right-0 p-4 bg-[var(--card)]/95 backdrop-blur-sm border-t border-[var(--border)] z-30">
        <Button size="lg" fullWidth onClick={onCheckout}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
        >
          Comprar con USDC · {product.priceUsdc.toLocaleString("en-US")} USDC
        </Button>
      </div>
    </div>
  );
}
