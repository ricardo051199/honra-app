import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { OrdersService } from '../orders/orders.service.js';
import { OrderStateService } from '../orders/order-state.service.js';
import { EscrowService } from '../escrow/escrow.service.js';
import { CreateDisputeDto } from './dto/create-dispute.dto.js';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto.js';

@Injectable()
export class DisputesService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly orders: OrdersService,
    private readonly orderState: OrderStateService,
    private readonly escrow: EscrowService,
  ) {}

  private get db() {
    return this.supabase.getClient();
  }

  async listForUser(userId: string, role: string) {
    let query = this.db.from('disputes').select('*, orders!inner(buyer_id, seller_id)');

    if (role !== 'admin') {
      query = query.or(`orders.buyer_id.eq.${userId},orders.seller_id.eq.${userId}`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async findById(id: string, userId: string, role: string) {
    const { data, error } = await this.db.from('disputes').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) throw new NotFoundException('Dispute not found');

    if (role !== 'admin') {
      const order = await this.orders.getOrderOrThrow(data.order_id);
      if (order.buyer_id !== userId && order.seller_id !== userId) {
        throw new ForbiddenException('You do not have access to this dispute.');
      }
    }
    return data;
  }

  async open(orderId: string, requesterId: string, dto: CreateDisputeDto) {
    const order = await this.orders.getOrderOrThrow(orderId);
    if (order.buyer_id !== requesterId && order.seller_id !== requesterId) {
      throw new ForbiddenException('Only the buyer or seller can open a dispute for this order.');
    }

    const nextStatus = this.orderState.assertTransition(order.status, 'open_dispute');

    const { data: dispute, error } = await this.db
      .from('disputes')
      .insert({
        order_id: orderId,
        opened_by: requesterId,
        reason: dto.reason,
        description: dto.description,
        status: 'open',
      })
      .select('*')
      .single();
    if (error) throw error;

    await this.addEvent(dispute.id, 'dispute_opened', 'Dispute opened', requesterId);

    await this.orders.updateOrder(orderId, {
      status: nextStatus,
      disputed_tx_hash: null,
    });

    return dispute;
  }

  async review(disputeId: string, adminId: string) {
    const dispute = await this.getOrThrow(disputeId);
    if (dispute.status !== 'open') {
      throw new BadRequestException(`Dispute is not open (status=${dispute.status}).`);
    }

    const { data, error } = await this.db
      .from('disputes')
      .update({ status: 'under_review', updated_at: new Date().toISOString() })
      .eq('id', disputeId)
      .select('*')
      .single();
    if (error) throw error;

    await this.addEvent(disputeId, 'under_review', 'Dispute moved to review', adminId);
    return data;
  }

  async resolveRefund(disputeId: string, adminId: string, dto: ResolveDisputeDto) {
    return this.resolve(disputeId, adminId, 'refunded', dto);
  }

  async resolveRelease(disputeId: string, adminId: string, dto: ResolveDisputeDto) {
    return this.resolve(disputeId, adminId, 'released_to_seller', dto);
  }

  private async resolve(
    disputeId: string,
    adminId: string,
    resolution: 'refunded' | 'released_to_seller',
    dto: ResolveDisputeDto,
  ) {
    const dispute = await this.getOrThrow(disputeId);
    if (dispute.status === 'resolved') {
      throw new BadRequestException('Dispute is already resolved.');
    }

    const order = await this.orders.getOrderOrThrow(dispute.order_id);
    const releaseToSeller = resolution === 'released_to_seller';

    // This is the step that actually needs the confirmed contract ABI: an
    // admin-only call on HonraEscrow to release or refund the locked funds.
    // It intentionally throws until abi/HonraEscrow.json is wired in, so we
    // never mark a dispute "resolved" in the DB without the on-chain action
    // having actually happened.
    try {
      await this.escrow.buildAdminResolveDisputeTx(BigInt(order.blockchain_order_id ?? 0), releaseToSeller);
    } catch (err) {
      throw new BadRequestException(
        `Cannot resolve on-chain yet: ${(err as Error).message} ` +
          'Once the contract call succeeds, this endpoint will confirm the receipt and update the DB.',
      );
    }

    const orderTransition = releaseToSeller ? 'resolve_release' : 'resolve_refund';
    const nextOrderStatus = this.orderState.assertTransition(order.status, orderTransition);

    const { data, error } = await this.db
      .from('disputes')
      .update({
        status: 'resolved',
        resolution,
        updated_at: new Date().toISOString(),
      })
      .eq('id', disputeId)
      .select('*')
      .single();
    if (error) throw error;

    await this.addEvent(disputeId, 'resolved', `Dispute resolved: ${resolution}${dto.notes ? ` — ${dto.notes}` : ''}`, adminId);
    await this.orders.updateOrder(order.id, { status: nextOrderStatus });

    return data;
  }

  private async addEvent(disputeId: string, type: string, label: string, actorId: string, txHash?: string) {
    const { error } = await this.db.from('dispute_events').insert({
      dispute_id: disputeId,
      type,
      label,
      actor_id: actorId,
      tx_hash: txHash ?? null,
    });
    if (error) throw error;
  }

  private async getOrThrow(id: string) {
    const { data, error } = await this.db.from('disputes').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) throw new NotFoundException('Dispute not found');
    return data;
  }
}
