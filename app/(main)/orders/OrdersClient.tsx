"use client";

import type { OrderItemWithOrder, OrderStatus } from "@/types/order";
import { OrderRow } from "./OrderRow";
import Link from "next/link";

type StatusCounts = {
  all: number;
  paid: number;
  processing: number;
  shipped: number;
  delivered: number;
  unread: number;
};

type Props = {
  orderItems: OrderItemWithOrder[];
  statusCounts: StatusCounts;
  activeStatus?: OrderStatus;
};

const tabs = [
  { label: "All", value: undefined },
  { label: "New", value: "paid" as OrderStatus },
  { label: "Processing", value: "processing" as OrderStatus },
  { label: "In transit", value: "in transit" as OrderStatus },
  { label: "Delivered", value: "delivered" as OrderStatus },
];

export default function OrdersClient({
  orderItems,
  statusCounts,
  activeStatus,
}: Props) {
  const getCount = (status?: OrderStatus) => {
    if (!status) return statusCounts.all;
    if (status === "paid") return statusCounts.paid;
    if (status === "processing") return statusCounts.processing;
    if (status === "in_transit") return statusCounts.shipped;
    if (status === "delivered") return statusCounts.delivered;
    return 0;
  };

  return (
    <div>
      {/* filter tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeStatus === tab.value;
          const count = getCount(tab.value);
          const href = tab.value ? `/orders?status=${tab.value}` : "/orders";

          return (
            <Link
              key={tab.label}
              href={href}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${
                  isActive
                    ? "border-[#009688] text-[#009688]"
                    : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full
                  ${
                    isActive
                      ? "bg-[#009688]/10 text-[#009688]"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}

        {/* unread badge on All tab */}
        {statusCounts.unread > 0 && !activeStatus && (
          <span className="ml-auto self-center mr-2 text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {statusCounts.unread} unread
          </span>
        )}
      </div>

      {/* order list */}
      {orderItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <i
              className="ti ti-package text-gray-400 text-2xl"
              aria-hidden="true"
            />
          </div>
          <p className="text-gray-900 dark:text-white font-medium mb-1">
            No orders yet
          </p>
          <p className="text-sm text-gray-500">
            {activeStatus
              ? `No ${activeStatus} orders found`
              : "Orders will appear here when buyers purchase your products"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orderItems.map((item) => (
            <OrderRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
