import React, { useState } from "react";

interface WalletButtonProps {
  connected: boolean;
  address?: string;
  balanceUsdc?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export default function WalletButton({
  connected,
  address,
  balanceUsdc,
  onConnect,
  onDisconnect,
}: WalletButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!connected) {
    return (
      <button
        onClick={onConnect}
        className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius)] bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium transition-colors hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 12V22H4V12" />
          <path d="M22 7H2v5h20V7z" />
          <path d="M12 22V7" />
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </svg>
        Conectar billetera
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="inline-flex items-center gap-2.5 h-9 pl-3 pr-3 rounded-[var(--radius)] bg-[var(--card)] border border-[var(--border)] text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1"
      >
        <span className="w-2 h-2 rounded-full bg-[var(--primary)] shrink-0" />
        <span className="font-[var(--font-data)] text-xs tracking-tight">
          {address ? truncateAddress(address) : "—"}
        </span>
        {balanceUsdc !== undefined && (
          <span className="hidden sm:inline text-[var(--muted-foreground)] text-xs border-l border-[var(--border)] pl-2.5">
            {balanceUsdc.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
          </span>
        )}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted-foreground)]">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-11 z-20 w-56 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Billetera conectada</p>
              <p className="font-[var(--font-data)] text-xs text-[var(--foreground)] break-all">
                {address}
              </p>
            </div>
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Saldo</p>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {balanceUsdc?.toLocaleString("en-US", { minimumFractionDigits: 2 })} USDC
              </p>
            </div>
            <button
              onClick={() => { setMenuOpen(false); onDisconnect?.(); }}
              className="w-full text-left px-4 py-2.5 text-sm text-[var(--destructive)] hover:bg-red-50 transition-colors"
            >
              Desconectar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
