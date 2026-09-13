import React, { useEffect, useState } from "react";
import logoHorizontal from "@/imports/logo_simbolo_horizontal.png";

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setExiting(true);
    }, 1800);

    const doneTimer = setTimeout(() => {
      onDone();
    }, 2150);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--card)] transition-opacity duration-300 ${exiting ? "opacity-0" : "opacity-100"}`}
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="animate-honra-rise" style={{ animationDelay: "0.05s" }}>
          <img
            src={logoHorizontal}
            alt="Honra"
            className="h-14 w-auto object-contain"
            style={{ maxWidth: "220px" }}
          />
        </div>

        {/* Loading dots */}
        <div
          className="flex items-center gap-1.5"
          style={{ opacity: exiting ? 0 : 1, transition: "opacity 0.2s" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-1.5 h-1.5 rounded-full bg-[var(--primary)]"
              style={{
                animation: `honra-dot-bounce 1.1s ease-in-out ${i * 0.18}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
