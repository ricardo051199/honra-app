import { Module } from '@nestjs/common';
import { BlockchainModule } from '../blockchain/blockchain.module.js';
import { HealthController } from './health.controller.js';

@Module({
  imports: [BlockchainModule],
  controllers: [HealthController],
})
export class HealthModule {}
