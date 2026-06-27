import { VendorRow } from "@/types/vendor";
import { getSupabaseClient } from "../supabase/client";

type SubaccountDetails = {
  bankCode: string;
  subaccountCode: string;
};

type VerificationType =
  | { success: true; data: SubaccountDetails }
  | { success: false; error: string };
export const createSubaccount = async (
  vendorData: VendorRow,
  bankCode: string,
  accountName: string,
): Promise<VerificationType> => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.functions.invoke(
      "create-subaccount",
      {
        body: {
          vendorData,
          bankCode,
          accountName,
        },
      },
    );

    if (error) return { success: false, error: error.message };

    return {
      success: true,
      data: {
        subaccountCode: data.subaccountCode,
        bankCode: data.bankCode,
      },
    };
  } catch (error) {
    console.error("Exception:", error);
    const message =
      error instanceof Error ? error.message : "Verification failed";
    return { success: false, error: message };
  }
};
