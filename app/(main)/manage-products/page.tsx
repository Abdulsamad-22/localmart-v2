import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ProductsWithVendor } from "@/types/product";
import { ManageProductsClient } from "./ManageProductsClient";
import Link from "next/link";

export default async function ManageProductsPage() {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/manage-products");

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, business_name")
    .eq("vendor_id", user.id)
    .single();

  if (!vendor) redirect("/vendor/register");

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching products:", error.message);

  return (
    <div className="px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">
            Manage Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {products?.length ?? 0} products in your store
          </p>
        </div>

        <Link
          href="/add-product"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#009688] hover:bg-[#00796B] text-white text-sm font-medium rounded-lg transition-all"
        >
          + Add product
        </Link>
      </div>

      <ManageProductsClient
        products={(products as ProductsWithVendor[]) ?? []}
        vendorId={vendor.id}
      />
    </div>
  );
}
