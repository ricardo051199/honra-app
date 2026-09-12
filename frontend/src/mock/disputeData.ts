import { MOCK_PRODUCTS } from "./data";

export type DisputeStatus = "open" | "under_review" | "resolved";
export type DisputeReason =
  | "not_received"
  | "not_as_described"
  | "wrong_item"
  | "seller_cancelled"
  | "other";
export type DisputeResolution = "refunded" | "released_to_seller";
export type DisputeOpenedBy = "buyer" | "seller";

export interface DisputeTimelineEvent {
  id: string;
  label: string;
  description: string;
  timestamp: string;
  type: "opened" | "evidence" | "review" | "resolved" | "tx";
  txHash?: string;
}

export interface DisputeTransaction {
  id: string;
  type: string;
  description: string;
  txHash: string;
  amountUsdc?: number;
  timestamp: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  product: (typeof MOCK_PRODUCTS)[number];
  buyerAddress: string;
  sellerAddress: string;
  amountUsdc: number;
  escrowContract: string;
  escrowId: string;
  openedBy: DisputeOpenedBy;
  reason: DisputeReason;
  description: string;
  status: DisputeStatus;
  resolution?: DisputeResolution;
  createdAt: string;
  updatedAt: string;
  timeline: DisputeTimelineEvent[];
  transactions: DisputeTransaction[];
}

export const DISPUTE_REASON_LABELS: Record<DisputeReason, string> = {
  not_received:     "Artículo no recibido",
  not_as_described: "No coincide con la descripción",
  wrong_item:       "Artículo incorrecto",
  seller_cancelled: "Vendedor canceló",
  other:            "Otro",
};

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: "DSP-A1B2C",
    orderId: "ORD-9A1F6",
    product: MOCK_PRODUCTS[2],
    buyerAddress:  "0x742d35Cc6634C0532925a3b8D4C9B3A7D5e1c2F",
    sellerAddress: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
    amountUsdc: 12400,
    escrowContract: "0xEsc3c4d5e6f7a8b9c0d1e2f",
    escrowId: "ESC-R5HJ77",
    openedBy: "buyer",
    reason: "not_as_described",
    description:
      "The watch was advertised as unworn with full box and papers (2023). Upon receipt, the bracelet shows visible scratches and the papers are from 2021. The item does not match the listing description.",
    status: "under_review",
    createdAt: "2026-09-06T12:30:00Z",
    updatedAt: "2026-09-09T09:00:00Z",
    timeline: [
      {
        id: "e1",
        label: "Dispute opened",
        description: "Buyer opened a dispute: Not as described.",
        timestamp: "2026-09-06T12:30:00Z",
        type: "opened",
      },
      {
        id: "e2",
        label: "Evidence submitted",
        description: "Buyer uploaded photos showing condition discrepancies.",
        timestamp: "2026-09-07T10:15:00Z",
        type: "evidence",
      },
      {
        id: "e3",
        label: "Under review",
        description: "SafeBuy team is reviewing the evidence. Funds remain frozen.",
        timestamp: "2026-09-09T09:00:00Z",
        type: "review",
      },
    ],
    transactions: [
      {
        id: "t1",
        type: "fund",
        description: "Escrow funded by buyer",
        txHash: "0x321fed654cba321fed654cba321fed654cba321fed654cba321fed654cba321f",
        amountUsdc: 12400,
        timestamp: "2026-09-01T16:05:00Z",
      },
      {
        id: "t2",
        type: "dispute_open",
        description: "Dispute contract invoked",
        txHash: "0xaaa111bbb222ccc333ddd444eee555fff666aaa111bbb222ccc333ddd444eee5",
        timestamp: "2026-09-06T12:31:00Z",
      },
    ],
  },
  {
    id: "DSP-D3E4F",
    orderId: "ORD-2C9B1",
    product: MOCK_PRODUCTS[0],
    buyerAddress:  "0x3a9f12Bb4521Dc8E7F44a1b0C3e256Fd8A1c5B2",
    sellerAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    amountUsdc: 320,
    escrowContract: "0xEsc1a2b3c4d5e6f7a8b9c0d1e2f",
    escrowId: "ESC-N3TR44",
    openedBy: "buyer",
    reason: "not_received",
    description:
      "Tracking shows the package was delivered 8 days ago but I never received it. The delivery was marked as 'left at door' with no photo. Checked with neighbours and building management — no package found.",
    status: "open",
    createdAt: "2026-09-12T08:00:00Z",
    updatedAt: "2026-09-12T08:00:00Z",
    timeline: [
      {
        id: "e1",
        label: "Dispute opened",
        description: "Buyer opened a dispute: Item not received.",
        timestamp: "2026-09-12T08:00:00Z",
        type: "opened",
      },
    ],
    transactions: [
      {
        id: "t1",
        type: "fund",
        description: "Escrow funded by buyer",
        txHash: "0xdef456abc123def456abc123def456abc123def456abc123def456abc123def4",
        amountUsdc: 320,
        timestamp: "2026-09-08T14:25:00Z",
      },
    ],
  },
  {
    id: "DSP-G5H6I",
    orderId: "ORD-5E8D3",
    product: MOCK_PRODUCTS[3],
    buyerAddress:  "0x9c1E45Dd2038Ab7F3c8B2a4E1f567Ce9D3b8F01",
    sellerAddress: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e",
    amountUsdc: 1890,
    escrowContract: "0xEsc4d5e6f7a8b9c0d1e2f",
    escrowId: "ESC-Q7WX22",
    openedBy: "buyer",
    reason: "wrong_item",
    description:
      "I ordered the DJI Mavic 3 Pro but received the standard Mavic 3 (without the Pro triple-camera system). Completely different model and significant price difference.",
    status: "resolved",
    resolution: "refunded",
    createdAt: "2026-08-18T11:00:00Z",
    updatedAt: "2026-08-21T15:30:00Z",
    timeline: [
      {
        id: "e1",
        label: "Dispute opened",
        description: "Buyer opened a dispute: Wrong item sent.",
        timestamp: "2026-08-18T11:00:00Z",
        type: "opened",
      },
      {
        id: "e2",
        label: "Evidence submitted",
        description: "Buyer provided unboxing photos confirming wrong model.",
        timestamp: "2026-08-19T09:30:00Z",
        type: "evidence",
      },
      {
        id: "e3",
        label: "Under review",
        description: "Seller contacted. Acknowledged the shipping error.",
        timestamp: "2026-08-20T14:00:00Z",
        type: "review",
      },
      {
        id: "e4",
        label: "Resolved — Buyer refunded",
        description: "1,890 USDC refunded to buyer wallet.",
        timestamp: "2026-08-21T15:30:00Z",
        type: "resolved",
      },
    ],
    transactions: [
      {
        id: "t1",
        type: "fund",
        description: "Escrow funded by buyer",
        txHash: "0x789abc123def456789abc123def456789abc123def456789abc123def456789a",
        amountUsdc: 1890,
        timestamp: "2026-08-22T08:33:00Z",
      },
      {
        id: "t2",
        type: "dispute_open",
        description: "Dispute contract invoked",
        txHash: "0xbbb222ccc333ddd444eee555fff666aaa111bbb222ccc333ddd444eee555fff6",
        timestamp: "2026-08-18T11:01:00Z",
      },
      {
        id: "t3",
        type: "refund",
        description: "Buyer refunded from escrow",
        txHash: "0xccc333ddd444eee555fff666aaa111bbb222ccc333ddd444eee555fff666bbb3",
        amountUsdc: 1890,
        timestamp: "2026-08-21T15:31:00Z",
      },
    ],
  },
];
