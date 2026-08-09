import { getSupabaseClient } from "../supabase/client";

type SubaccountInput = {
  businessName: string;
  settlementBank: string;
  accountNumber: string;
  percentageCharge: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  accountName: string;
  vendorId: string;
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
          vendorData: {
            business_name: input.businessName,
            account_number: input.accountNumber,
            email: input.email,
            full_name: input.fullName,
            phone_number: input.phoneNumber,
            vendor_id: input.vendorId,
          },
          bankCode: input.settlementBank,
          accountName: input.accountName,
        },
      },
    );

    if (!data?.subaccount_code) {
      return { success: false, error: "Subaccount code not returned" };
    }
    console.log("edge function response:", data, error);
    return { success: true, subaccountCode: data.subaccountCode };
  } catch (error) {
    console.error("Exception:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create subaccount";
    return { success: false, error: message };
  }
};
