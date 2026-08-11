import ShopDisplay from "@/src/components/shop/ShopDisplay";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StorefrontHero } from "@/src/components/dashboard/StoreFrontHero";
export default async function Myshop() {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/my-shop");
  }

  const { data: vendor } = await supabase
    .from("vendors")
    .select("*")
    .eq("vendor_id", user.id)
    .single();

  if (!vendor) {
    redirect("/vendor-registration?redirectTo=/my-shop");
  }

  const { data: products } = await supabase
    .from("products")
    .select(
      `*, vendor:vendors(id, business_name, business_address, latitude, longitude)`,
    )
    .eq("vendor_id", vendor.id);

  const { count: pendingCount } = await supabase
    .from("order_items")
    .select("id", { count: "exact" })
    .eq("vendor_id", vendor.id)
    .in("status", ["paid", "processing"]);

  const pendingOrders = pendingCount ?? 0;
  return (
    <div>
      <StorefrontHero
        products={products ?? []}
        vendor={vendor}
        pendingOrders={pendingOrders}
      />
      <ShopDisplay products={products ?? []} isOwner={false} />
    </div>
  );
}
