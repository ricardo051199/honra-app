import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { EscrowModule } from '../escrow/escrow.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderStateService } from './order-state.service';

@Module({
  imports: [ProductsModule, EscrowModule, TransactionsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrderStateService],
  exports: [OrdersService, OrderStateService],
})
export class OrdersModule {}
