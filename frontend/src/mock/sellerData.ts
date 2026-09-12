export type SellerProductStatus = "active" | "inactive" | "draft";

export interface SellerProduct {
  id: string;
  title: string;
  description: string;
  priceUsdc: number;
  imageUrl: string;
  stock: number;
  status: SellerProductStatus;
  category: string;
  createdAt: string;
}

export type SellerOrderStatus =
  | "funds_locked"
  | "shipped"
  | "completed"
  | "disputed"
  | "refunded";

export interface SellerShipping {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  shippedAt: string;
}

export interface SellerOrder {
  id: string;
  product: SellerProduct;
  buyerAddress: string;
  amountUsdc: number;
  status: SellerOrderStatus;
  escrowContract: string;
  escrowId: string;
  txHash: string;
  createdAt: string;
  updatedAt: string;
  shipping?: SellerShipping;
}

// ─── Mock products ────────────────────────────────────────────────────────────

export const SELLER_PRODUCTS: SellerProduct[] = [
  {
    id: "sp1",
    title: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling, 30-hour battery. Brand new sealed.",
    priceUsdc: 320,
    imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop&auto=format",
    stock: 4,
    status: "active",
    category: "Electronics",
    createdAt: "2026-08-15T10:00:00Z",
  },
  {
    id: "sp2",
    title: "MacBook Pro 14\" M3 Pro",
    description: "M3 Pro chip, 18GB RAM, 512GB SSD. Excellent condition.",
    priceUsdc: 1750,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop&auto=format",
    stock: 1,
    status: "active",
    category: "Computers",
    createdAt: "2026-08-20T14:00:00Z",
  },
  {
    id: "sp3",
    title: "DJI Mavic 3 Pro Drone",
    description: "Hasselblad triple camera, 43-min flight time. Like new.",
    priceUsdc: 1890,
    imageUrl: "https://images.unsplash.com/photo-1506947411487-a56738267384?w=400&h=300&fit=crop&auto=format",
    stock: 2,
    status: "active",
    category: "Photography",
    createdAt: "2026-09-01T09:00:00Z",
  },
  {
    id: "sp4",
    title: "Leica Q3 Camera",
    description: "Full-frame 60MP sensor, 28mm Summilux f/1.7. Mint condition.",
    priceUsdc: 5800,
    imageUrl: "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=400&h=300&fit=crop&auto=format",
    stock: 0,
    status: "inactive",
    category: "Photography",
    createdAt: "2026-09-03T11:00:00Z",
  },
  {
    id: "sp5",
    title: "iPad Pro 12.9\" M2",
    description: "256GB WiFi + Cellular. Includes Apple Pencil 2nd gen.",
    priceUsdc: 1100,
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4592c5329?w=400&h=300&fit=crop&auto=format",
    stock: 3,
    status: "draft",
    category: "Tablets",
    createdAt: "2026-09-10T08:00:00Z",
  },
];

// ─── Mock seller orders ───────────────────────────────────────────────────────

