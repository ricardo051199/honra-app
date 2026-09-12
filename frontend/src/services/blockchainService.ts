/**
 * blockchainService — wallet connection and network validation.
 * Mock implementation. Replace with ethers.js / viem calls when integrating
 * with a real EVM wallet (MetaMask, WalletConnect, etc.).
 */

export interface WalletInfo {
  address: string;
  chainId: number;
  chainName: string;
}

export interface TransactionReceipt {
  txHash: string;
  blockNumber: number;
  status: "success" | "failed";
}

const HSK_CHAIN_ID = 177;
const HSK_EXPLORER = "https://explorer.hsk.xyz";

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function randomTxHash(): string {
  const hex = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  return `0x${hex}`;
}

export const blockchainService = {
  HSK_CHAIN_ID,
  HSK_EXPLORER,

  /**
   * Simulate connecting an EVM wallet.
   * In production: call window.ethereum.request({ method: 'eth_requestAccounts' })
   */
  async connectWallet(): Promise<WalletInfo> {
    await delay(900);
    return {
      address: "0x742d35Cc6634C0532925a3b8D4C9B3A7D5e1c2F",
      chainId: HSK_CHAIN_ID,
      chainName: "HSK Chain",
    };
  },

  /**
   * Verify the wallet is on HSK Chain.
   * In production: read chainId from provider and prompt switchChain if needed.
   */
  async verifyNetwork(chainId: number): Promise<boolean> {
    await delay(150);
    return chainId === HSK_CHAIN_ID;
  },

  /**
   * Wait for a transaction to be mined and return the receipt.
   * In production: provider.waitForTransaction(txHash)
   */
  async waitForTransaction(txHash: string): Promise<TransactionReceipt> {
    void txHash;
    await delay(2800);
    return {
      txHash,
      blockNumber: 4_201_337,
      status: "success",
    };
  },

  formatExplorerUrl(txHash: string): string {
    return `${HSK_EXPLORER}/tx/${txHash}`;
  },

  truncateTxHash(txHash: string): string {
    return `${txHash.slice(0, 6)}…${txHash.slice(-4)}`;
  },
};
