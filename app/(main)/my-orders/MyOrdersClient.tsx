"use client";

import type { OrderStatus } from "@/types/order";
import Link from "next/link";
import type { BuyerOrder } from "./page";

type StatusCounts = {
  all: number;
  processing: number;
  in_transit: number;
  delivered: number;
  cancelled: number;
};

type Props = {
  orders: (BuyerOrder & { derivedStatus: OrderStatus })[];
  statusCounts: StatusCounts;
  activeStatus?: OrderStatus;
};

const tabs = [
  { label: "All", value: undefined },
  { label: "Processing", value: "processing" as OrderStatus },
  { label: "In transit", value: "in_transit" as OrderStatus },
  { label: "Delivered", value: "delivered" as OrderStatus },
  { label: "Cancelled", value: "cancelled" as OrderStatus },
];

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    paid: {
      label: "Order placed",
      className: "bg-blue-50 text-blue-700",
    },
    processing: {
      label: "Processing",
      className: "bg-amber-50 text-amber-700",
    },
    in_transit: {
      label: "In transit",
      className: "bg-purple-50 text-purple-700",
    },
    delivered: {
      label: "Delivered",
      className: "bg-green-50 text-green-700",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-50 text-red-700",
    },
  };

export function MyOrdersClient({ orders, statusCounts, activeStatus }: Props) {
  const getCount = (status?: OrderStatus) => {
    if (!status) return statusCounts.all;
    return statusCounts[status as keyof typeof statusCounts] ?? 0;
  };

  return (
    <div>
      {/* filter tabs */}
      <div className="flex gap-1 border-b border-gray-300 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeStatus === tab.value;
          const count = getCount(tab.value);
          const href = tab.value
            ? `/my-orders?status=${tab.value}`
            : "/my-orders";

          return (
            <Link
              key={tab.label}
              href={href}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-0.5 transition-colors whitespace-nowrap
                ${
                  isActive
                    ? "border-[#009688] border-b-3 rounded-b-[2px] text-[#009688]"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full
                  ${
                    isActive
                      ? "bg-[#009688]/10 text-[#009688]"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* orders list */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <i
              className="ti ti-shopping-bag text-gray-400 text-2xl"
              aria-hidden="true"
            />
          </div>
          <p className="text-gray-900 font-medium mb-1">No orders yet</p>
          <p className="text-sm text-gray-500 mb-4">
            {activeStatus
              ? `No ${activeStatus.replace("_", " ")} orders`
              : "Your orders will appear here after your first purchase"}
          </p>
          <Link
            href="/"
            className="text-sm font-medium text-[#009688] hover:underline"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.derivedStatus];
            const date = new Date(order.created_at).toLocaleDateString(
              "en-NG",
              { day: "numeric", month: "short", year: "numeric" },
            );
            const itemCount = order.order_items.length;

            return (
              <Link
                key={order.id}
                href={`/my-orders/${order.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-150"
              >
                {/* order header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order.payment_reference}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {date} · {itemCount} {itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${config.className}`}
                  >
                    {config.label}
                  </span>
                </div>

                {/* product previews — max 3 images */}
                <div className="flex items-center gap-2 mb-4">
                  {order.order_items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
                    >
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <i
                            className="ti ti-photo text-gray-400 text-sm"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  {itemCount > 3 && (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-gray-500 font-medium">
                        +{itemCount - 3}
                      </span>
                    </div>
                  )}
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-sm font-medium text-gray-900">
                      ₦{Number(order.total_amount).toLocaleString("en-NG")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[0.75rem] text-gray-500">
                  <span>
                    {order.is_different_delivery
                      ? `Delivering to ${order.delivery_address}`
                      : order.contact_firstname + " " + order.contact_surname}
                  </span>
                  <i className="ti ti-chevron-right" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
