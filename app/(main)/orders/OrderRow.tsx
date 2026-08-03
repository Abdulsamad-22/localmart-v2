"use client";
import type { OrderItemWithOrder, OrderStatus } from "@/types/order";
import { CurrencyNgn } from "@phosphor-icons/react";
import Link from "next/link";

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    paid: {
      label: "New order",
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

type Props = {
  item: OrderItemWithOrder;
};

export function OrderRow({ item }: Props) {
  const status = statusConfig[item.status as OrderStatus] ?? statusConfig.paid;
  const order = item.orders;
  const buyerName = `${order?.contact_firstname} ${order?.contact_surname}`;
  const date = new Date(item.created_at).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/orders/${item.id}`}
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-150 hover:border-gray-300 hover:shadow-sm
        ${!item.is_read ? "bg-blue-50/50 border-blue-100" : "bg-white"}`}
    >
      {/* unread dot */}
      <div className="flex-shrink-0 w-2">
        {!item.is_read && <div className="w-2 h-2 rounded-full bg-blue-500" />}
      </div>

      {/* product image */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {item.product_image ? (
          <img
            src={item.product_image}
            alt={item.product_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i
              className="ti ti-photo text-gray-400 text-lg"
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* order info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {item.product_name}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {item.selected_size && (
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-600 text-gray-100">
                {item.selected_size}
              </span>
            )}
            {item.selected_color && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-gray-600 text-gray-200">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-gray-300"
                  style={{ backgroundColor: item.selected_color.code }}
                />
                {item.selected_color.name}
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-900">
          {buyerName} · Qty {item.quantity} · {date}
        </p>
        <p className="text-[11px] text-gray-500 mt-0.5">
          Ref: {item.orders?.payment_reference}
        </p>
      </div>

      {/* amount + status */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <p className="text-sm font-medium text-gray-900">
          <CurrencyNgn className="inline-block" size={16} />{" "}
          {Number(item.total).toLocaleString("en-NG")}
        </p>
        <span
          className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <i
        className="ti ti-chevron-right text-gray-400 flex-shrink-0"
        aria-hidden="true"
      />
    </Link>
  );
}
