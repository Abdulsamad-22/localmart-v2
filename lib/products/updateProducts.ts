import { getSupabaseClient } from "../supabase/client";

type UpdateProductResult =
  | { success: true }
  | { success: false; error: string };

export async function updateProductField(
  productId: string,
  field: "item_price" | "item_units" | "is_active",
  value: number | boolean,
): Promise<UpdateProductResult> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("products")
    .update({ [field]: value })
    .eq("id", productId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
