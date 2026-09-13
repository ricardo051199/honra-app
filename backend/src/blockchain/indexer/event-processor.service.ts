import { Injectable, Logger } from '@nestjs/common';
import type { Log } from 'viem';
import { SupabaseService } from '../../supabase/supabase.service';

/**
 * Turns a raw log into: a row in `blockchain_events`, and (once matched
 * against the real HonraEscrow ABI) the corresponding update to
 * orders / escrows / transactions.
 *
 * NOTE: the event names/shapes below (OrderCreated, OrderFunded,
 * OrderShipped, DeliveryConfirmed, OrderRefunded, DisputeOpened,
 * DisputeResolved) are the ones implied by the frontend's state machine.
 * They are placeholders — do not treat them as ground truth. Once you
 * provide `abi/HonraEscrow.json`, replace the `decodeEventLog` calls here
 * with the generated types and correct the field names/order.
 */
@Injectable()
export class EventProcessorService {
  private readonly logger = new Logger(EventProcessorService.name);

  constructor(private readonly supabase: SupabaseService) {}

  /** Persists the raw log first (idempotent via unique(tx_hash, log_index)), then dispatches. */
  async process(log: Log & { eventName?: string; args?: Record<string, unknown> }) {
    const client = this.supabase.getClient();

    const { error: insertError } = await client.from('blockchain_events').insert({
      contract_address: (log.address ?? '').toLowerCase(),
      tx_hash: log.transactionHash,
      block_number: Number(log.blockNumber),
      log_index: log.logIndex,
      event_name: log.eventName ?? 'unknown',
      event_data: log.args ?? {},
      processed: false,
    });

    // unique_violation (23505) just means we've already seen this exact log — that's fine.
    if (insertError && insertError.code !== '23505') {
      this.logger.error(`Failed to persist blockchain event: ${insertError.message}`);
      throw insertError;
    }

    if (!log.eventName) {
      this.logger.warn(`Log without a decoded eventName at tx=${log.transactionHash}; skipping dispatch.`);
      return;
    }

    switch (log.eventName) {
      case 'OrderCreated':
        return this.onOrderCreated(log);
      case 'OrderFunded':
        return this.onOrderFunded(log);
      case 'OrderShipped':
        return this.onOrderShipped(log);
      case 'DeliveryConfirmed':
        return this.onDeliveryConfirmed(log);
      case 'OrderRefunded':
        return this.onOrderRefunded(log);
      case 'DisputeOpened':
        return this.onDisputeOpened(log);
      case 'DisputeResolved':
        return this.onDisputeResolved(log);
      default:
        this.logger.debug(`Unhandled event ${log.eventName}; recorded but not dispatched.`);
    }
  }

  // --- TODO: implement each handler once the real ABI/event shape is confirmed. ---
  // Each of these should look up the order by `blockchain_order_id`, validate the
  // event args against what we expect (buyer/seller/amount/contract), and only
  // then transition `orders.status` / `escrows.status` via OrderStateService.

  private async onOrderCreated(_log: Log & { args?: Record<string, unknown> }) {
    this.logger.debug('TODO: handle OrderCreated once ABI is confirmed');
  }

  private async onOrderFunded(_log: Log & { args?: Record<string, unknown> }) {
    this.logger.debug('TODO: handle OrderFunded once ABI is confirmed');
  }

  private async onOrderShipped(_log: Log & { args?: Record<string, unknown> }) {
    this.logger.debug('TODO: handle OrderShipped once ABI is confirmed');
  }

  private async onDeliveryConfirmed(_log: Log & { args?: Record<string, unknown> }) {
    this.logger.debug('TODO: handle DeliveryConfirmed once ABI is confirmed');
  }

  private async onOrderRefunded(_log: Log & { args?: Record<string, unknown> }) {
    this.logger.debug('TODO: handle OrderRefunded once ABI is confirmed');
  }

  private async onDisputeOpened(_log: Log & { args?: Record<string, unknown> }) {
    this.logger.debug('TODO: handle DisputeOpened once ABI is confirmed');
  }

  private async onDisputeResolved(_log: Log & { args?: Record<string, unknown> }) {
    this.logger.debug('TODO: handle DisputeResolved once ABI is confirmed');
  }
}
