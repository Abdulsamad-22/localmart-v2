import { getSupabaseClient } from "../supabase/client";
import { uploadProductImage } from "./uploadProductImage";
import { deleteProductImage } from "./deleteProductImage";
import type { ProductFormData } from "@/src/components/shop/AddProductProvider";
import type { ProductRow } from "@/types/product";

export async function createProduct(
  product: ProductFormData,
  image: File,
  vendorId: string,
): Promise<ProductRow> {
  const supabase = getSupabaseClient();
  let uploadedPath: string | null = null;

  try {
    const { url, path } = await uploadProductImage(image, vendorId);
    uploadedPath = path;

    const { data, error } = await supabase
      .from("products")
      .insert({
        item_name: product.productName,
        item_category: product.category,
        item_description: product.description,
        item_price: Number(product.price),
        item_units: Number(product.units),
        item_colors: product.item_colors ?? [],
        item_sizes: product.item_sizes ?? [],
        image_url: url,
        vendor_id: vendorId,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data as ProductRow;
  } catch (error) {
    // rollback — delete uploaded image if insert failed
    if (uploadedPath) {
      const deleteResult = await deleteProductImage(uploadedPath);
      if (!deleteResult.success) {
        // store orphaned path for manual cleanup
        await supabase.from("orphaned_images").insert([
          {
            path: uploadedPath,
            reason: deleteResult.error,
          },
        ]);
      }
    }
    throw error;
  }
}
