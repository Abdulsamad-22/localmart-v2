import { getSupabaseClient } from "../supabase/client";
import { uploadProductImage } from "./uploadProductImage";
import { deleteProductImage } from "./deleteProductImage";
import type { ProductFormData } from "@/src/components/shop/AddProductProvider";

type EditProductResult = { success: true } | { success: false; error: string };

export async function editProduct(
  productId: string,
  data: ProductFormData,
  newImage: File | null,
  existingImageUrl: string,
): Promise<EditProductResult> {
  const supabase = getSupabaseClient();

  let imageUrl = existingImageUrl;

  // handle image replacement
  if (newImage) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Session expired." };

    // upload new image
    const uploadResult = await uploadProductImage(newImage, user.id);
    imageUrl = uploadResult.url;

    // delete old image from storage
    // extract path from existing URL
    const oldPath = existingImageUrl.split("/product-images/")[1];
    if (oldPath) {
      await deleteProductImage(oldPath);
    }
  }

  const { error } = await supabase
    .from("products")
    .update({
      item_name: data.productName,
      item_description: data.description,
      item_price: Number(data.price.replace(/,/g, "")),
      item_category: data.category,
      item_units: Number(data.units),
      item_sizes: data.item_sizes ?? [],
      item_colors: data.item_colors ?? [],
      image_url: imageUrl,
    })
    .eq("id", productId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
