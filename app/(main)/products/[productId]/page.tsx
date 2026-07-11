import ProductDetail from "../ProductDetail";
import { getSupabaseClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ productId: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { productId } = await params;

  const numericId = parseInt(productId);

  if (isNaN(numericId)) {
    console.error("Invalid product ID:", productId);
    notFound();
  }

  const supabase = getSupabaseClient();
  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      vendor:vendors(
        id,
        business_name,
        business_address,
        latitude,
        longitude
      )
    `,
    )
    .eq("id", numericId)

    .single();

  if (error || !product) notFound();

  return <ProductDetail product={product} />;
}

export const revalidate = 60;
