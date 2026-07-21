import { getSupabaseClient } from "../supabase/client";

type DeleteImageResult = { success: true } | { success: false; error: string };

export async function deleteProductImage(
  path: string,
): Promise<DeleteImageResult> {
  if (!path) {
    return { success: false, error: "No image path provided" };
  }

  const supabase = getSupabaseClient();

  const { error } = await supabase.storage
    .from("product-images")
    .remove([path]);

  if (error) {
    console.error("Failed to delete product image:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
