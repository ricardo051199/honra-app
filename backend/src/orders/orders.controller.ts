import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthTokenPayload } from '../auth/auth.service.js';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { FundOrderDto } from './dto/fund-order.dto.js';
import { ShipOrderDto } from './dto/ship-order.dto.js';
import { TransactionsService } from '../transactions/transactions.service.js';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Get()
  list(@CurrentUser() user: AuthTokenPayload) {
    return this.ordersService.listForUser(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthTokenPayload) {
    return this.ordersService.findById(id, user.sub);
  }

  @Post()
  create(@CurrentUser() user: AuthTokenPayload, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.sub, user.address, dto);
  }

  @Post(':id/fund')
  fund(@Param('id') id: string, @CurrentUser() user: AuthTokenPayload, @Body() dto: FundOrderDto) {
    return this.ordersService.fund(id, user.sub, dto);
  }

  @Post(':id/ship')
  ship(@Param('id') id: string, @CurrentUser() user: AuthTokenPayload, @Body() dto: ShipOrderDto) {
    return this.ordersService.ship(id, user.sub, dto);
  }

  @Post(':id/confirm-delivery')
  confirmDelivery(@Param('id') id: string, @CurrentUser() user: AuthTokenPayload) {
    return this.ordersService.confirmDelivery(id, user.sub);
  }

  @Post(':id/refund')
  refund(@Param('id') id: string, @CurrentUser() user: AuthTokenPayload) {
    return this.ordersService.requestRefund(id, user.sub);
  }

  @Get(':id/transactions')
  transactions(@Param('id') id: string, @CurrentUser() user: AuthTokenPayload) {
    // Ensures the caller has access to the order before exposing its transactions.
    return this.ordersService.findById(id, user.sub).then(() => this.transactionsService.listForOrder(id));
  }
}