export const SELLER_ORDERS: SellerOrder[] = [
  {
    id: "ORD-7F4A2",
    product: SELLER_PRODUCTS[1],
    buyerAddress: "0x742d35Cc6634C0532925a3b8D4C9B3A7D5e1c2F",
    amountUsdc: 1750,
    status: "funds_locked",
    escrowContract: "0xEsc2b3c4d5e6f7a8b9c0d1e2f",
    escrowId: "ESC-M8KP91",
    txHash: "0xabc123def456abc123def456abc123def456abc123def456abc123def456abc1",
    createdAt: "2026-09-11T10:05:00Z",
    updatedAt: "2026-09-11T10:07:00Z",
  },
  {
    id: "ORD-2C9B1",
    product: SELLER_PRODUCTS[0],
    buyerAddress: "0x3a9f12Bb4521Dc8E7F44a1b0C3e256Fd8A1c5B2",
    amountUsdc: 320,
    status: "shipped",
    escrowContract: "0xEsc1a2b3c4d5e6f7a8b9c0d1e2f",
    escrowId: "ESC-N3TR44",
    txHash: "0xdef456abc123def456abc123def456abc123def456abc123def456abc123def4",
    createdAt: "2026-09-08T14:22:00Z",
    updatedAt: "2026-09-10T09:15:00Z",
    shipping: {
      carrier: "FedEx",
      trackingNumber: "794644792798",
      trackingUrl: "https://www.fedex.com/fedextrack/?trknbr=794644792798",
      shippedAt: "2026-09-10T09:15:00Z",
    },
  },
  {
    id: "ORD-5E8D3",
    product: SELLER_PRODUCTS[2],
    buyerAddress: "0x9c1E45Dd2038Ab7F3c8B2a4E1f567Ce9D3b8F01",
    amountUsdc: 1890,
    status: "completed",
    escrowContract: "0xEsc4d5e6f7a8b9c0d1e2f",
    escrowId: "ESC-Q7WX22",
    txHash: "0x789abc123def456789abc123def456789abc123def456789abc123def456789a",
    createdAt: "2026-08-22T08:30:00Z",
    updatedAt: "2026-08-27T16:44:00Z",
    shipping: {
      carrier: "DHL",
      trackingNumber: "1234567890",
      trackingUrl: "https://www.dhl.com",
      shippedAt: "2026-08-24T11:00:00Z",
    },
  },
  {
    id: "ORD-9A1F6",
    product: SELLER_PRODUCTS[3],
    buyerAddress: "0x5b7F33Aa9012Bc4D1e8C3f2A0d456Ef7B8C9D0E",
    amountUsdc: 5800,
    status: "disputed",
    escrowContract: "0xEsc5e6f7a8b9c0d1e2f",
    escrowId: "ESC-R5HJ77",
    txHash: "0x321fed654cba321fed654cba321fed654cba321fed654cba321fed654cba321f",
    createdAt: "2026-09-01T16:00:00Z",
    updatedAt: "2026-09-06T12:30:00Z",
    shipping: {
      carrier: "UPS",
      trackingNumber: "1Z999AA10123456784",
      trackingUrl: "https://www.ups.com",
      shippedAt: "2026-09-03T08:00:00Z",
    },
  },
  {
    id: "ORD-3B5C8",
    product: SELLER_PRODUCTS[1],
    buyerAddress: "0x2d4C88Ff1123Aa6B0f9D7e5c3B890Ab4D5E6F78",
    amountUsdc: 1750,
    status: "completed",
    escrowContract: "0xEsc2b3c4d5e6f7a8b9c0d1e2f",
    escrowId: "ESC-S2LM55",
    txHash: "0x456def789abc456def789abc456def789abc456def789abc456def789abc456d",
    createdAt: "2026-08-10T09:00:00Z",
    updatedAt: "2026-08-15T14:20:00Z",
    shipping: {
      carrier: "FedEx",
      trackingNumber: "412389475634",
      trackingUrl: "https://www.fedex.com",
      shippedAt: "2026-08-12T10:00:00Z",
    },
  },
];

// ─── Derived stats ────────────────────────────────────────────────────────────

export const SELLER_STATS = {
  activeOrders:      SELLER_ORDERS.filter((o) => o.status === "funds_locked" || o.status === "shipped").length,
  completedSales:    SELLER_ORDERS.filter((o) => o.status === "completed").length,
  escrowBalanceUsdc: SELLER_ORDERS.filter((o) => o.status === "funds_locked" || o.status === "shipped")
                       .reduce((sum, o) => sum + o.amountUsdc, 0),
  totalProducts:     SELLER_PRODUCTS.length,
};

export const SELLER_ORDER_STATUS_LABELS: Record<SellerOrderStatus, string> = {
  funds_locked: "Financiada",
  shipped:      "Enviada",
  completed:    "Completada",
  disputed:     "Disputada",
  refunded:     "Reembolsada",
};

export const SELLER_PRODUCT_STATUS_LABELS: Record<SellerProductStatus, string> = {
  active:   "Activo",
  inactive: "Inactivo",
  draft:    "Borrador",
};
