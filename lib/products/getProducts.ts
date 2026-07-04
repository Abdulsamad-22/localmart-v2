import { ProductRow } from "@/types/product";
import { getSupabaseClient } from "../supabase/client";

type GetProductsResult =
  | { success: true; data: ProductRow[] }
  | { success: false; message: string };
export async function getproducts(): Promise<GetProductsResult> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data: data as ProductRow[] };
}
