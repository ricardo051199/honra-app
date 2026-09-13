import { Module } from '@nestjs/common';
import { BlockchainTransactionService } from './transaction.service.js';
import { IndexerService } from './indexer/indexer.service.js';
import { EventProcessorService } from './indexer/event-processor.service.js';
import { BlockCursorService } from './indexer/block-cursor.service.js';

@Module({
  providers: [
    BlockchainTransactionService,
    IndexerService,
    EventProcessorService,
    BlockCursorService,
  ],
  exports: [BlockchainTransactionService],
})
export class BlockchainModule {}
