import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module.js';
import { EscrowModule } from '../escrow/escrow.module.js';
import { TransactionsModule } from '../transactions/transactions.module.js';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { OrderStateService } from './order-state.service.js';

@Module({
  imports: [ProductsModule, EscrowModule, TransactionsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrderStateService],
  exports: [OrdersService, OrderStateService],
})
export class OrdersModule {}
