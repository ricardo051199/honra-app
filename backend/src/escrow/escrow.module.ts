import { Module } from '@nestjs/common';
import { BlockchainModule } from '../blockchain/blockchain.module.js';
import { EscrowService } from './escrow.service.js';

@Module({
  imports: [BlockchainModule],
  providers: [EscrowService],
  exports: [EscrowService],
})
export class EscrowModule {}
