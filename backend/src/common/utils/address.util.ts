import { getAddress, isAddress } from 'viem';

/** Lowercased address, for storage/comparison. Throws if invalid. */
export function normalizeAddress(address: string): string {
  if (!isAddress(address)) {
    throw new Error(`Invalid EVM address: ${address}`);
  }
  return address.toLowerCase();
}

/** Checksummed address, for display purposes. Throws if invalid. */
export function checksumAddress(address: string): string {
  return getAddress(address);
}

export function isValidAddress(address: string): boolean {
  return isAddress(address);
}
