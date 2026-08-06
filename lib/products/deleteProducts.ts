import { getSupabaseClient } from "../supabase/client";

type DeleteResult = { success: true } | { success: false; error: string };

export async function deleteProduct(productId: string): Promise<DeleteResult> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) return { success: false, error: error.message };

  return { success: true };
}
