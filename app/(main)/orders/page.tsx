import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OrdersClient from "./OrdersClient";
import type { OrderStatus, OrderItemWithOrder } from "@/types/order";

type Props = {
  searchParams: { status?: string };
};

export default async function OrdersPage({ searchParams }: Props) {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/orders");

  const userId = user.id;

  // get vendor using auth user id
  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, business_name")
    .eq("vendor_id", userId)
    .single();

  if (!vendor) redirect("/vendor/register");

  // build query — filter by status if provided
  const validStatuses: OrderStatus[] = [
    "paid",
    "processing",
    "in_transit",
    "delivered",
    "cancelled",
  ];

  const statusFilter = searchParams.status as OrderStatus | undefined;
  const isValidStatus = statusFilter && validStatuses.includes(statusFilter);

  let query = supabase
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
      created_at
    )
  `,
    )
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });

  if (isValidStatus) {
    query = query.eq("status", statusFilter);
  }

  const { data: orderItems, error } = await query;

  if (error) {
    console.error("Error fetching orders:", error.message);
  }

  // count unread per status for badges
  const { data: counts } = await supabase
    .from("order_items")
    .select("status, is_read")
    .eq("vendor_id", vendor.id);

  const statusCounts = {
    all: counts?.length ?? 0,
    paid: counts?.filter((c) => c.status === "paid").length ?? 0,
    processing: counts?.filter((c) => c.status === "processing").length ?? 0,
    shipped: counts?.filter((c) => c.status === "shipped").length ?? 0,
    delivered: counts?.filter((c) => c.status === "delivered").length ?? 0,
    unread: counts?.filter((c) => !c.is_read).length ?? 0,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
          Orders
        </h1>
        <p className="text-sm text-gray-500 mt-1">{vendor.business_name}</p>
      </div>

      <OrdersClient
        orderItems={(orderItems as unknown as OrderItemWithOrder[]) ?? []}
        statusCounts={statusCounts}
        activeStatus={isValidStatus ? statusFilter : undefined}
      />
    </div>
  );
}
