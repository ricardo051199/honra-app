/**
 * Event names the indexer dispatches on. Placeholder names inferred from
 * the frontend's order-status timeline — confirm against the real ABI
 * and update alongside EventProcessorService.
 */
export const EscrowEvents = {
  ORDER_CREATED: 'OrderCreated',
  ORDER_FUNDED: 'OrderFunded',
  ORDER_SHIPPED: 'OrderShipped',
  DELIVERY_CONFIRMED: 'DeliveryConfirmed',
  ORDER_REFUNDED: 'OrderRefunded',
  DISPUTE_OPENED: 'DisputeOpened',
  DISPUTE_RESOLVED: 'DisputeResolved',
} as const;

export type EscrowEventName = (typeof EscrowEvents)[keyof typeof EscrowEvents];
