/**
 * mockApi — mirrors the SafeBuy NestJS REST API surface.
 *
 * Swap each method body for a real fetch/axios call when the backend is ready:
 *   return fetch(`${BASE_URL}/orders/${id}`).then(r => r.json())
 *
 * Endpoints:
 *   GET    /products
 *   GET    /products/:id
 *   POST   /products
 *   GET    /orders
 *   GET    /orders/:id
 *   POST   /orders
 *   POST   /orders/:id/fund
 *   POST   /orders/:id/ship
 *   POST   /orders/:id/confirm-delivery
 *   POST   /orders/:id/refund
 *   POST   /orders/:id/dispute
 *   GET    /orders/:id/transactions
 *   GET    /disputes
 *   GET    /disputes/:id
 */

import { MOCK_PRODUCTS, MOCK_ORDERS, type Product, type Order } from "../mock/data";
import { SELLER_PRODUCTS, SELLER_ORDERS, type SellerProduct, type SellerOrder } from "../mock/sellerData";
import { MOCK_DISPUTES, type Dispute } from "../mock/disputeData";

function delay(ms = 300) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function notFound(resource: string, id: string): never {
  throw new Error(`${resource} not found: ${id}`);
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface CreateProductDto {
  title: string;
  description: string;
  priceUsdc: number;
  imageUrl?: string;
  stock: number;
  category?: string;
}

export interface CreateOrderDto {
  productId: string;
  buyerAddress: string;
}

export interface ShipOrderDto {
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
}

export interface OpenDisputeDto {
  reason: string;
  description: string;
}

export interface OrderTransaction {
  id: string;
  type: "fund" | "approve" | "ship" | "confirm" | "refund" | "dispute_open" | "dispute_resolve";
  txHash: string;
  timestamp: string;
  description: string;
  amountUsdc?: number;
}

// ─── Products ─────────────────────────────────────────────────────────────────

async function listProducts(): Promise<Product[]> {
  await delay();
  return MOCK_PRODUCTS;
}

async function getProduct(id: string): Promise<Product> {
  await delay();
  const p = MOCK_PRODUCTS.find((p) => p.id === id);
  if (!p) notFound("Product", id);
  return p;
}

async function createProduct(dto: CreateProductDto): Promise<SellerProduct> {
  await delay(800);
  return {
    id: `sp${Date.now()}`,
    title: dto.title,
    description: dto.description,
    priceUsdc: dto.priceUsdc,
    imageUrl: dto.imageUrl ?? "",
    stock: dto.stock,
    status: "active",
    category: dto.category ?? "General",
    createdAt: new Date().toISOString(),
  };
}

// ─── Orders ───────────────────────────────────────────────────────────────────

async function listOrders(): Promise<Order[]> {
  await delay();
  return MOCK_ORDERS;
}

async function getOrder(id: string): Promise<Order> {
  await delay();
  const o = MOCK_ORDERS.find((o) => o.id === id);
  if (!o) notFound("Order", id);
  return o;
}

async function createOrder(dto: CreateOrderDto): Promise<Order> {
  await delay(600);
  const product = MOCK_PRODUCTS.find((p) => p.id === dto.productId);
  if (!product) notFound("Product", dto.productId);
  return {
    id: `ORD-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    product,
    status: "pending_payment",
    buyerAddress: dto.buyerAddress,
    sellerAddress: product.sellerAddress,
    amountUsdc: product.priceUsdc,
    escrowContract: product.escrowContract,
    escrowId: `ESC-${Date.now().toString(36).toUpperCase()}`,
    txHash: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function fundOrder(id: string): Promise<{ txHash: string }> {
  await delay(2000);
  return { txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` };
}

async function shipOrder(id: string, dto: ShipOrderDto): Promise<{ txHash: string }> {
  await delay(1500);
  void id; void dto;
  return { txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` };
}

async function confirmDelivery(id: string): Promise<{ txHash: string }> {
  await delay(2000);
  void id;
  return { txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` };
}

async function refundOrder(id: string): Promise<{ txHash: string }> {
  await delay(2000);
  void id;
  return { txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` };
}

async function openDispute(id: string, dto: OpenDisputeDto): Promise<Dispute> {
  await delay(800);
  void id; void dto;
  return MOCK_DISPUTES[0];
}

async function getOrderTransactions(id: string): Promise<OrderTransaction[]> {
  await delay(400);
  void id;
  return [
    { id: "t1", type: "approve", txHash: `0x${Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join("")}`, timestamp: new Date(Date.now() - 3_600_000).toISOString(), description: "USDC spend approved" },
    { id: "t2", type: "fund",    txHash: `0x${Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join("")}`, timestamp: new Date(Date.now() - 3_500_000).toISOString(), description: "Escrow funded", amountUsdc: 500 },
  ];
}

// ─── Seller orders ────────────────────────────────────────────────────────────

async function listSellerOrders(): Promise<SellerOrder[]> {
  await delay();
  return SELLER_ORDERS;
}

async function getSellerOrder(id: string): Promise<SellerOrder> {
  await delay();
  const o = SELLER_ORDERS.find((o) => o.id === id);
  if (!o) notFound("SellerOrder", id);
  return o;
}

// ─── Disputes ─────────────────────────────────────────────────────────────────

async function listDisputes(): Promise<Dispute[]> {
  await delay();
  return MOCK_DISPUTES;
}

async function getDispute(id: string): Promise<Dispute> {
  await delay();
  const d = MOCK_DISPUTES.find((d) => d.id === id);
  if (!d) notFound("Dispute", id);
  return d;
}

async function resolveDisputeRefund(id: string): Promise<{ txHash: string }> {
  await delay(2000);
  void id;
  return { txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` };
}

async function resolveDisputeRelease(id: string): Promise<{ txHash: string }> {
  await delay(2000);
  void id;
  return { txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` };
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const mockApi = {
  products: { list: listProducts, get: getProduct, create: createProduct },
  orders: {
    list: listOrders,
    get: getOrder,
    create: createOrder,
    fund: fundOrder,
    ship: shipOrder,
    confirmDelivery,
    refund: refundOrder,
    dispute: openDispute,
    getTransactions: getOrderTransactions,
  },
  sellerOrders: { list: listSellerOrders, get: getSellerOrder },
  disputes: {
    list: listDisputes,
    get: getDispute,
    resolveRefund: resolveDisputeRefund,
    resolveRelease: resolveDisputeRelease,
  },
};
