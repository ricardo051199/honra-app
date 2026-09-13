import { Module } from '@nestjs/common';
import { BlockchainTransactionService } from './transaction.service';
import { IndexerService } from './indexer/indexer.service';
import { EventProcessorService } from './indexer/event-processor.service';
import { BlockCursorService } from './indexer/block-cursor.service';

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
