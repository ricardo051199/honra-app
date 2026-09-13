import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../../supabase/supabase.service.js';

/**
 * Persists the last block the indexer has fully processed, so a restart
 * resumes instead of re-scanning from genesis (or worse, from `latest`).
 * Backed by the `indexer_cursors` table (see supabase/migrations/008).
 */
@Injectable()
export class BlockCursorService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly config: ConfigService,
  ) {}

  async getLastProcessedBlock(contractAddress: string): Promise<bigint> {
    const { data, error } = await this.supabase
      .getClient()
      .from('indexer_cursors')
      .select('last_block')
      .eq('contract_address', contractAddress.toLowerCase())
      .maybeSingle();

    if (error) throw error;
    if (data) return BigInt(data.last_block);

    return this.config.get<bigint>('app.indexerStartBlock', 0n);
  }

  async setLastProcessedBlock(contractAddress: string, block: bigint): Promise<void> {
    const { error } = await this.supabase.getClient().from('indexer_cursors').upsert(
      {
        contract_address: contractAddress.toLowerCase(),
        last_block: block.toString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'contract_address' },
    );
    if (error) throw error;
  }
}
