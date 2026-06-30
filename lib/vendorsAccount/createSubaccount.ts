import { VendorInsert } from "@/types/vendor";
import { getSupabaseClient } from "../supabase/client";

type SubaccountInput = {
  businessName: string;
  settlementBank: string;
  accountNumber: string;
  percentageCharge: number;
};

type SubaccountResult =
  | { success: true; subaccountCode: string }
  | { success: false; error: string };

export const createSubaccount = async (
  input: SubaccountInput,
): Promise<SubaccountResult> => {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.functions.invoke(
      "create-subaccount",
      {
        body: {
          business_name: input.businessName,
          settlement_bank: input.settlementBank,
          account_number: input.accountNumber,
          percentage_charge: input.percentageCharge,
        },
      },
    );

    if (!data?.subaccountCode) {
      return { success: false, error: "Subaccount code not returned" };
    }

    return { success: true, subaccountCode: data.subaccountCode };
  } catch (error) {
    console.error("Exception:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create subaccount";
    return { success: false, error: message };
  }
};
