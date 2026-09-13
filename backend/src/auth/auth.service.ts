import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyMessage } from 'viem';
import { SupabaseService } from '../supabase/supabase.service';
import { NonceService } from './nonce.service';
import { normalizeAddress } from '../common/utils/address.util';

export interface AuthTokenPayload {
  sub: string; // user id
  address: string; // normalized wallet address
  role: 'buyer' | 'seller' | 'admin';
}

@Injectable()
export class AuthService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly nonceService: NonceService,
    private readonly jwt: JwtService,
  ) {}

  requestNonce(address: string): { nonce: string; message: string } {
    const nonce = this.nonceService.generate(address);
    const message = this.nonceService.buildMessage(address, nonce);
    return { nonce, message };
  }

  async verifyAndIssueToken(address: string, signature: string) {
    const expectedMessage = this.nonceService.consumeExpectedMessage(address);
    if (!expectedMessage) {
      throw new UnauthorizedException('Nonce expired or not found. Request a new one.');
    }

    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message: expectedMessage,
      signature: signature as `0x${string}`,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid signature.');
    }

    const normalized = normalizeAddress(address);
    const user = await this.findOrCreateUser(normalized);

    const payload: AuthTokenPayload = {
      sub: user.id,
      address: normalized,
      role: user.role,
    };

    return {
      accessToken: this.jwt.sign(payload),
      user,
    };
  }

  private async findOrCreateUser(walletAddress: string) {
    const client = this.supabase.getClient();

    const { data: existing, error: findError } = await client
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .maybeSingle();

    if (findError) throw findError;
    if (existing) return existing;

    const { data: created, error: createError } = await client
      .from('users')
      .insert({ wallet_address: walletAddress, role: 'buyer' })
      .select('*')
      .single();

    if (createError) throw createError;
    return created;
  }

  async me(userId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client.from('users').select('*').eq('id', userId).single();
    if (error) throw error;
    return data;
  }
}
