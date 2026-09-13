import { defineChain } from 'viem';

/**
 * HSK Chain TESTNET.
 *
 * IMPORTANT: chainId is 133 for testnet. 177 is MAINNET — do not reuse
 * that value here even though earlier frontend code had it hardcoded.
 */
export const hskTestnet = defineChain({
  id: 133,
  name: 'HSK Chain Testnet',
  nativeCurrency: {
    name: 'HSK',
    symbol: 'HSK',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.HSK_RPC_URL ?? 'https://testnet.hsk.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HSK Explorer',
      url: process.env.HSK_EXPLORER_URL ?? 'https://testnet-explorer.hsk.xyz',
    },
  },
  testnet: true,
});
