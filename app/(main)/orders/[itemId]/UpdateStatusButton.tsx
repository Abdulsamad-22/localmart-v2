"use client";

import { useState } from "react";
import type { OrderStatus } from "@/types/order";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type Props = {
  itemId: number;
  currentStatus: OrderStatus;
  nextStatus: OrderStatus;
  nextLabel: string;
};

export function UpdateStatusButton({
  itemId,
  currentStatus,
  nextStatus,
  nextLabel,
}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const supabase = getSupabaseClient();

      const { error } = await supabase
        .from("order_items")
        .update({
          status: nextStatus,
          status_updated_at: new Date().toISOString(),
        })
        .eq("id", itemId);

      if (error) {
        toast.error("Failed to update order status. Please try again.");
        return;
      }

      toast.success(`Order marked as ${nextStatus.replace("_", " ")}`);
      router.refresh(); // re-fetch server component data
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-medium text-gray-900 mb-1">
        Update order status
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        This action cannot be undone. Status moves one step forward only.
      </p>
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#009688] hover:bg-[#00796B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-150 active:scale-95"
      >
        {loading ? (
          <>
            <i
              className="ti ti-loader-2 animate-spin text-base"
              aria-hidden="true"
            />
            Updating...
          </>
        ) : (
          <>
            <i className="ti ti-arrow-right text-base" aria-hidden="true" />
            {nextLabel}
          </>
        )}
      </button>
    </div>
  );
}
