import { BadRequestException, Injectable } from '@nestjs/common';

export type OrderStatus =
  | 'pending_payment'
  | 'funds_locked'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'disputed'
  | 'refunded'
  | 'cancelled';

export type OrderTransition =
  | 'fund'
  | 'ship'
  | 'confirm_delivery'
  | 'open_dispute'
  | 'resolve_refund'
  | 'resolve_release'
  | 'cancel';

/**
 * Single source of truth for which order-status transitions are legal.
 * Both OrdersService (API-triggered transitions) and EventProcessorService
 * (chain-triggered transitions) must go through here — never write
 * `orders.status` directly.
 */
@Injectable()
export class OrderStateService {
  private readonly allowed: Record<OrderTransition, OrderStatus[]> = {
    fund: ['pending_payment'],
    ship: ['funds_locked'],
    confirm_delivery: ['shipped'],
    open_dispute: ['funds_locked', 'shipped', 'delivered'],
    resolve_refund: ['disputed'],
    resolve_release: ['disputed', 'delivered'],
    cancel: ['pending_payment'],
  };

  private readonly nextStatus: Record<OrderTransition, OrderStatus> = {
    fund: 'funds_locked',
    ship: 'shipped',
    confirm_delivery: 'completed',
    open_dispute: 'disputed',
    resolve_refund: 'refunded',
    resolve_release: 'completed',
    cancel: 'cancelled',
  };

  assertTransition(current: OrderStatus, transition: OrderTransition): OrderStatus {
    const validFromStates = this.allowed[transition];
    if (!validFromStates.includes(current)) {
      throw new BadRequestException(
        `Cannot apply "${transition}" to an order in status "${current}". ` +
          `Valid source states: ${validFromStates.join(', ')}.`,
      );
    }
    return this.nextStatus[transition];
  }
}
