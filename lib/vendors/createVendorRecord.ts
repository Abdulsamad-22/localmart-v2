import { getSupabaseClient } from "../supabase/client";
import { createSubaccount } from "../vendorsAccount/createSubaccount";
import { geocodeAddress } from "../mapbox/geoCodeAddress";
import { getBankCode } from "../vendorsAccount/getBankCode";
import { verifyAccountNumber } from "../vendorsAccount/verifyAccountNumber";
import type { VendorInsert, VendorFormData } from "@/types/vendor";

type CreateVendorResult = { success: true } | { success: false; error: string };

export async function createVendorRecord(
  formData: VendorFormData,
  logoUrl: string | null = null,
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
    // create subaccount first
    const subaccountResult = await createSubaccount({
      businessName: formData.businessName,
      settlementBank: bankCodeResult.bankCode,
      accountNumber: formData.accountNumber,
      percentageCharge: 10,
      email: formData.email,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      accountName: verificationResult.data.accountName,
      vendorId: user.id,
    });

    // add subaccount result to vendorData before insert
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
      logo_url: logoUrl,
      socials: {
        instagram: formData.socials?.instagram || undefined,
        twitter: formData.socials?.twitter || undefined,
        tiktok: formData.socials?.tiktok || undefined,
        facebook: formData.socials?.facebook || undefined,
        website: formData.socials?.website || undefined,
      },
      agreed_to_platform_fee: true,
      bank_name: formData.bankName,
      bank_code: bankCodeResult.bankCode,
      account_number: verificationResult.data.accountNumber,
      account_name: verificationResult.data.accountName,
      return_policy: formData.returnPolicy,
      delivery_duration: formData.deliveryDuration,
      subaccount_code: subaccountResult.success
        ? subaccountResult.subaccountCode
        : null,
      subaccount_pending: !subaccountResult.success,
      updated_at: new Date().toISOString(),
    };

    // single insert — everything in one operation
    const { error: insertError } = await supabase
      .from("vendors")
      .insert([vendorData]);

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create vendor account";
    return { success: false, error: message };
  }
}
