import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { normalizeAddress } from '../common/utils/address.util';

interface NonceEntry {
  nonce: string;
  expiresAt: number;
}

/**
 * In-memory nonce store, keyed by lowercased wallet address.
 *
 * This is fine for a single-instance MVP. As soon as you run more than
 * one backend instance, move this to Redis (a `nonce:<address>` key with
 * TTL = AUTH_NONCE_TTL_SECONDS) so nonces are shared across instances.
 */
@Injectable()
export class NonceService {
  private readonly store = new Map<string, NonceEntry>();
  private readonly ttlSeconds: number;

  constructor(private readonly config: ConfigService) {
    this.ttlSeconds = this.config.get<number>('app.authNonceTtlSeconds', 300);
  }

  generate(address: string): string {
    const key = normalizeAddress(address);
    const nonce = randomBytes(16).toString('hex');
    this.store.set(key, { nonce, expiresAt: Date.now() + this.ttlSeconds * 1000 });
    return nonce;
  }

  buildMessage(address: string, nonce: string): string {
    return [
      'Welcome to Honra.',
      '',
      `Wallet: ${address}`,
      `Nonce: ${nonce}`,
      '',
      'Sign this message to authenticate with Honra.',
      'This signature does not authorize blockchain transactions.',
    ].join('\n');
  }

  /** Returns the expected signed message, or null if no valid nonce exists. */
  consumeExpectedMessage(address: string): string | null {
    const key = normalizeAddress(address);
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }
    // one-time use
    this.store.delete(key);
    return this.buildMessage(address, entry.nonce);
  }
}
