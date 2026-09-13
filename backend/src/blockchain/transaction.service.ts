import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { PublicClient, TransactionReceipt } from 'viem';
import { createHskPublicClient } from './public-client.js';

/**
 * Everything that touches the chain for READS and for confirming that a
 * transaction actually happened goes through here. The backend never
 * trusts a txHash reported by the frontend without checking it against
 * this service first.
 */
@Injectable()
export class BlockchainTransactionService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainTransactionService.name);
  private client!: PublicClient;
  private expectedChainId!: number;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const rpcUrl = this.config.get<string>('app.hskRpcUrl')!;
    this.expectedChainId = this.config.get<number>('app.hskChainId')!;
    this.client = createHskPublicClient(rpcUrl);

    try {
      const chainId = await this.client.getChainId();
      if (chainId !== this.expectedChainId) {
        this.logger.error(
          `RPC chainId mismatch: expected ${this.expectedChainId} (HSK testnet), got ${chainId}. ` +
            'Refusing to trust this RPC for on-chain verification.',
        );
      } else {
        this.logger.log(`Connected to HSK Chain (chainId ${chainId}) via ${rpcUrl}`);
      }
    } catch (err) {
      this.logger.error(`Failed to reach HSK RPC at ${rpcUrl}: ${(err as Error).message}`);
    }
  }

  getClient(): PublicClient {
    return this.client;
  }

  async assertChainId(): Promise<void> {
    const chainId = await this.client.getChainId();
    if (chainId !== this.expectedChainId) {
      throw new Error(`Invalid blockchain network: expected ${this.expectedChainId}, got ${chainId}`);
    }
  }

  /**
   * Waits for and returns a confirmed receipt, or throws. Callers should
   * treat a `status !== 'success'` receipt as a failed transaction.
   */
  async getConfirmedReceipt(txHash: `0x${string}`, confirmations = 1): Promise<TransactionReceipt> {
    return this.client.waitForTransactionReceipt({
      hash: txHash,
      confirmations,
    });
  }

  async getReceiptIfMined(txHash: `0x${string}`): Promise<TransactionReceipt | null> {
    try {
      return await this.client.getTransactionReceipt({ hash: txHash });
    } catch {
      return null;
    }
  }

  async getBlockNumber(): Promise<bigint> {
    return this.client.getBlockNumber();
  }
}
