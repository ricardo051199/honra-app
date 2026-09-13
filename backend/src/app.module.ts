import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import envConfig from './config/env.config';

import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { EscrowModule } from './escrow/escrow.module';
import { DisputesModule } from './disputes/disputes.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    ThrottlerModule.forRoot([
      {
        // Generous default; auth/orders/disputes controllers can override
        // with stricter per-route limits via @Throttle() as needed.
        ttl: 60_000,
        limit: 120,
      },
    ]),
    SupabaseModule,
    BlockchainModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    EscrowModule,
    OrdersModule,
    DisputesModule,
    TransactionsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
