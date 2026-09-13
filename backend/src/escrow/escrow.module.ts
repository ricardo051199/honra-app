import { Module } from '@nestjs/common';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { EscrowService } from './escrow.service';

@Module({
  imports: [BlockchainModule],
  providers: [EscrowService],
  exports: [EscrowService],
})
export class EscrowModule {}
