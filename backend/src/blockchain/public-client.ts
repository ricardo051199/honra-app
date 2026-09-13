import { createPublicClient, http, PublicClient } from 'viem';
import { hskTestnet } from '../config/blockchain.config.js';

export function createHskPublicClient(rpcUrl: string): PublicClient {
  return createPublicClient({
    chain: hskTestnet,
    transport: http(rpcUrl),
  });
}
