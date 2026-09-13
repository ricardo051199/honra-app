import React, { useState } from "react";
import Sidebar, { type NavPage } from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import MarketplacePage from "./pages/MarketplacePage";
import MyOrdersPage from "./pages/MyOrdersPage";
import SellerPage from "./pages/SellerPage";
import DisputesPage from "./pages/DisputesPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import SplashScreen from "./components/SplashScreen";
import { ToastProvider } from "./components/ui/Toast";
import { MOCK_WALLET } from "./mock/data";

type AppState = "splash" | "login" | "app";

function OrdersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

function SellerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DisputesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  );
}

export default function App() {
  const [appState, setAppState] = useState<AppState>("splash");
  const [activePage, setActivePage] = useState<NavPage>("marketplace");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(MOCK_WALLET.connected);

  function renderPage() {
    switch (activePage) {
      case "marketplace":
        return <MarketplacePage />;
      case "orders":
        return <MyOrdersPage />;
      case "seller":
        return <SellerPage />;
      case "disputes":
        return <DisputesPage />;
      case "profile":
        return (
          <ProfilePage
            walletConnected={walletConnected}
            walletAddress={walletConnected ? MOCK_WALLET.address : undefined}
            walletBalance={walletConnected ? MOCK_WALLET.balanceUsdc : undefined}
            onConnectWallet={() => setWalletConnected(true)}
            onDisconnectWallet={() => setWalletConnected(false)}
          />
        );
    }
  }

  const handleNavigate = (page: NavPage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  if (appState === "splash") {
    return (
      <ToastProvider>
        <SplashScreen onDone={() => setAppState("login")} />
      </ToastProvider>
    );
  }

  if (appState === "login") {
    return (
      <ToastProvider>
        <LoginPage onLogin={() => setAppState("app")} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--background)]">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex flex-col h-full">
          <Sidebar activePage={activePage} onNavigate={handleNavigate} />
        </div>

        {/* Tablet compact sidebar */}
        <div className="hidden md:flex lg:hidden flex-col h-full">
          <Sidebar activePage={activePage} onNavigate={handleNavigate} compact />
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-slate-900/40 md:hidden backdrop-blur-[2px]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 flex flex-col md:hidden shadow-2xl">
              <Sidebar activePage={activePage} onNavigate={handleNavigate} />
            </div>
          </>
        )}

        {/* Main content area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header
            activePage={activePage}
            walletConnected={walletConnected}
            walletAddress={walletConnected ? MOCK_WALLET.address : undefined}
            walletBalance={walletConnected ? MOCK_WALLET.balanceUsdc : undefined}
            onConnectWallet={() => setWalletConnected(true)}
            onDisconnectWallet={() => setWalletConnected(false)}
            onMenuToggle={() => setMobileMenuOpen((v) => !v)}
            showMenuButton
          />

          <main className="flex-1 flex flex-col overflow-hidden">
            {renderPage()}
          </main>

          {/* Mobile bottom navigation */}
          <nav className="md:hidden flex items-center justify-around border-t border-[var(--border)] bg-[var(--card)] h-14 shrink-0 px-2">
            {(
              [
                { id: "marketplace" as NavPage, label: "Mercado", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg> },
                { id: "orders" as NavPage, label: "Órdenes", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8" /></svg> },
                { id: "seller" as NavPage, label: "Vender", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /></svg> },
                { id: "disputes" as NavPage, label: "Disputas", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /></svg> },
                { id: "profile" as NavPage, label: "Perfil", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" /></svg> },
              ] as { id: NavPage; label: string; icon: React.ReactNode }[]
            ).map(({ id, label, icon }) => {
              const active = activePage === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNavigate(id)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-[var(--radius)] transition-colors ${active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}
                >
                  {icon}
                  <span className="text-[9px] font-medium">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </ToastProvider>
  );
}
