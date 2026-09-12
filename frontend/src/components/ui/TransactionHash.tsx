import React, { useState } from "react";
import { blockchainService } from "../../services/blockchainService";

interface TransactionHashProps {
  hash: string;
  label?: string;
  showExplorer?: boolean;
  size?: "sm" | "md";
}

export default function TransactionHash({
  hash,
  label = "Hash de transacción",
  showExplorer = true,
  size = "sm",
}: TransactionHashProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const short = blockchainService.truncateTxHash(hash);
  const explorerUrl = blockchainService.formatExplorerUrl(hash);

  if (size === "md") {
    return (
      <div className="rounded-[var(--radius)] bg-[var(--muted)] border border-[var(--border)] px-4 py-3">
        <p className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">
          {label}
        </p>
        <div className="flex items-center justify-between gap-3">
          <p
            className="text-xs text-[var(--foreground)] break-all leading-relaxed"
            style={{ fontFamily: "var(--font-data)" }}
          >
            {hash}
          </p>
          <button
            onClick={handleCopy}
            className="shrink-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="Copiar hash"
          >
            {copied ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>
        {showExplorer && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-[var(--primary)] hover:underline"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
            </svg>
            View on HSK explorer
          </a>
        )}
      </div>
    );
  }

  return (
    <a
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--primary)] hover:underline"
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
      </svg>
      <span style={{ fontFamily: "var(--font-data)" }}>{short}</span>
      <span>· Ver en explorador</span>
    </a>
  );
}
