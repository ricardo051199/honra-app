/**
 * escrowService — escrow smart contract interactions on HSK Chain.
 * Mock implementation. Replace with contract calls via ethers.js / viem.
 *
 * The escrow contract locks USDC until the buyer confirms delivery
 * or a dispute is resolved. Funds are never accessible to the seller
 * until the buyer explicitly releases them.
 */

export interface EscrowFundParams {
  buyerAddress: string;
  sellerAddress: string;
  escrowContract: string;
  amountUsdc: number;
  productId: string;
}

export interface EscrowFundResult {
  txHash: string;
  escrowId: string;
  lockedAmount: number;
  lockedAt: string;
}

export interface EscrowStatus {
  escrowId: string;
  status: "funded" | "shipped" | "delivered" | "disputed" | "released" | "refunded";
  lockedAmount: number;
  buyerAddress: string;
  sellerAddress: string;
  createdAt: string;
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function randomTxHash(): string {
  const hex = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  return `0x${hex}`;
}

function randomEscrowId(): string {
  return `ESC-${Date.now().toString(36).toUpperCase()}`;
}

export const escrowService = {
  /**
   * Fund the escrow contract with USDC.
   * In production: call depositFunds(productId, sellerAddress, amount) on the escrow contract.
   * Requires prior USDC approval (usdcService.approveSpend).
   * This step requires a wallet signature — the user will see a wallet popup.
   */
  async fundEscrow(params: EscrowFundParams): Promise<EscrowFundResult> {
    void params;
    await delay(1_200);
    return {
      txHash: randomTxHash(),
      escrowId: randomEscrowId(),
      lockedAmount: params.amountUsdc,
      lockedAt: new Date().toISOString(),
    };
  },

  /**
   * Get the current status of an escrow by ID.
   * In production: call getEscrow(escrowId) on the contract or fetch from NestJS API.
   */
  async getEscrowStatus(escrowId: string): Promise<EscrowStatus> {
    void escrowId;
    await delay(300);
    return {
      escrowId,
      status: "funded",
      lockedAmount: 0,
      buyerAddress: "",
      sellerAddress: "",
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Buyer confirms delivery — releases funds to seller.
   * In production: call confirmDelivery(escrowId) on the contract.
   */
  async confirmDelivery(escrowId: string, buyerAddress: string): Promise<string> {
    void escrowId;
    void buyerAddress;
    await delay(1_500);
    return randomTxHash();
  },

  /**
   * Buyer opens a dispute.
   * In production: call openDispute(escrowId, reason) on the contract.
   */
  async openDispute(
    escrowId: string,
    buyerAddress: string,
    reason: string
  ): Promise<string> {
    void escrowId;
    void buyerAddress;
    void reason;
    await delay(1_000);
    return randomTxHash();
  },
};
