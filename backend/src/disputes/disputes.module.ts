import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { EscrowModule } from '../escrow/escrow.module';
import { DisputesController } from './disputes.controller';
import { DisputesService } from './disputes.service';

@Module({
  imports: [OrdersModule, EscrowModule],
  controllers: [DisputesController],
  providers: [DisputesService],
  exports: [DisputesService],
})
export class DisputesModule {}
