import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client!: SupabaseClient;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const url = this.config.get<string>('app.supabaseUrl');
    const key = this.config.get<string>('app.supabaseServiceRoleKey');

    if (!url || !key) {
      // eslint-disable-next-line no-console
      console.warn(
        '[SupabaseService] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set. ' +
          'Database calls will fail until these are configured in .env',
      );
    }

    this.client = createClient(url ?? '', key ?? '', {
      auth: { persistSession: false },
    });
  }

  /** Raw Supabase client. Use the service-role key server-side only. */
  getClient(): SupabaseClient {
    return this.client;
  }
}
