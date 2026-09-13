import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlockchainTransactionService } from '../blockchain/transaction.service';

/**
 * Read-side helpers for the escrow contract that don't require the ABI
 * (chain id checks, receipt confirmation, address bookkeeping). Anything
 * that needs to call or decode HonraEscrow itself is stubbed and throws
 * until `abi/HonraEscrow.json` is provided — see escrow.contract.ts.
 */
@Injectable()
export class EscrowService {
  private readonly logger = new Logger(EscrowService.name);
  readonly contractAddress: string;

  constructor(
    private readonly config: ConfigService,
    private readonly txService: BlockchainTransactionService,
  ) {
    this.contractAddress = this.config.get<string>('app.honraEscrowAddress', '');
  }

  /**
   * Confirms a transaction actually landed successfully on-chain before the
   * backend trusts anything the frontend reported about it. This part does
   * NOT need the ABI.
   */
  async confirmTransactionSucceeded(txHash: `0x${string}`) {
    await this.txService.assertChainId();
    const receipt = await this.txService.getConfirmedReceipt(txHash);
    if (receipt.status !== 'success') {
      throw new Error(`Transaction ${txHash} did not succeed (status=${receipt.status})`);
    }
    return receipt;
  }

  /**
   * Convert a decimal USDC amount (e.g. 320.5) into the 6-decimal integer
   * representation used on-chain, as a string to avoid float precision loss.
   */
  toUsdcUnits(amountDecimal: number): bigint {
    return BigInt(Math.round(amountDecimal * 1_000_000));
  }

  fromUsdcUnits(units: bigint): number {
    return Number(units) / 1_000_000;
  }

  // --- The following require the confirmed ABI. They are deliberately
  // unimplemented so they fail loudly instead of guessing a function
  // signature. Fill these in once abi/HonraEscrow.json is in place. ---

  async readOrderOnChain(_blockchainOrderId: bigint): Promise<never> {
    throw new Error(
      'EscrowService.readOrderOnChain: not implemented — provide abi/HonraEscrow.json first.',
    );
  }

  async buildAdminResolveDisputeTx(_blockchainOrderId: bigint, _releaseToSeller: boolean): Promise<never> {
    throw new Error(
      'EscrowService.buildAdminResolveDisputeTx: not implemented — provide abi/HonraEscrow.json first.',
    );
  }
}
