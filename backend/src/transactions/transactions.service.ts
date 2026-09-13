import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly supabase: SupabaseService) {}

  async listForOrder(orderId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('transactions')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  }

  async findByHash(hash: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('transactions')
      .select('*')
      .eq('tx_hash', hash)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new NotFoundException('Transaction not found');
    return data;
  }
}
