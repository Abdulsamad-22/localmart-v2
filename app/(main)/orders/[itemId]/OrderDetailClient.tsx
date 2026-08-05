"use client";

import Link from "next/link";
import { CaretLeft, Check } from "@phosphor-icons/react";
import type { OrderStatus } from "@/types/order";
import { UpdateStatusButton } from "./UpdateStatusButton";

type OrderItemDetail = {
  id: number;
  order_id: number;
  vendor_id: string;
  product_id: number;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  total: number;
  selected_size: string | null;
  selected_color: { name: string; code: string } | null;
  status: OrderStatus;
  is_read: boolean;
  created_at: string;
  status_updated_at: string;
  orders: {
    id: number;
    payment_reference: string;
    total_amount: number;
    contact_firstname: string;
    contact_surname: string;
    contact_email: string;
    contact_phone: string;
    contact_address: string;
    delivery_firstname?: string;
    delivery_surname?: string;
    delivery_email?: string;
    delivery_phone?: string;
    delivery_address?: string;
    is_different_delivery: boolean;
    created_at: string;
  } | null;
};

type Props = {
  item: OrderItemDetail;
  vendorId: string;
};

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    className: string;
    next: OrderStatus | null;
    nextLabel: string | null;
  }
> = {
  paid: {
    label: "New order",
    className: "bg-blue-50 text-blue-700",
    next: "processing",
    nextLabel: "Start processing",
  },
  processing: {
    label: "Processing",
    className: "bg-amber-50 text-amber-700",
    next: "in_transit",
    nextLabel: "Mark as in transit",
  },
  in_transit: {
    label: "In transit",
    className: "bg-purple-50 text-purple-700",
    next: "delivered",
    nextLabel: "Mark as delivered",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-50 text-green-700",
    next: null,
    nextLabel: null,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700",
    next: null,
    nextLabel: null,
  },
};

const timeline: { status: OrderStatus; label: string }[] = [
  { status: "paid", label: "Order placed" },
  { status: "processing", label: "Processing" },
  { status: "in_transit", label: "In transit" },
  { status: "delivered", label: "Delivered" },
];

const statusOrder: OrderStatus[] = [
  "paid",
  "processing",
  "in_transit",
  "delivered",
];

export function OrderDetailClient({ item, vendorId }: Props) {
  const order = item?.orders ?? null;
  const config = statusConfig[item.status];
  const currentStatusIndex = statusOrder.indexOf(item.status);
  const date = new Date(item.created_at).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-gray-500 text-sm">Order details not found.</p>
      </div>
    );
  }

  const deliveryName = order.is_different_delivery
    ? `${order.delivery_firstname ?? ""} ${order.delivery_surname ?? ""}`.trim()
    : `${order.contact_firstname ?? ""} ${order.contact_surname ?? ""}`.trim();

  const deliveryPhone = order.is_different_delivery
    ? order.delivery_phone
    : order.contact_phone;

  const deliveryAddress = order.is_different_delivery
    ? `${order.delivery_address ?? ""}`
    : `${order.contact_address ?? ""}`.trim();

  return (
    <div className="space-y-6">
      {/* back + header */}
      <div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <CaretLeft size={16} />
          Back to orders
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-3 rounded-[8px] border-[1px] border-[#C2C8C5] py-2 px-4">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Order detail</h1>
            <p className="text-sm text-gray-500 mt-1">
              Ref: {order.payment_reference} · {date}
            </p>
          </div>
          <span
            className={`text-sm font-medium px-3 py-1.5 rounded-full ${config.className}`}
          >
            {config.label}
          </span>
        </div>
      </div>

      {/* status timeline */}
      {item.status !== "cancelled" && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-4">
            Order progress
          </h2>
          <div className="flex items-center justify-between">
            {timeline.map((step, index) => {
              const stepIndex = statusOrder.indexOf(step.status);
              const isComplete = stepIndex < currentStatusIndex;
              const isCurrent = stepIndex === currentStatusIndex;
              const isLast = index === timeline.length - 1;

              return (
                <div
                  key={step.status}
                  className="flex items-center justify-center flex-1"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                        ${
                          isComplete
                            ? "bg-[#009688] text-white"
                            : isCurrent
                              ? "bg-[#009688]/10 text-[#009688] ring-2 ring-[#009688]"
                              : "bg-gray-100 text-gray-400"
                        }`}
                    >
                      {isComplete ? (
                        <Check
                          size={14}
                          weight="bold"
                          className="text-white"
                          aria-hidden="true"
                        />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] mt-1.5 text-center whitespace-nowrap
                        ${
                          isCurrent
                            ? "text-[#009688] font-medium"
                            : isComplete
                              ? "text-gray-600"
                              : "text-gray-400"
                        }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className={`flex-1 h-0.5 mx-2 mb-4 transition-all
                        ${
                          stepIndex < currentStatusIndex
                            ? "bg-[#009688]"
                            : "bg-gray-200"
                        }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* product card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Product</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {item.product_image ? (
              <img
                src={item.product_image}
                alt={item.product_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <i
                  className="ti ti-photo text-gray-400 text-xl"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm">
              {item.product_name}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {item.selected_size && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-gray-600 text-gray-200">
                  Size: {item.selected_size}
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
            <p className="text-xs text-gray-500 mt-1">
              ₦{Number(item.price).toLocaleString("en-NG")} × {item.quantity}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-500 mt-0.5">Subtotal</p>
            <p className="font-medium text-gray-900">
              ₦{Number(item.total).toLocaleString("en-NG")}
            </p>
          </div>
        </div>
      </div>

      {/* delivery info */}
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

      {/* buyer contact */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-medium text-gray-900 mb-4">
          Buyer contact
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>

            <a
              href={`mailto:${order.contact_email}`}
              className="text-[#009688] hover:underline"
            >
              {order.contact_email}
            </a>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Phone</span>

            <a
              href={`tel:${order.contact_phone}`}
              className="text-[#009688] hover:underline"
            >
              {order.contact_phone}
            </a>
          </div>
        </div>
      </div>

      {/* status update */}
      {config.next && config.nextLabel && (
        <UpdateStatusButton
          itemId={item.id}
          currentStatus={item.status}
          nextStatus={config.next}
          nextLabel={config.nextLabel}
        />
      )}
    </div>
  );
}
