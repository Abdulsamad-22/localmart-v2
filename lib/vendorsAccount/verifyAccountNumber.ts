import { getSupabaseClient } from "../supabase/client";
type AccountDetails = {
  accountName: string;
  accountNumber: string;
};
type VerificationType =
  | { success: true; data: AccountDetails }
  | { success: false; error: string };

export const verifyAccountNumber = async (
  accountNumber: string,
  bankCode: string,
): Promise<VerificationType> => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.functions.invoke("verify-account", {
      body: { accountNumber, bankCode },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: {
        accountName: data.accountName,
        accountNumber: data.accountNumber,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Verification failed";
    return { success: false, error: message };
  }
};
