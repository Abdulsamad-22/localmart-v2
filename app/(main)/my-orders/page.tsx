import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MyOrdersClient } from "./MyOrdersClient";
import type { OrderStatus } from "@/types/order";
import { toast } from "sonner";
import { PageTransition } from "@/src/components/ui/PageTranstion";

export type BuyerOrder = {
  id: number;
  created_at: string;
  payment_reference: string;
  total_amount: number;
  contact_firstname: string;
  contact_surname: string;
  is_different_delivery: boolean;
  delivery_address: string;
  status: string;
  order_items: {
    id: number;
    product_name: string;
    product_image: string;
    price: number;
    quantity: number;
    total: number;
    status: OrderStatus;
    vendor_id: string;
  }[];
};

const statusOrder: OrderStatus[] = [
  "paid",
  "processing",
  "in_transit",
  "delivered",
  "cancelled",
];

// Least progressed status across all items
function deriveOrderStatus(items: { status: OrderStatus }[]): OrderStatus {
  if (items.length === 0) return "paid";

  const hasCancelled = items.some((i) => i.status === "cancelled");
  if (hasCancelled) return "cancelled";

  return items.reduce<OrderStatus>((worst, item) => {
    const worstIndex = statusOrder.indexOf(worst);
    const itemIndex = statusOrder.indexOf(item.status);
    return itemIndex < worstIndex ? item.status : worst;
  }, "delivered");
}

type Props = {
  searchParams: Promise<{ status: string }>;
};

export default async function MyOrdersPage({ searchParams }: Props) {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/my-orders");
  }

  const { status } = await searchParams;

  const validStatuses: OrderStatus[] = [
    "paid",
    "processing",
    "in_transit",
    "delivered",
    "cancelled",
  ];

  const statusFilter = status as OrderStatus | undefined;
  const isValidStatus = statusFilter && validStatuses.includes(statusFilter);

  // fetch orders with their items
  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      payment_reference,
      total_amount,
      contact_firstname,
      contact_surname,
      is_different_delivery,
      delivery_address,
      status,
      order_items (
        id,
        product_name,
        product_image,
        price,
        quantity,
        total,
        status,
        vendor_id
      )
    `,
    )
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    toast.error(error.message);
  }

  // derive worst case status and filter if needed
  const ordersWithStatus = (orders ?? []).map((order) => {
    const derivedStatus = deriveOrderStatus(
      order.order_items as { status: OrderStatus }[],
    );

    return {
      ...order,
      derivedStatus,
    };
  });

  const filtered = isValidStatus
    ? ordersWithStatus.filter((o) => o.derivedStatus === statusFilter)
    : ordersWithStatus;

  // counts for tab badges
  const statusCounts = {
    all: ordersWithStatus.length,
    processing: ordersWithStatus.filter((o) => o.derivedStatus === "processing")
      .length,
    in_transit: ordersWithStatus.filter((o) => o.derivedStatus === "in_transit")
      .length,
    delivered: ordersWithStatus.filter((o) => o.derivedStatus === "delivered")
      .length,
    cancelled: ordersWithStatus.filter((o) => o.derivedStatus === "cancelled")
      .length,
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-900">My orders</h1>
          <p className="text-sm text-gray-700 mt-1">Track all your purchases</p>
        </div>

        <MyOrdersClient
          orders={
            filtered as unknown as (BuyerOrder & {
              derivedStatus: OrderStatus;
            })[]
          }
          statusCounts={statusCounts}
          activeStatus={isValidStatus ? statusFilter : undefined}
        />
      </div>
    </PageTransition>
  );
}
