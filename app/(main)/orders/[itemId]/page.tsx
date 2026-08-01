import type { OrderItemDetail } from "@/types/order";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { OrderDetailClient } from "./OrderDetailClient";

type Props = {
  params: Promise<{ itemId: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const { itemId } = await params;
  const supabase = await getSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect(`/login?redirectTo=/orders/${itemId}`);

  // get vendor
  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, business_name")
    .eq("vendor_id", session.user.id)
    .single();

  if (!vendor) redirect("/vendor/register");

  // fetch the order item with parent order
  const { data: item, error } = await supabase
    .from("order_items")
    .select(
      `
      id,
      order_id,
      vendor_id,
      product_id,
      product_name,
      product_image,
      price,
      quantity,
      total,
      selected_size,
      selected_color,
      status,
      is_read,
      created_at,
      status_updated_at,
      orders (
        id,
        payment_reference,
        total_amount,
        contact_firstname,
        contact_surname,
        contact_email,
        contact_phone,
        contact_address,
        delivery_firstname,
        delivery_surname,
        delivery_email,
        delivery_phone,
        delivery_address,
        is_different_delivery,
        created_at
      )
    `,
    )
    .eq("id", itemId)
    .eq("vendor_id", vendor.id) // security — vendor can only see their own items
    .single();

  if (error || !item) notFound();

  // mark as read if not already
  if (!item.is_read) {
    await supabase
      .from("order_items")
      .update({ is_read: true })
      .eq("id", itemId);
  }

  if (!item) return <div>Order not found.</div>;
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      <OrderDetailClient
        item={item as unknown as OrderItemDetail}
        vendorId={vendor.id}
      />
    </div>
  );
}
