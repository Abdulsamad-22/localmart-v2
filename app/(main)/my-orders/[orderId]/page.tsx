import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import type { OrderStatus } from "@/types/order";
import { BuyerOrderDetailClient } from "./BuyerOrderDetailClient";

export type BuyerOrderDetail = {
  id: number;
  created_at: string;
  payment_reference: string;
  total_amount: number;
  platform_fee: number;
  vendor_amount: number;
  status: string;
  contact_firstname: string;
  contact_surname: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  is_different_delivery: boolean;
  delivery_firstname: string;
  delivery_surname: string;
  delivery_email: string;
  delivery_phone: string;
  delivery_address: string;
  order_items: {
    id: number;
    product_name: string;
    product_image: string;
    price: number;
    quantity: number;
    total: number;
    selected_size: string | null;
    selected_color: { name: string; code: string } | null;
    status: OrderStatus;
    vendor_id: string;
    vendors: {
      business_name: string;
    } | null;
  }[];
};

type Props = {
  params: Promise<{ orderId: string }>;
};

export default async function BuyerOrderDetailPage({ params }: Props) {
  const { orderId } = await params;
  const supabase = await getSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect(`/login?redirectTo=/my-orders/${orderId}`);

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      payment_reference,
      total_amount,
      platform_fee,
      vendor_amount,
      status,
      contact_firstname,
      contact_surname,
      contact_email,
      contact_phone,
      contact_address,
      is_different_delivery,
      delivery_firstname,
      delivery_surname,
      delivery_email,
      delivery_phone,
      delivery_address,
      order_items (
        id,
        product_name,
        product_image,
        price,
        quantity,
        total,
        selected_size,
        selected_color,
        status,
        vendor_id,
        vendors (
          business_name
        )
      )
    `,
    )
    .eq("id", orderId)
    .eq("customer_id", session.user.id) // security — buyer can only see their own orders
    .single();

  if (error || !order) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      <BuyerOrderDetailClient order={order as unknown as BuyerOrderDetail} />
    </div>
  );
}
