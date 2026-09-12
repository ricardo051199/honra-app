/**
 * usdcService — USDC balance and spend approval on HSK Chain.
 * Mock implementation. Replace with ERC-20 contract calls via ethers.js / viem.
 *
 * USDC contract on HSK Chain: 0xUsdc000...  (placeholder — replace with real address)
 */

export interface ApproveResult {
  txHash: string;
  approvedAmount: number;
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

export const usdcService = {
  USDC_DECIMALS: 6,
  USDC_CONTRACT: "0xUsdc000000000000000000000000000000000000",

  /**
   * Fetch the USDC balance for a wallet address.
   * In production: call balanceOf(address) on the USDC ERC-20 contract.
   */
  async getBalance(address: string): Promise<number> {
    void address;
    await delay(400);
    return 4_280.5;
  },

  /**
   * Check current allowance granted to the escrow contract.
   * In production: call allowance(owner, spender) on the USDC contract.
   */
  async getAllowance(owner: string, spender: string): Promise<number> {
    void owner;
    void spender;
    await delay(200);
    return 0;
  },

  /**
   * Request user wallet signature to approve USDC spend.
   * In production: call approve(spender, amount) and return the tx hash.
   * This step requires a wallet signature — the user will see a wallet popup.
   */
  async approveSpend(
    _owner: string,
    _spender: string,
    amount: number
  ): Promise<ApproveResult> {
    await delay(1_100);
    return {
      txHash: randomTxHash(),
      approvedAmount: amount,
    };
  },

  /**
   * Validate the wallet has sufficient USDC for a given amount.
   */
  async validateSufficientBalance(
    address: string,
    requiredAmount: number
  ): Promise<{ sufficient: boolean; balance: number }> {
    const balance = await usdcService.getBalance(address);
    return { sufficient: balance >= requiredAmount, balance };
  },
};
