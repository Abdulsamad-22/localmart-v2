import { getSupabaseClient } from "../supabase/client";

type BankCode =
  | { satus: true; data: string }
  | { status: false; error: string };

export const getBankCode = async (bankName: string): Promise<string | null> => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.functions.invoke("get-bank-code", {
      body: { bankName },
    });

    if (error) {
      console.error("Error getting bank code:", error);
      return null;
    }

    return data.bankCode;
  } catch (error) {
    console.error("Exception:", error);
    return null;
  }
};
