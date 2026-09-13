# abi/HonraEscrow.json

This file is currently an empty array on purpose.

The explorer link originally provided for
`0x79023f8a49A6b2Af31cF35142127a6e19023F21d` resolves to a **different**
contract ("Stub Token (goerli)"), so no ABI has been inferred or guessed.

To activate on-chain writes/decoding:

1. Get the verified source or ABI JSON for the actual deployed
   `HonraEscrow` contract on HSK Chain Testnet (chainId 133).
2. Replace this file's contents with the real ABI array.
3. Update `src/escrow/escrow.contract.ts` to import it instead of the
   empty placeholder.
4. Implement `EscrowService.readOrderOnChain` and
   `EscrowService.buildAdminResolveDisputeTx` in
   `src/escrow/escrow.service.ts` using the real function names/args.
5. Update the event handlers in
   `src/blockchain/indexer/event-processor.service.ts` to match the real
   event names and argument names/order.
6. Update `src/blockchain/indexer/indexer.service.ts` to decode logs with
   the ABI (e.g. via `publicClient.getContractEvents`) instead of passing
   raw, undecoded logs through.
