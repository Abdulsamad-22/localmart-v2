import type { VendorRow } from "@/types/vendor";
import { getSupabaseClient } from "../supabase/client";

type GetVendorsResult =
  | { success: true; data: VendorRow[] }
  | { success: false; error: string };
export async function getVendors(): Promise<GetVendorsResult> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.from("vendors").select("*");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as VendorRow[] };
}
