import { useState, useCallback } from "react";
import { blockchainService } from "../services/blockchainService";
import { usdcService } from "../services/usdcService";
import { escrowService } from "../services/escrowService";
import type {
  CheckoutState,
  CheckoutStep,
  GlobalError,
  CheckoutProduct,
  StepId,
  StepStatus,
} from "../types/checkout";

const INITIAL_STEPS: CheckoutStep[] = [
  { id: "connect_wallet", label: "Conectar billetera", status: "idle" },
  { id: "approve_usdc", label: "Aprobar USDC", status: "idle" },
  { id: "fund_escrow", label: "Bloquear en escrow", status: "idle" },
];

function buildInitialState(walletConnected: boolean, walletAddress: string | null): CheckoutState {
  const steps = INITIAL_STEPS.map((s) => ({ ...s }));
  if (walletConnected && walletAddress) {
    steps[0].status = "confirmed";
  }
  return {
    steps,
    currentStepIndex: walletConnected ? 1 : 0,
    globalError: null,
    isComplete: false,
    walletAddress,
    walletConnected,
  };
}

export function useCheckout(
  product: CheckoutProduct,
  initialWalletConnected: boolean,
  initialWalletAddress: string | null,
  onWalletConnected: (address: string) => void
) {
  const [state, setState] = useState<CheckoutState>(() =>
    buildInitialState(initialWalletConnected, initialWalletAddress)
  );

  const updateStep = useCallback(
    (id: StepId, patch: Partial<CheckoutStep>) => {
      setState((prev) => ({
        ...prev,
        steps: prev.steps.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      }));
    },
    []
  );

  const setCurrentIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, currentStepIndex: index }));
  }, []);

  const setGlobalError = useCallback((error: GlobalError | null) => {
    setState((prev) => ({ ...prev, globalError: error }));
  }, []);

  const setStatus = useCallback(
    (id: StepId, status: StepStatus, extra?: Partial<CheckoutStep>) => {
      updateStep(id, { status, ...extra });
    },
    [updateStep]
  );

  // ── Step 1: Connect wallet ──────────────────────────────────────────────
  const connectWallet = useCallback(async () => {
    setGlobalError(null);
    setStatus("connect_wallet", "waiting_wallet");
    try {
      const wallet = await blockchainService.connectWallet();
      const onCorrectNetwork = await blockchainService.verifyNetwork(wallet.chainId);
      if (!onCorrectNetwork) {
        setStatus("connect_wallet", "failed", {
          errorMessage: "Please switch your wallet to HSK Chain (ID 177).",
        });
        setGlobalError({ type: "network_error", message: "Wrong network. Switch to HSK Chain." });
        return;
      }
      setStatus("connect_wallet", "confirmed");
      setState((prev) => ({
        ...prev,
        walletConnected: true,
        walletAddress: wallet.address,
        currentStepIndex: 1,
      }));
      onWalletConnected(wallet.address);
    } catch {
      setStatus("connect_wallet", "failed", {
        errorMessage: "Wallet connection was rejected.",
      });
    }
  }, [setGlobalError, setStatus, onWalletConnected]);

  // ── Step 2: Approve USDC ───────────────────────────────────────────────
  const approveUsdc = useCallback(async () => {
    const address = state.walletAddress;
    if (!address) return;
    setGlobalError(null);
    setStatus("approve_usdc", "pending");

    try {
      const { sufficient, balance } = await usdcService.validateSufficientBalance(
        address,
        product.priceUsdc
      );
      if (!sufficient) {
        setStatus("approve_usdc", "failed", {
          errorMessage: `Insufficient USDC. You have ${balance.toLocaleString("en-US")} USDC, need ${product.priceUsdc.toLocaleString("en-US")} USDC.`,
        });
        setGlobalError({
          type: "insufficient_usdc",
          message: `You need ${product.priceUsdc.toLocaleString("en-US")} USDC but only have ${balance.toLocaleString("en-US")} USDC.`,
        });
        return;
      }

      setStatus("approve_usdc", "waiting_wallet");
      const result = await usdcService.approveSpend(
        address,
        product.escrowContract,
        product.priceUsdc
      );

      setStatus("approve_usdc", "pending");
      await blockchainService.waitForTransaction(result.txHash);

      setStatus("approve_usdc", "confirmed", { txHash: result.txHash });
      setCurrentIndex(2);
    } catch {
      setStatus("approve_usdc", "failed", {
        errorMessage: "Approval was rejected or the transaction failed.",
      });
    }
  }, [state.walletAddress, product, setGlobalError, setStatus, setCurrentIndex]);

  // ── Step 3: Fund escrow ────────────────────────────────────────────────
  const fundEscrow = useCallback(async () => {
    const address = state.walletAddress;
    if (!address) return;
    setGlobalError(null);
    setStatus("fund_escrow", "waiting_wallet");

    try {
      const result = await escrowService.fundEscrow({
        buyerAddress: address,
        sellerAddress: product.sellerAddress,
        escrowContract: product.escrowContract,
        amountUsdc: product.priceUsdc,
        productId: product.id,
      });

      setStatus("fund_escrow", "pending");
      await blockchainService.waitForTransaction(result.txHash);

      setStatus("fund_escrow", "confirmed", { txHash: result.txHash });
      setState((prev) => ({ ...prev, isComplete: true }));
    } catch {
      setStatus("fund_escrow", "failed", {
        errorMessage: "Transaction failed. Your USDC was not moved.",
      });
    }
  }, [state.walletAddress, product, setGlobalError, setStatus]);

  // ── Retry a failed step ────────────────────────────────────────────────
  const retryCurrentStep = useCallback(() => {
    const step = state.steps[state.currentStepIndex];
    if (!step || step.status !== "failed") return;
    updateStep(step.id, { status: "idle", errorMessage: undefined });
    setGlobalError(null);
  }, [state.steps, state.currentStepIndex, updateStep, setGlobalError]);

  // ── Primary action for the current step ───────────────────────────────
  const advance = useCallback(() => {
    const step = state.steps[state.currentStepIndex];
    if (!step) return;
    if (step.id === "connect_wallet") connectWallet();
    else if (step.id === "approve_usdc") approveUsdc();
    else if (step.id === "fund_escrow") fundEscrow();
  }, [state.steps, state.currentStepIndex, connectWallet, approveUsdc, fundEscrow]);

  const currentStep = state.steps[state.currentStepIndex] ?? null;
  const isAdvancing =
    currentStep?.status === "pending" ||
    currentStep?.status === "waiting_wallet";

  return { state, currentStep, isAdvancing, advance, retryCurrentStep };
}
