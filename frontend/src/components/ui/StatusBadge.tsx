import React from "react";
import Badge from "./Badge";
import type { OrderStatus } from "../../mock/data";

interface StatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
  className?: string;
}

type BadgeVariant = "default" | "primary" | "success" | "warning" | "destructive" | "outline";

const statusConfig: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
  pending_payment: { label: "Creada",     variant: "outline"     },
  funds_locked:    { label: "Financiada", variant: "primary"     },
  shipped:         { label: "Enviada",    variant: "primary"     },
  delivered:       { label: "Entregada",  variant: "success"     },
  completed:       { label: "Completada", variant: "success"     },
  disputed:        { label: "Disputada",  variant: "destructive" },
  refunded:        { label: "Reembolsada",variant: "warning"     },
  cancelled:       { label: "Cancelada",  variant: "default"     },
};

export default function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} size={size} dot className={className}>
      {config.label}
    </Badge>
  );
}
