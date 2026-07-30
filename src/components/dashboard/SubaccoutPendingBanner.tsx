"use client";

import useAuthStore from "@/state-store/authStore";

export function SubaccountPendingBanner() {
  const vendorData = useAuthStore((state) => state.vendorData);

  // banner only shows when subaccount_pending is true
  if (!vendorData?.subaccount_pending) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <i
          className="ti ti-alert-triangle text-amber-600 dark:text-amber-400 text-lg mt-0.5"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            Payment setup incomplete
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
            Your Paystack payment account could not be set up during
            registration. This will be retried automatically on your next login.
            You can add products but cannot receive payments until this is
            resolved.
          </p>
        </div>
      </div>
    </div>
  );
}
