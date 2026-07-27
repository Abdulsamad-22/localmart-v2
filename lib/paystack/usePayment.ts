"use client";

import { useCallback } from "react";
import type { PaystackSDKConfig } from "@paystack/inline-js";

type SubaccountSplit = {
  subaccount: string;
  share: number;
};

type SplitConfig = {
  type: "flat" | "percentage";
  bearer_type: "account" | "all-proportional" | "all" | "subaccount";
  subaccounts: SubaccountSplit[];
};

type PaystackHookConfig = {
  publicKey: string;
  email: string;
  amount: number;
  reference: string;
  subaccount?: string;
  split?: SplitConfig;
  metadata?: Record<string, unknown>;
};

type PaystackTransaction = {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
};

type PaymentResult = { success: true } | { success: false; error: string };

export const usePaystackPayment = () => {
  const initializePayment = useCallback(
    async (
      config: PaystackHookConfig,
      onSuccess: (transaction: PaystackTransaction) => void,
      onClose: () => void,
    ): Promise<PaymentResult> => {
      try {
        const { default: Paystack } = await import("@paystack/inline-js");

        // validate required fields
        if (!config.publicKey || !config.publicKey.startsWith("pk_")) {
          return { success: false, error: "Invalid Paystack public key" };
        }
        if (!config.email) {
          return { success: false, error: "Email is required" };
        }
        if (!config.amount || config.amount <= 0) {
          return { success: false, error: "Invalid amount" };
        }
        if (!config.reference) {
          return { success: false, error: "Payment reference is required" };
        }

        const transactionConfig: PaystackSDKConfig = {
          key: config.publicKey, // ← map publicKey → key here
          email: config.email,
          amount: config.amount,
          reference: config.reference,
          onSuccess,
          onClose,
        };

        if (config.subaccount) {
          transactionConfig.subaccount = config.subaccount;
        }

        if (config.split?.subaccounts?.length) {
          const validSubaccounts = config.split.subaccounts.filter(
            (sub) => sub.subaccount && sub.share > 0,
          );
          if (validSubaccounts.length > 0) {
            transactionConfig.split = {
              type: config.split.type ?? "flat",
              bearer_type: config.split.bearer_type ?? "all-proportional",
              subaccounts: validSubaccounts.map((sub) => ({
                subaccount: sub.subaccount,
                share: Math.round(sub.share),
              })),
            };
          }
        }

        if (config.metadata) {
          transactionConfig.metadata = config.metadata;
        }

        const paystack = new Paystack();
        paystack.newTransaction(transactionConfig);

        return { success: true };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Payment initialization failed";
        console.error("Paystack error:", error);
        return { success: false, error: message };
      }
    },
    [],
  );
  return initializePayment;
};
