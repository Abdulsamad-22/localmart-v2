"use client";

import { useFormContext } from "react-hook-form";
import type { VendorFormData } from "@/types/vendor";

const RETURN_POLICIES = [
  { value: "no_returns", label: "No returns accepted" },
  { value: "3", label: "3 days return window" },
  { value: "7", label: "7 days return window" },
  { value: "14", label: "14 days return window" },
  { value: "30", label: "30 days return window" },
];

export function StepPolicies() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<VendorFormData>();

  const agreed = watch("agreesToPlatformFee");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[1.125rem] font-medium text-gray-900 dark:text-white mb-0.5">
          Store Policies
        </h2>
        <p className="text-sm text-gray-400">
          Set clear expectations for your buyers
        </p>
      </div>

      {/* return policy */}
      <div>
        <label className="block text-[0.9375rem] font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Return policy
        </label>
        <p className="text-[0.75rem] text-gray-400 mb-2">
          How many days do buyers have to return a product after delivery?
        </p>
        <select
          {...register("returnPolicy")}
          className="w-full py-2.5 px-3 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent dark:bg-gray-800 dark:text-white text-gray-700"
        >
          <option value="">Select a return policy</option>
          {RETURN_POLICIES.map((policy) => (
            <option key={policy.value} value={policy.value}>
              {policy.label}
            </option>
          ))}
        </select>
        {errors.returnPolicy && (
          <p className="text-red-500 text-xs mt-1">
            {errors.returnPolicy.message}
          </p>
        )}
      </div>

      {/* delivery duration */}
      <div>
        <label className="block text-[0.9375rem] font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Average delivery time
        </label>
        <p className="text-[0.75rem] text-gray-400 mb-2">
          How long does it typically take you to deliver an order?
        </p>
        <input
          {...register("deliveryDuration")}
          type="text"
          placeholder="e.g. 1–3 business days or Same day delivery"
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent dark:bg-gray-800 dark:text-white placeholder:text-gray-400"
        />
        {errors.deliveryDuration && (
          <p className="text-red-500 text-xs mt-1">
            {errors.deliveryDuration.message}
          </p>
        )}
      </div>

      {/* platform fee agreement */}
      <div
        className={`rounded-xl border-2 p-4 transition-all
        ${
          agreed
            ? "border-[#009688] bg-[#009688]/5"
            : "border-gray-200 dark:border-gray-700"
        }`}
      >
        <div className="flex items-start gap-3">
          <input
            {...register("agreesToPlatformFee")}
            type="checkbox"
            id="platformFeeAgreement"
            className="mt-0.5 w-4 h-4 accent-[#009688] cursor-pointer flex-shrink-0"
          />
          <div>
            <label
              htmlFor="platformFeeAgreement"
              className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              I agree to LocalMart's platform fee
            </label>
            <p className="text-[0.875rem] text-gray-400 mt-1 leading-relaxed">
              LocalMart charges a{" "}
              <strong className="text-gray-700 dark:text-gray-300">
                10% service fee
              </strong>{" "}
              on every completed transaction. This fee is automatically deducted
              from your earnings before payout through Paystack. You receive 90%
              of every sale directly to your registered bank account.
            </p>
          </div>
        </div>
        {errors.agreesToPlatformFee && (
          <p className="text-red-500 text-xs mt-2 ml-7">
            {errors.agreesToPlatformFee.message}
          </p>
        )}
      </div>
    </div>
  );
}
