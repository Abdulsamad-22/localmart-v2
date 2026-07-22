import { getSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ShopDisplay from "@/src/components/shop/ShopDisplay";
import { StorefrontHero } from "@/src/components/storeFront";

type Props = {
  params: Promise<{ vendorId: string }>;
};

export default async function VendorStorePage({ params }: Props) {
  const { vendorId } = await params;

  const supabase = await getSupabaseServerClient();

  const { data: vendor } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", vendorId)
    .single();

  if (!vendor) notFound();

  const { data: products } = await supabase
    .from("products")
    .select(
      `*, vendor:vendors(id, business_name, business_address, latitude, longitude)`,
    )
    .eq("vendor_id", vendorId);

  return (
    <div>
      <StorefrontHero vendor={vendor} products={products ?? []} />

      <ShopDisplay products={products ?? []} isOwner={false} />
    </div>
  );
}
