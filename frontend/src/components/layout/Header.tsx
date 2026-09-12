import React from "react";
import WalletButton from "../ui/WalletButton";
import type { NavPage } from "./Sidebar";

interface HeaderProps {
  activePage: NavPage;
  walletConnected: boolean;
  walletAddress?: string;
  walletBalance?: number;
  onConnectWallet?: () => void;
  onDisconnectWallet?: () => void;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

const pageTitles: Record<NavPage, string> = {
  marketplace: "Mercado",
  orders: "Mis órdenes",
  seller: "Panel de vendedor",
  disputes: "Disputas",
  profile: "Perfil",
};

export default function Header({
  activePage,
  walletConnected,
  walletAddress,
  walletBalance,
  onConnectWallet,
  onDisconnectWallet,
  onMenuToggle,
  showMenuButton = false,
}: HeaderProps) {
  return (
    <header className="h-[var(--header-height)] bg-[var(--card)] border-b border-[var(--border)] flex items-center px-5 gap-4 shrink-0">
      {showMenuButton && (
        <button
          onClick={onMenuToggle}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Abrir menú"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {showMenuButton && (
        <div className="md:hidden flex items-center gap-2 mr-1">
          <img
            src="/images/logo_simbolo_horizontal.png"
            alt="Honra"
            className="h-6 w-auto object-contain"
            style={{ maxWidth: "90px" }}
          />
        </div>
      )}

      <h1 className="font-[var(--font-heading)] font-semibold text-sm text-[var(--foreground)] flex-1">
        {pageTitles[activePage]}
      </h1>

      <div className="flex items-center gap-3">
        {walletConnected && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--muted)] border border-[var(--border)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
            <span className="text-xs font-medium text-[var(--foreground)]">HSK Chain</span>
            <span className="text-[10px] text-[var(--muted-foreground)] font-[var(--font-data)]">177</span>
          </div>
        )}

        <WalletButton
          connected={walletConnected}
          address={walletAddress}
          balanceUsdc={walletBalance}
          onConnect={onConnectWallet}
          onDisconnect={onDisconnectWallet}
        />
      </div>
    </header>
  );
}
