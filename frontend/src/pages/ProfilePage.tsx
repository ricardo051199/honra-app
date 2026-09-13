import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";
import { MOCK_WALLET } from "../mock/data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

// ─── Section title ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
      {children}
    </p>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-0">
      <span className="text-xs text-[var(--muted-foreground)]">{label}</span>
      <span
        className={`text-xs font-medium text-[var(--foreground)] ${mono ? "font-[var(--font-data)]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Security indicator ────────────────────────────────────────────────────────

function SecurityIndicator({
  label,
  description,
  active,
  icon,
}: {
  label: string;
  description: string;
  active: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-[var(--radius)] border ${active ? "border-emerald-200 bg-[var(--secondary)]" : "border-[var(--border)] bg-[var(--muted)]"}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${active ? "bg-[var(--primary)] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)]"}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`text-xs font-semibold ${active ? "text-[var(--secondary-foreground)]" : "text-[var(--muted-foreground)]"}`} style={{ fontFamily: "var(--font-heading)" }}>
            {label}
          </span>
          {active && (
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
          )}
        </div>
        <p className="text-[11px] text-[var(--muted-foreground)] leading-snug">{description}</p>
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

interface ProfilePageProps {
  walletConnected: boolean;
  walletAddress?: string;
  walletBalance?: number;
  onConnectWallet?: () => void;
  onDisconnectWallet?: () => void;
}

export default function ProfilePage({
  walletConnected,
  walletAddress,
  walletBalance,
  onConnectWallet,
  onDisconnectWallet,
}: ProfilePageProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    if (!walletAddress) return;
    copyToClipboard(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast({ type: "success", title: "Dirección copiada", description: "Copiada al portapapeles." });
  };

  const handleDisconnect = () => {
    onDisconnectWallet?.();
    toast({ type: "info", title: "Billetera desconectada", description: "Tu sesión ha sido cerrada." });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 space-y-6 pb-20 md:pb-6">

        {/* Hero */}
        <div className="flex items-center gap-4 p-5 bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border)]">
          <div className="w-14 h-14 rounded-full bg-[var(--secondary)] border-2 border-[var(--primary)] flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary)]">
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[var(--foreground)] leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              {MOCK_WALLET.name}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{MOCK_WALLET.email}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${walletConnected ? "bg-[var(--primary)]" : "bg-[var(--muted-foreground)]"}`} />
              <span className="text-[11px] font-medium text-[var(--muted-foreground)]">
                {walletConnected ? "Billetera conectada" : "Sin billetera conectada"}
              </span>
            </div>
          </div>
          <img
            src="../public/imagenes/logo_simbolo_horizontal.png"
            alt="Honra"
            className="h-6 w-auto object-contain opacity-40 hidden sm:block"
            style={{ maxWidth: "80px" }}
          />
        </div>

        {/* Personal info */}
        <div>
          <SectionTitle>Información personal</SectionTitle>
          <Card padding="none">
            <div className="px-4 py-1">
              <InfoRow label="Nombre" value={MOCK_WALLET.name} />
              <InfoRow label="Correo electrónico" value={MOCK_WALLET.email} />
              <InfoRow label="Miembro desde" value="Septiembre 2024" />
              <InfoRow label="Operaciones completadas" value="12" />
            </div>
          </Card>
        </div>

        {/* Wallet section */}
        <div>
          <SectionTitle>Billetera blockchain</SectionTitle>
          <Card>
            <div className="space-y-4">
              {/* Connection status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${walletConnected ? "bg-[var(--primary)]" : "bg-slate-300"}`} />
                  <span className="text-sm font-semibold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
                    {walletConnected ? "Conectada" : "No conectada"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--muted)] border border-[var(--border)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                  <span className="text-xs font-medium text-[var(--foreground)]">HSK Chain</span>
                  <span className="text-[10px] text-[var(--muted-foreground)]" style={{ fontFamily: "var(--font-data)" }}>177</span>
                </div>
              </div>

              {walletConnected && walletAddress ? (
                <>
                  {/* Address */}
                  <div className="flex items-center gap-2 p-3 rounded-[var(--radius)] bg-[var(--muted)] border border-[var(--border)]">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5">
                        Dirección
                      </p>
                      <p className="text-xs font-medium text-[var(--foreground)] truncate" style={{ fontFamily: "var(--font-data)" }}>
                        {walletAddress}
                      </p>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--border)] transition-colors shrink-0"
                      title="Copiar dirección"
                    >
                      {copied ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary)]">
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

                  {/* Balance */}
                  <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                    <span className="text-xs text-[var(--muted-foreground)]">Saldo USDC</span>
                    <span className="text-sm font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
                      {walletBalance?.toLocaleString("en-US") ?? "—"}
                      <span className="text-[10px] font-semibold text-[var(--muted-foreground)] ml-1">USDC</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-[var(--muted-foreground)]">Dirección abreviada</span>
                    <span className="text-xs font-medium text-[var(--foreground)]" style={{ fontFamily: "var(--font-data)" }}>
                      {truncateAddress(walletAddress)}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    className="w-full"
                    icon={
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                    }
                  >
                    Desconectar billetera
                  </Button>
                </>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Conecta tu billetera para operar en Honra. Los fondos de cada transacción quedan protegidos en el contrato de escrow hasta que confirmes la entrega.
                  </p>
                  <Button size="sm" onClick={onConnectWallet} className="mx-auto">
                    Conectar billetera
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Security */}
        <div>
          <SectionTitle>Seguridad y confianza</SectionTitle>
          <div className="space-y-2">
            <SecurityIndicator
              label="Escrow protegido"
              description="Los fondos quedan bloqueados en el contrato inteligente hasta que ambas partes confirmen la operación."
              active={walletConnected}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              }
            />
            <SecurityIndicator
              label="Blockchain verificada"
              description="Cada operación queda registrada en HSK Chain (ID 177) y puede ser consultada públicamente."
              active={true}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
            />
            <SecurityIndicator
              label="Pagos en USDC"
              description="Todas las transacciones se realizan en USDC, una moneda estable vinculada al dólar estadounidense."
              active={walletConnected}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v12M8 9.5c0-1 1.8-2 4-1.5s3.5 2 2 3.5-4 2-4 3.5 1 2 4 2" />
                </svg>
              }
            />
            <SecurityIndicator
              label="Protección de disputas"
              description="En caso de desacuerdo, puedes abrir una disputa y el equipo de Honra mediará la resolución."
              active={true}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4M12 17h.01" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center py-2">
          <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
            Honra no custodia tus fondos ni tiene acceso a tu billetera.<br />
            Los contratos de escrow son auditables en HSK Chain.
          </p>
        </div>

      </div>
    </div>
  );
}
