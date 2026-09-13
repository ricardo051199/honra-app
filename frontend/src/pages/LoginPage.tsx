import React, { useState } from "react";
import logoHorizontal from "@/imports/logo_simbolo_horizontal.png";

interface LoginPageProps {
  onLogin: () => void;
}

const inputClass =
  "w-full h-11 px-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-shadow";

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!email.trim() || !email.includes("@")) next.email = "Ingresa un correo electrónico válido.";
    if (password.length < 6) next.password = "La contraseña debe tener al menos 6 caracteres.";
    if (tab === "register" && !name.trim()) next.name = "Ingresa tu nombre completo.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    onLogin();
  };

  const handleDemo = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    onLogin();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4 py-10">
      {/* Background radial */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-sm animate-honra-slide-up">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={logoHorizontal}
            alt="Honra — Compra seguro, vende con palabra"
            className="h-12 w-auto object-contain"
            style={{ maxWidth: "200px" }}
          />
        </div>

        {/* Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[var(--border)]">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setErrors({}); }}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  tab === t
                    ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
                style={{ marginBottom: tab === t ? "-1px" : undefined }}
              >
                {t === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {tab === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--foreground)]">Nombre completo</label>
                <input
                  className={`${inputClass} ${errors.name ? "border-[var(--destructive)] ring-1 ring-[var(--destructive)]" : ""}`}
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                  autoComplete="name"
                />
                {errors.name && <p className="text-[11px] text-[var(--destructive)]">{errors.name}</p>}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">Correo electrónico</label>
              <input
                className={`${inputClass} ${errors.email ? "border-[var(--destructive)] ring-1 ring-[var(--destructive)]" : ""}`}
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                autoComplete="email"
              />
              {errors.email && <p className="text-[11px] text-[var(--destructive)]">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">Contraseña</label>
              <input
                className={`${inputClass} ${errors.password ? "border-[var(--destructive)] ring-1 ring-[var(--destructive)]" : ""}`}
                type="password"
                placeholder={tab === "login" ? "••••••••" : "Mínimo 6 caracteres"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                autoComplete={tab === "login" ? "current-password" : "new-password"}
              />
              {errors.password && <p className="text-[11px] text-[var(--destructive)]">{errors.password}</p>}
            </div>

            {tab === "login" && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-[var(--primary)] hover:underline">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-[var(--radius)] bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold transition-all hover:bg-[var(--accent)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  {tab === "login" ? "Ingresando…" : "Creando cuenta…"}
                </>
              ) : (
                tab === "login" ? "Iniciar sesión" : "Crear cuenta"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-[11px] text-[var(--muted-foreground)]">o continúa como</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Demo access */}
            <button
              type="button"
              onClick={handleDemo}
              disabled={loading}
              className="w-full h-11 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary)]">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Acceso demo
            </button>
          </form>
        </div>

        {/* Trust strip */}
        <div className="mt-6 flex items-center justify-center gap-5">
          {[
            { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, label: "Escrow seguro" },
            { icon: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>, label: "USDC" },
            { icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>, label: "HSK Chain" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary)]">
                {icon}
              </svg>
              <span className="text-[10px] text-[var(--muted-foreground)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
