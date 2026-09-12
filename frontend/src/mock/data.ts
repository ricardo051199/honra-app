export type OrderStatus =
  | "pending_payment"
  | "funds_locked"
  | "shipped"
  | "delivered"
  | "completed"
  | "disputed"
  | "refunded"
  | "cancelled";

export interface Product {
  id: string;
  title: string;
  description: string;
  priceUsdc: number;
  seller: string;
  sellerAddress: string;
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  escrowContract: string;
}

export interface ShippingInfo {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  shippedAt: string;
}

export interface Order {
  id: string;
  product: Product;
  status: OrderStatus;
  buyerAddress: string;
  sellerAddress: string;
  amountUsdc: number;
  escrowContract: string;
  escrowId: string;
  txHash: string;
  createdAt: string;
  updatedAt: string;
  shippingInfo?: ShippingInfo;
}

export const MOCK_WALLET = {
  connected: true,
  address: "0x742d35Cc6634C0532925a3b8D4C9B3A7D5e1c2F",
  balanceUsdc: 4280.5,
  chain: "HSK Chain",
  chainId: 177,
  name: "Usuario Honra",
  email: "usuario@honra.app",
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Sony WH-1000XM5 Headphones",
    description:
      "Industry-leading noise canceling with 30-hour battery life. Brand new, sealed box.",
    priceUsdc: 320,
    seller: "AudioStore Pro",
    sellerAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    category: "Electronics",
    imageUrl:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop&auto=format",
    rating: 4.9,
    reviewCount: 142,
    escrowContract: "0xEsc1a2b3c4d5e6f7a8b9c0d1e2f",
  },
  {
    id: "p2",
    title: "MacBook Pro 14\" M3 Pro",
    description:
      "Apple M3 Pro chip, 18GB RAM, 512GB SSD. Excellent condition, includes original charger.",
    priceUsdc: 1750,
    seller: "TechResale Hub",
    sellerAddress: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
    category: "Computers",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop&auto=format",
    rating: 4.7,
    reviewCount: 58,
    escrowContract: "0xEsc2b3c4d5e6f7a8b9c0d1e2f",
  },
  {
    id: "p3",
    title: "Rolex Submariner Date",
    description:
      "Ref. 126610LN. Full set with box and papers, 2023. Unworn display model.",
    priceUsdc: 12400,
    seller: "LuxWatch Collective",
    sellerAddress: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
    category: "Watches",
    imageUrl:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=300&fit=crop&auto=format",
    rating: 5.0,
    reviewCount: 23,
    escrowContract: "0xEsc3c4d5e6f7a8b9c0d1e2f",
  },
  {
    id: "p4",
    title: "DJI Mavic 3 Pro Drone",
    description:
      "Hasselblad triple-camera system. 43-min flight time. Like new, 3 flights total.",
    priceUsdc: 1890,
    seller: "SkyTech Depot",
    sellerAddress: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e",
    category: "Photography",
    imageUrl:
      "https://images.unsplash.com/photo-1506947411487-a56738267384?w=400&h=300&fit=crop&auto=format",
    rating: 4.8,
    reviewCount: 37,
    escrowContract: "0xEsc4d5e6f7a8b9c0d1e2f",
  },
  {
    id: "p5",
    title: "Leica Q3 Camera",
    description:
      "Full-frame 60MP sensor with 28mm Summilux f/1.7 lens. Mint condition.",
    priceUsdc: 5800,
    seller: "LuxPhoto Studio",
    sellerAddress: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
    category: "Photography",
    imageUrl:
      "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=400&h=300&fit=crop&auto=format",
    rating: 4.9,
    reviewCount: 19,
    escrowContract: "0xEsc5e6f7a8b9c0d1e2f",
  },
  {
    id: "p6",
    title: "iPad Pro 12.9\" M2",
    description:
      "256GB WiFi + Cellular. Includes Apple Pencil 2nd gen and Magic Keyboard.",
    priceUsdc: 1100,
    seller: "iDevice Market",
    sellerAddress: "0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a",
    category: "Tablets",
    imageUrl:
      "https://images.unsplash.com/photo-1544244015-0df4592c5329?w=400&h=300&fit=crop&auto=format",
    rating: 4.6,
    reviewCount: 84,
    escrowContract: "0xEsc6f7a8b9c0d1e2f",
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-7F4A2",
    product: MOCK_PRODUCTS[1],
    status: "shipped",
    buyerAddress: MOCK_WALLET.address,
    sellerAddress: MOCK_PRODUCTS[1].sellerAddress,
    amountUsdc: 1750,
    escrowContract: MOCK_PRODUCTS[1].escrowContract,
    escrowId: "ESC-M8KP91",
    txHash: "0xabc123def456abc123def456abc123def456abc123def456abc123def456abc1",
    createdAt: "2026-09-08T14:22:00Z",
    updatedAt: "2026-09-10T09:15:00Z",
    shippingInfo: {
      carrier: "FedEx",
      trackingNumber: "794644792798",
      trackingUrl: "https://www.fedex.com/fedextrack/?trknbr=794644792798",
      shippedAt: "2026-09-10T09:15:00Z",
    },
  },
  {
    id: "ORD-2C9B1",
    product: MOCK_PRODUCTS[0],
    status: "funds_locked",
    buyerAddress: MOCK_WALLET.address,
    sellerAddress: MOCK_PRODUCTS[0].sellerAddress,
    amountUsdc: 320,
    escrowContract: MOCK_PRODUCTS[0].escrowContract,
    escrowId: "ESC-N3TR44",
    txHash: "0xdef456abc123def456abc123def456abc123def456abc123def456abc123def4",
    createdAt: "2026-09-11T10:05:00Z",
    updatedAt: "2026-09-11T10:07:00Z",
  },
  {
    id: "ORD-5E8D3",
    product: MOCK_PRODUCTS[3],
    status: "completed",
    buyerAddress: MOCK_WALLET.address,
    sellerAddress: MOCK_PRODUCTS[3].sellerAddress,
    amountUsdc: 1890,
    escrowContract: MOCK_PRODUCTS[3].escrowContract,
    escrowId: "ESC-Q7WX22",
    txHash: "0x789abc123def456789abc123def456789abc123def456789abc123def456789a",
    createdAt: "2026-08-22T08:30:00Z",
    updatedAt: "2026-08-27T16:44:00Z",
    shippingInfo: {
      carrier: "DHL",
      trackingNumber: "1234567890",
      trackingUrl: "https://www.dhl.com/en/express/tracking.html?AWB=1234567890",
      shippedAt: "2026-08-24T11:00:00Z",
    },
  },
  {
    id: "ORD-9A1F6",
    product: MOCK_PRODUCTS[2],
    status: "disputed",
    buyerAddress: MOCK_WALLET.address,
    sellerAddress: MOCK_PRODUCTS[2].sellerAddress,
    amountUsdc: 12400,
    escrowContract: MOCK_PRODUCTS[2].escrowContract,
    escrowId: "ESC-R5HJ77",
    txHash: "0x321fed654cba321fed654cba321fed654cba321fed654cba321fed654cba321f",
    createdAt: "2026-09-01T16:00:00Z",
    updatedAt: "2026-09-06T12:30:00Z",
    shippingInfo: {
      carrier: "UPS",
      trackingNumber: "1Z999AA10123456784",
      trackingUrl: "https://www.ups.com/track?loc=en_US&tracknum=1Z999AA10123456784",
      shippedAt: "2026-09-03T08:00:00Z",
    },
  },
  {
    id: "ORD-3B5C8",
    product: MOCK_PRODUCTS[5],
    status: "refunded",
    buyerAddress: MOCK_WALLET.address,
    sellerAddress: MOCK_PRODUCTS[5].sellerAddress,
    amountUsdc: 1100,
    escrowContract: MOCK_PRODUCTS[5].escrowContract,
    escrowId: "ESC-S2LM55",
    txHash: "0x456def789abc456def789abc456def789abc456def789abc456def789abc456d",
    createdAt: "2026-08-10T09:00:00Z",
    updatedAt: "2026-08-15T14:20:00Z",
  },
  {
    id: "ORD-1D6E9",
    product: MOCK_PRODUCTS[4],
    status: "pending_payment",
    buyerAddress: MOCK_WALLET.address,
    sellerAddress: MOCK_PRODUCTS[4].sellerAddress,
    amountUsdc: 5800,
    escrowContract: MOCK_PRODUCTS[4].escrowContract,
    escrowId: "ESC-T8NP33",
    txHash: "",
    createdAt: "2026-09-12T08:00:00Z",
    updatedAt: "2026-09-12T08:00:00Z",
  },
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Created",
  funds_locked: "Funded",
  shipped: "Shipped",
  delivered: "Delivered",
  completed: "Completed",
  disputed: "Disputed",
  refunded: "Refunded",
  cancelled: "Cancelled",
};
