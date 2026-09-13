import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service.js';
import { ProductsService } from '../products/products.service.js';
import { EscrowService } from '../escrow/escrow.service.js';
import { OrderStateService, OrderStatus } from './order-state.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { FundOrderDto } from './dto/fund-order.dto.js';
import { ShipOrderDto } from './dto/ship-order.dto.js';

@Injectable()
export class OrdersService {
  private readonly escrowAddress: string;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly products: ProductsService,
    private readonly escrow: EscrowService,
    private readonly state: OrderStateService,
    private readonly config: ConfigService,
  ) {
    this.escrowAddress = this.config.get<string>('app.honraEscrowAddress', '');
  }

  private get db() {
    return this.supabase.getClient();
  }

  async listForUser(userId: string) {
    const { data, error } = await this.db
      .from('orders')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async findById(id: string, userId: string) {
    const order = await this.getOrderOrThrow(id);
    if (order.buyer_id !== userId && order.seller_id !== userId) {
      throw new ForbiddenException('You do not have access to this order.');
    }
    return order;
  }

  async create(buyerId: string, buyerAddress: string, dto: CreateOrderDto) {
    const product = await this.products.findById(dto.productId);

    if (product.status !== 'active') {
      throw new BadRequestException('Product is not available.');
    }
    if (product.stock < 1) {
      throw new BadRequestException('Product is out of stock.');
    }
    if (product.seller_id === buyerId) {
      throw new BadRequestException('You cannot buy your own product.');
    }
    if (!this.escrowAddress) {
      throw new BadRequestException('Escrow contract is not configured on the backend.');
    }

    const seller = await this.getUser(product.seller_id);

    const orderNumber = this.generateOrderNumber();

    const { data, error } = await this.db
      .from('orders')
      .insert({
        order_number: orderNumber,
        buyer_id: buyerId,
        seller_id: product.seller_id,
        product_id: product.id,
        buyer_address: buyerAddress,
        seller_address: seller.wallet_address,
        amount_usdc: product.price_usdc,
        status: 'pending_payment' as OrderStatus,
        escrow_contract: this.escrowAddress,
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async fund(orderId: string, buyerId: string, dto: FundOrderDto) {
    const order = await this.getOrderOrThrow(orderId);
    if (order.buyer_id !== buyerId) {
      throw new ForbiddenException('Only the buyer can fund this order.');
    }

    const nextStatus = this.state.assertTransition(order.status, 'fund');

    // The backend never trusts a reported txHash blindly — confirm it on
    // chain first. Full validation of the event's buyer/seller/amount/order
    // fields against our own records happens in EventProcessorService once
    // the ABI is wired up; this call currently confirms the transaction
    // succeeded on-chain at all.
    await this.escrow.confirmTransactionSucceeded(dto.fundTxHash as `0x${string}`);

    await this.recordTransaction(order.id, null, dto.approvalTxHash, 'approve', order.buyer_address, this.escrowAddress);
    await this.recordTransaction(order.id, null, dto.fundTxHash, 'fund', order.buyer_address, this.escrowAddress, order.amount_usdc);

    return this.updateOrder(order.id, {
      status: nextStatus,
      funded_tx_hash: dto.fundTxHash,
    });
  }

  async ship(orderId: string, sellerId: string, dto: ShipOrderDto) {
    const order = await this.getOrderOrThrow(orderId);
    if (order.seller_id !== sellerId) {
      throw new ForbiddenException('Only the seller can mark this order as shipped.');
    }

    const nextStatus = this.state.assertTransition(order.status, 'ship');

    const { error } = await this.db.from('shipping').insert({
      order_id: order.id,
      carrier: dto.carrier,
      tracking_number: dto.trackingNumber,
      tracking_url: dto.trackingUrl ?? null,
    });
    if (error) throw error;

    return this.updateOrder(order.id, { status: nextStatus });
  }

  async confirmDelivery(orderId: string, buyerId: string) {
    const order = await this.getOrderOrThrow(orderId);
    if (order.buyer_id !== buyerId) {
      throw new ForbiddenException('Only the buyer can confirm delivery.');
    }

    const nextStatus = this.state.assertTransition(order.status, 'confirm_delivery');

    // NOTE: releasing funds to the seller happens on-chain via the buyer's
    // own wallet call to the escrow contract (see architecture notes) —
    // the backend records the resulting state once that tx is provided/
    // indexed. If your contract instead requires a backend-relayed call
    // for this step, wire it through EscrowService once the ABI is ready.
    return this.updateOrder(order.id, { status: nextStatus });
  }

  async requestRefund(orderId: string, requesterId: string) {
    // Placeholder for a direct (non-dispute) refund path if the contract
    // supports one, e.g. a cancellation before funding. Left minimal since
    // the primary refund path is via dispute resolution.
    const order = await this.getOrderOrThrow(orderId);
    if (order.buyer_id !== requesterId && order.seller_id !== requesterId) {
      throw new ForbiddenException('Not authorized for this order.');
    }
    throw new BadRequestException(
      'Direct refunds outside of the dispute flow are not implemented. Open a dispute instead.',
    );
  }

  async getOrderOrThrow(id: string) {
    const { data, error } = await this.db.from('orders').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) throw new NotFoundException('Order not found');
    return data;
  }

  async updateOrder(id: string, patch: Record<string, unknown>) {
    const { data, error } = await this.db
      .from('orders')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }

  private async recordTransaction(
    orderId: string,
    escrowId: string | null,
    txHash: string,
    type: string,
    fromAddress: string,
    toAddress: string,
    amountUsdc?: number,
  ) {
    const { error } = await this.db.from('transactions').insert({
      order_id: orderId,
      escrow_id: escrowId,
      tx_hash: txHash,
      type,
      from_address: fromAddress,
      to_address: toAddress,
      amount_usdc: amountUsdc ?? null,
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
    });
    // Ignore unique-violation (already recorded) — anything else, throw.
    if (error && error.code !== '23505') throw error;
  }

  private async getUser(id: string) {
    const { data, error } = await this.db.from('users').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  private generateOrderNumber(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const suffix = Math.floor(Math.random() * 9000 + 1000);
    return `HON-${date}-${suffix}`;
  }
}
