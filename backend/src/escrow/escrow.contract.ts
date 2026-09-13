/**
 * ============================================================================
 *  PLACEHOLDER — DO NOT USE IN PRODUCTION AS-IS
 * ============================================================================
 * This file intentionally does NOT contain a guessed ABI for HonraEscrow.
 *
 * Why: the explorer link supplied for 0x79023f8a49A6b2Af31cF35142127a6e19023F21d
 * currently resolves to a different contract ("Stub Token (goerli)"), so we
 * cannot safely infer function signatures, parameter order, or event shapes.
 * Inventing them here would silently produce a backend that either reverts
 * every transaction or, worse, misreads events and updates order state
 * incorrectly.
 *
 * To finish this file:
 *   1. Get the verified source or ABI JSON for the deployed HonraEscrow
 *      contract and drop it at `abi/HonraEscrow.json`.
 *   2. Replace `honraEscrowAbi` below with `import honraEscrowAbi from
 *      '../../abi/HonraEscrow.json'`.
 *   3. Update the function names in `EscrowService` (escrow.service.ts) to
 *      match exactly — including argument order and units (USDC uses 6
 *      decimals; make sure amounts are converted correctly).
 *   4. Update `EventProcessorService` event handlers to match the real
 *      event names and argument names.
 * ============================================================================
 */
import type { Abi } from 'viem';

export const honraEscrowAbi: Abi = [];
