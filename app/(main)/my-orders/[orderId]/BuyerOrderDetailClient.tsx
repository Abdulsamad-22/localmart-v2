"use client";

import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react";
import type { OrderStatus } from "@/types/order";
import type { BuyerOrderDetail } from "./page";

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

type Props = {
  order: BuyerOrderDetail;
};

export function BuyerOrderDetailClient({ order }: Props) {
  const date = new Date(order.created_at).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // group items by vendor
  const itemsByVendor = order.order_items.reduce<
    Record<string, BuyerOrderDetail["order_items"]>
  >((groups, item) => {
    const key = item.vendor_id;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});

  const deliveryName = order.is_different_delivery
    ? `${order.delivery_firstname} ${order.delivery_surname}`
    : `${order.contact_firstname} ${order.contact_surname}`;

  const deliveryPhone = order.is_different_delivery
    ? order.delivery_phone
    : order.contact_phone;

  const deliveryAddress = order.is_different_delivery
    ? order.delivery_address
    : order.contact_address;

  return (
    // review this bg
    <div className="bg-[#f7f5f9] space-y-6">
      {/* back + header */}
      <div>
        <Link
          href="/my-orders"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <CaretLeft size={16} />
          Back to orders
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-3 border-[1px] border-[#727876] rounded-[8px] py-2 px-4">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Order detail</h1>

            <p className="text-sm text-[#5A605E] mt-1">
              Ref: {order.payment_reference}
            </p>
            <p className="text-sm text-[#5A605E] mt-1">{date}</p>
          </div>
        </div>
      </div>

      {/* items grouped by vendor */}
      {Object.entries(itemsByVendor).map(([vendorId, items]) => {
        const vendorName = items[0]?.vendors?.business_name ?? "Unknown vendor";

        return (
          <div
            key={vendorId}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            {/* vendor header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50 ">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#009688] flex items-center justify-center text-white text-[12px] font-medium">
                  {vendorName[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {vendorName}
                </span>
              </div>
              <Link
                href={`/shop/${vendorId}`}
                className="text-sm text-[#009688] hover:underline"
              >
                View store
              </Link>
            </div>

            {/* vendor items */}
            <div className="divide-y divide-gray-200">
              {items.map((item) => {
                const config = statusConfig[item.status];

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    {/* product image */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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

                    {/* product info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {item.selected_size && (
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                            Size: {item.selected_size}
                          </span>
                        )}
                        {item.selected_color && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                            <span
                              className="w-2 h-2 rounded-full border border-gray-300"
                              style={{
                                backgroundColor: item.selected_color.code,
                              }}
                            />
                            {item.selected_color.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        ₦{Number(item.price).toLocaleString("en-NG")} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    {/* subtotal + status */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <p className="text-sm font-medium text-gray-900">
                        ₦{Number(item.total).toLocaleString("en-NG")}
                      </p>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${config.className}`}
                      >
                        {config.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* delivery information */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-medium text-gray-900 mb-4">
          Delivery information
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Recipient</span>
            <span className="text-gray-900 font-medium">{deliveryName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Phone</span>
            <span className="text-gray-900">{deliveryPhone}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500 flex-shrink-0">Address</span>
            <span className="text-gray-900 text-right">{deliveryAddress}</span>
          </div>
          {order.is_different_delivery && (
            <div className="flex justify-between">
              <span className="text-gray-500">Ordered by</span>
              <span className="text-gray-900">
                {order.contact_firstname} {order.contact_surname}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* order total breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-medium text-gray-900 mb-4">
          Payment summary
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-900">
              ₦{Number(order.vendor_amount).toLocaleString("en-NG")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Service fee</span>
            <span className="text-gray-900">
              ₦{Number(order.platform_fee).toLocaleString("en-NG")}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-dashed border-t border-gray-300">
            <span className="font-medium text-gray-900">Total</span>
            <span className="font-medium text-gray-900">
              ₦{Number(order.total_amount).toLocaleString("en-NG")}
            </span>
          </div>
        </div>
      </div>

      {/* payment reference */}
      {/* <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <p className="text-sm text-gray-500 mb-1">Payment reference</p>
        <p className="text-sm font-mono text-gray-900">
          {order.payment_reference}
        </p>
      </div> */}
    </div>
  );
}
