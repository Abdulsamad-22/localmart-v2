import { getSupabaseClient } from "../supabase/client";

type BankCodeResult =
  | { success: true; bankCode: string }
  | { success: false; error: string };

export const getBankCode = async (
  bankName: string,
): Promise<BankCodeResult> => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.functions.invoke("get-bank-code", {
      body: { bankName },
    });

    if (error) {
      console.error("Error getting bank code:", error);
      return { success: false, error: error.message };
    }

    if (!data?.bankCode) {
      return { success: false, error: "Bank code not found" };
    }

    return { success: true, bankCode: data.bankCode };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get bank code";
    return { success: false, error: message };
  }
};
