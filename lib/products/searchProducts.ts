import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ProductsWithVendor } from "@/types/product";

type SearchResult =
  | { success: true; data: ProductsWithVendor[] }
  | { success: false; error: string };

export async function searchProducts(
  query?: string,
  category?: string,
): Promise<SearchResult> {
  const supabase = await getSupabaseServerClient();

  let dbQuery = supabase.from("products").select(`
      *,
      vendor:vendors(
        id,
        business_name,
        business_address,
        latitude,
        longitude
      )
    `);

  if (category) {
    dbQuery = dbQuery.eq("item_category", category);
  }

  if (query) {
    dbQuery = dbQuery.or(
      `item_name.ilike.%${query}%,item_category.ilike.%${query}%`,
    );
  }

  const { data, error } = await dbQuery.order("created_at", {
    ascending: false,
  });

  if (error) return { success: false, error: error.message };

  return { success: true, data: (data ?? []) as ProductsWithVendor[] };
}
