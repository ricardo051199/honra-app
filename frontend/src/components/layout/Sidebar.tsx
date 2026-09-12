import React from "react";
import logoHorizontal from "@/imports/logo_simbolo_horizontal.png";

export type NavPage = "marketplace" | "orders" | "seller" | "disputes" | "profile";

interface NavItem {
  id: NavPage;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: "marketplace",
    label: "Mercado",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: "orders",
    label: "Mis órdenes",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
  {
    id: "seller",
    label: "Vendedor",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "disputes",
    label: "Disputas",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Perfil",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </svg>
    ),
  },
];

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  compact?: boolean;
}

export default function Sidebar({ activePage, onNavigate, compact = false }: SidebarProps) {
  return (
    <aside
      className={`flex flex-col h-full bg-[var(--card)] border-r border-[var(--border)] transition-all duration-200 ${compact ? "w-16" : "w-[var(--sidebar-width)]"}`}
    >
      <div className={`flex items-center h-[var(--header-height)] border-b border-[var(--border)] shrink-0 ${compact ? "justify-center px-2" : "px-4"}`}>
        {compact ? (
          <img
            src={logoHorizontal}
            alt="Honra"
            className="h-7 w-7 object-cover object-left"
            style={{ maxWidth: "28px" }}
          />
        ) : (
          <img
            src={logoHorizontal}
            alt="Honra — Compra seguro, vende con palabra"
            className="h-8 w-auto object-contain object-left"
            style={{ maxWidth: "140px" }}
          />
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={compact ? item.label : undefined}
              className={`w-full flex items-center gap-3 rounded-[var(--radius)] text-sm font-medium transition-colors duration-100 ${compact ? "justify-center px-0 py-2.5" : "px-3 py-2"} ${
                active
                  ? "bg-[var(--secondary)] text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <span className={`shrink-0 ${active ? "text-[var(--primary)]" : ""}`}>
                {item.icon}
              </span>
              {!compact && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {!compact && (
        <div className="p-3 border-t border-[var(--border)] shrink-0">
          <div className="rounded-[var(--radius)] bg-[var(--secondary)] p-3">
            <div className="flex items-center gap-2 mb-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary)]">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-[10px] font-semibold text-[var(--secondary-foreground)] uppercase tracking-wider">
                Protegido por escrow
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)] leading-snug">
              Todas las transacciones protegidas por contratos inteligentes en HSK Chain.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
