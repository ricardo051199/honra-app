import React from "react";

interface LoadingStateProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "skeleton";
  rows?: number;
}

function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  return (
    <svg
      className={`animate-spin ${dims[size]} text-[var(--primary)]`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--muted)] animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-[var(--muted)] rounded-full animate-pulse w-3/5" />
        <div className="h-3 bg-[var(--muted)] rounded-full animate-pulse w-2/5" />
      </div>
      <div className="h-6 w-16 bg-[var(--muted)] rounded-full animate-pulse" />
    </div>
  );
}

export default function LoadingState({
  label,
  size = "md",
  variant = "spinner",
  rows = 4,
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className="divide-y divide-[var(--border)]">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Spinner size={size} />
      {label && (
        <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
      )}
    </div>
  );
}
