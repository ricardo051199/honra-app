import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { SupabaseService } from '../supabase/supabase.service';
import { BlockchainTransactionService } from '../blockchain/transaction.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly config: ConfigService,
    private readonly supabase: SupabaseService,
    private readonly blockchain: BlockchainTransactionService,
  ) {}

  @Get()
  async check() {
    const [database, chain] = await Promise.all([this.checkDatabase(), this.checkBlockchain()]);

    return {
      status: database.up && chain.up ? 'ok' : 'degraded',
      database: database.up ? 'up' : 'down',
      blockchain: chain.up ? 'up' : 'down',
      chainId: chain.chainId ?? null,
      contract: this.config.get<string>('app.honraEscrowAddress'),
    };
  }

  @Get('blockchain')
  async blockchainHealth() {
    return this.checkBlockchain();
  }

  @Get('database')
  async databaseHealth() {
    return this.checkDatabase();
  }

  private async checkDatabase() {
    try {
      const { error } = await this.supabase.getClient().from('users').select('id').limit(1);
      if (error) throw error;
      return { up: true };
    } catch (err) {
      return { up: false, error: (err as Error).message };
    }
  }

  private async checkBlockchain() {
    try {
      const chainId = await this.blockchain.getClient().getChainId();
      return { up: true, chainId };
    } catch (err) {
      return { up: false, error: (err as Error).message };
    }
  }
}
