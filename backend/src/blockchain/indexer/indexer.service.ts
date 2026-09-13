import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlockchainTransactionService } from '../transaction.service';
import { BlockCursorService } from './block-cursor.service';
import { EventProcessorService } from './event-processor.service';

/**
 * Polls HSK Chain for new HonraEscrow logs and processes them, so the
 * database stays in sync even if the frontend never calls back.
 *
 * Currently reads raw logs without ABI decoding (no `event:` filter is
 * passed to getLogs, and eventName/args are left undefined) because the
 * ABI has not been confirmed yet. Once `abi/HonraEscrow.json` is in
 * place, switch to `client.getContractEvents({ abi, address, ... })` so
 * logs arrive pre-decoded with `eventName` and `args`.
 */
@Injectable()
export class IndexerService implements OnModuleInit {
  private readonly logger = new Logger(IndexerService.name);
  private contractAddress!: string;
  private pollIntervalMs!: number;
  private confirmations!: number;
  private running = false;

  constructor(
    private readonly config: ConfigService,
    private readonly txService: BlockchainTransactionService,
    private readonly cursor: BlockCursorService,
    private readonly processor: EventProcessorService,
  ) {}

  onModuleInit() {
    this.contractAddress = this.config.get<string>('app.honraEscrowAddress', '');
    this.pollIntervalMs = this.config.get<number>('app.indexerPollIntervalMs', 5000);
    this.confirmations = this.config.get<number>('app.indexerConfirmations', 3);

    if (!this.contractAddress) {
      this.logger.warn('HONRA_ESCROW_ADDRESS is not set; indexer will not start.');
      return;
    }

    this.start();
  }

  private start() {
    this.running = true;
    void this.loop();
  }

  stop() {
    this.running = false;
  }

  private async loop() {
    while (this.running) {
      try {
        await this.tick();
      } catch (err) {
        this.logger.error(`Indexer tick failed: ${(err as Error).message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, this.pollIntervalMs));
    }
  }

  private async tick() {
    const client = this.txService.getClient();
    const latest = await client.getBlockNumber();
    const safeHead = latest - BigInt(this.confirmations);
    if (safeHead < 0n) return;

    const fromBlock = await this.cursor.getLastProcessedBlock(this.contractAddress);
    if (fromBlock >= safeHead) return;

    // Chunk to avoid RPC "block range too large" errors on public endpoints.
    const maxSpan = 2000n;
    const toBlock = safeHead - fromBlock > maxSpan ? fromBlock + maxSpan : safeHead;

    const logs = await client.getLogs({
      address: this.contractAddress as `0x${string}`,
      fromBlock: fromBlock + 1n,
      toBlock,
      // TODO: once abi/HonraEscrow.json exists, decode logs here (or use
      // client.getContractEvents) instead of passing them through raw.
    });

    for (const log of logs) {
      await this.processor.process(log);
    }

    await this.cursor.setLastProcessedBlock(this.contractAddress, toBlock);
    if (logs.length > 0) {
      this.logger.log(`Indexed ${logs.length} log(s) up to block ${toBlock}`);
    }
  }
}
