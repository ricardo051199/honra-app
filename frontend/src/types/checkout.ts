export type StepStatus =
  | "idle"
  | "pending"
  | "waiting_wallet"
  | "confirmed"
  | "failed";

export type StepId = "connect_wallet" | "approve_usdc" | "fund_escrow";

export interface CheckoutStep {
  id: StepId;
  label: string;
  status: StepStatus;
  txHash?: string;
  errorMessage?: string;
}

export type GlobalErrorType =
  | "network_error"
  | "insufficient_usdc"
  | "insufficient_gas"
  | "wallet_rejected"
  | "unknown";

export interface GlobalError {
  type: GlobalErrorType;
  message: string;
}

export interface CheckoutState {
  steps: CheckoutStep[];
  currentStepIndex: number;
  globalError: GlobalError | null;
  isComplete: boolean;
  walletAddress: string | null;
  walletConnected: boolean;
}

export interface CheckoutProduct {
  id: string;
  title: string;
  imageUrl: string;
  priceUsdc: number;
  seller: string;
  escrowContract: string;
  sellerAddress: string;
}
