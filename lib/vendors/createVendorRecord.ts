import { object, string, InferType } from "yup";
import { getSupabaseClient } from "../supabase/client";
import { createSubaccount } from "../vendorsAccount/createSubaccount";
import { geocodeAddress } from "../mapbox/geoCodeAddress";
import { getBankCode } from "../vendorsAccount/getBankCode";
import { verifyAccountNumber } from "../vendorsAccount/verifyAccountNumber";
import type { VendorInsert } from "@/types/vendor";

export const vendorSchema = object({
  fullName: string().required("Full name is required"),
  email: string().email("Invalid email").required("Email is required"),
  phoneNumber: string().required("Phone number is required"),
  businessName: string().required("Business name is required"),
  storeType: string().required("Store type is required"),
  businessAddress: string().required("Business address is required"),
  businessType: string().required("Select your type of business"),
  productCategory: string().required("Product category is required"),
  socials: string().required("A link to any business socials is required"),
  bankName: string().required("Bank name is required"),
  accountNumber: string()
    .matches(/^[0-9]{10}$/, "Account number must be 10 digits")
    .required("Account number is required"),
  returnPolicy: string().required("A return policy deadline is required"),
  deliveryDuration: string().required("Delivery duration is required"),
});

export type VendorFormData = InferType<typeof vendorSchema>;

type CreateVendorResult = { success: true } | { success: false; error: string };

export async function createVendorRecord(
  formData: VendorFormData,
): Promise<CreateVendorResult> {
  try {
    const supabase = getSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (!user || authError) {
      return { success: false, error: "Session expired. Please log in again." };
    }

    // geocode address — non-blocking
    const geoCodeVendorAddress = await geocodeAddress(formData.businessAddress);

    // get bank code
    const bankCodeResult = await getBankCode(formData.bankName);
    if (!bankCodeResult.success) {
      return { success: false, error: bankCodeResult.error };
    }

    // verify account number
    const verificationResult = await verifyAccountNumber(
      formData.accountNumber,
      bankCodeResult.bankCode,
    );
    if (!verificationResult.success) {
      return { success: false, error: verificationResult.error };
    }

    // Insert vendor first, subaccount_code is null for now
    const vendorData: VendorInsert = {
      vendor_id: user.id,
      full_name: formData.fullName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      business_name: formData.businessName,
      store_type: formData.storeType,
      business_address: formData.businessAddress,
      latitude: geoCodeVendorAddress?.lat ?? null,
      longitude: geoCodeVendorAddress?.lng ?? null,
      product_category: formData.productCategory,
      socials: formData.socials ?? null,
      bank_name: formData.bankName,
      bank_code: bankCodeResult.bankCode,
      account_number: verificationResult.data.accountNumber,
      account_name: verificationResult.data.accountName,
      return_policy: formData.returnPolicy,
      delivery_duration: formData.deliveryDuration,
      subaccount_code: null, // will be updated after
      subaccount_pending: true, // signals setup is incomplete
      updated_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase
      .from("vendors")
      .insert([vendorData]);

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    // Attempt subaccount creation after vendor exists
    const subaccountResult = await createSubaccount({
      businessName: formData.businessName,
      settlementBank: bankCodeResult.bankCode,
      accountNumber: formData.accountNumber,
      percentageCharge: 10,
    });

    if (subaccountResult.success) {
      // update vendor with subaccount code
      const { error: updateError } = await supabase
        .from("vendors")
        .update({
          subaccount_code: subaccountResult.subaccountCode,
          subaccount_pending: false,
          updated_at: new Date().toISOString(),
        })
        .eq("vendor_id", user.id);

      if (updateError) {
        // vendor is registered but subaccount update failed
        // log for manual resolution — vendor can still browse dashboard
        console.error("Subaccount update failed:", updateError.message);
      }
    }

    // registration succeeds regardless of subaccount outcome
    // subaccount_pending flag handles the incomplete state
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create vendor account";
    return { success: false, error: message };
  }
}
