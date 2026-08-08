import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { EditProductForm } from "./EditProductForm";
import type { ProductRow } from "@/types/product";

type Props = {
  params: Promise<{ productId: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { productId } = await params;
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirectTo=/manage-products/${productId}/edit`);

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id")
    .eq("vendor_id", user.id)
    .single();

  if (!vendor) redirect("/vendor/register");

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("vendor_id", vendor.id)
    .single();

  if (error || !product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900">Edit product</h1>
        <p className="text-sm text-gray-500 mt-1">{product.item_name}</p>
      </div>
      <EditProductForm product={product as ProductRow} />
    </div>
  );
}
