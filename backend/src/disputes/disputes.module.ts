import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module.js';
import { EscrowModule } from '../escrow/escrow.module.js';
import { DisputesController } from './disputes.controller.js';
import { DisputesService } from './disputes.service.js';

@Module({
  imports: [OrdersModule, EscrowModule],
  controllers: [DisputesController],
  providers: [DisputesService],
  exports: [DisputesService],
})
export class DisputesModule {}
