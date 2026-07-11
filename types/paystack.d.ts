declare module "@paystack/inline-js" {
  interface PaystackTransaction {
    reference: string;
    status: string;
    trans: string;
    transaction: string;
    trxref: string;
  }

  interface PaystackSDKConfig {
    key: string;
    email: string;
    amount: number;
    reference: string;
    onSuccess: (transaction: PaystackTransaction) => void;
    onClose: () => void;
    subaccount?: string;
    split?: {
      type: "flat" | "percentage";
      bearer_type: "account" | "all-proportional" | "all" | "subaccount";
      subaccounts: {
        subaccount: string;
        share: number;
      }[];
    };
    metadata?: Record<string, unknown>;
  }

  class Paystack {
    newTransaction(config: PaystackSDKConfig): void;
  }

  export default Paystack;
  export type { PaystackTransaction, PaystackSDKConfig };
}
