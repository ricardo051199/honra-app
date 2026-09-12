import React from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "destructive" | "outline";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[var(--muted)] text-[var(--muted-foreground)]",
  primary: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  destructive: "bg-red-50 text-red-700",
  outline: "bg-transparent border border-[var(--border)] text-[var(--muted-foreground)]",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-slate-400",
  primary: "bg-indigo-500",
  success: "bg-green-500",
  warning: "bg-amber-500",
  destructive: "bg-red-500",
  outline: "bg-slate-400",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "h-5 px-2 text-[10px] gap-1",
  md: "h-6 px-2.5 text-xs gap-1.5",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
