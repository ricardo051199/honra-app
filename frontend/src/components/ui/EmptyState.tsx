import React from "react";
import Button from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-[var(--foreground)] font-[var(--font-heading)]">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 text-sm text-[var(--muted-foreground)] max-w-xs">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-5">
          <Button size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
