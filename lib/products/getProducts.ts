import { ProductsWithVendor } from "@/types/product";
import { getSupabaseClient } from "../supabase/client";

type GetProductsResult =
  | { success: true; data: ProductsWithVendor[] }
  | { success: false; message: string };
export async function getProducts(): Promise<GetProductsResult> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.from("products").select(`
      *,
      vendor:vendors(
        id,
        business_name,
        business_address,
        latitude,
        longitude
      )
    `);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data: (data ?? []) as ProductsWithVendor[] };
}
