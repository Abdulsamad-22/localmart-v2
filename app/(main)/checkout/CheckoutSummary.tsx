"use client";

import useCartStore from "@/state-store/cartStore";
import { calculateCheckout } from "@/utils/calculateCheckout";
import { CurrencyNgn, Shield } from "@phosphor-icons/react";

type Pops = {
  loading: boolean;
};

export default function CheckoutSummary({ loading }: Pops) {
  const { cartItems } = useCartStore();
  const { deliveryCost, subtotal, savings, tax, total } =
    calculateCheckout(cartItems);

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm sticky top-6 px-4 pt-2 pb-4">
        <div className="py-2 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
        </div>

        <div className="space-y-4 mt-4">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              Subtotal (
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
            </span>
            <span className="flex items-center font-medium">
              <CurrencyNgn size={18} />
              {subtotal.toLocaleString("en-NG")}
            </span>
          </div>

          {/* Savings */}
          {savings > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span>Total Savings</span>
              <span className="flex items-center font-medium">
                <CurrencyNgn size={18} />
                {savings.toLocaleString("en-NG")}
              </span>
            </div>
          )}

          {/* Delivery */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Delivery</span>
            <span className="font-medium">
              {subtotal >= 50000 ? (
                <span className="text-[#009688]">FREE</span>
              ) : (
                <span className="flex items-center">
                  <CurrencyNgn size={18} />{" "}
                  {deliveryCost.toLocaleString("en-NG")}
                </span>
              )}
            </span>
          </div>

          {subtotal < 100 && (
            <div className="flex items-center text-sm text-blue-600">
              Add <CurrencyNgn size={18} />
              {(100 - subtotal).toLocaleString("en-NG")} more for FREE delivery
            </div>
          )}

          {/* Tax */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">VAT (7.5%)</span>
            <span className="flex items-center font-medium">
              <CurrencyNgn size={18} /> {tax.toLocaleString("en-NG")}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center text-[1.125rem] font-medium">
              <span>Total</span>
              <span className="flex items-center">
                <CurrencyNgn size={20} /> {total.toLocaleString("en-NG")}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="bg-[#f4edeb] flex items-center justify-center rounded-[12px] p-[0.75rem] gap-2 text-sm text-gray-500">
            <Shield size={14} />
            <span>
              This is {""}
              <span className="text-[#009668] text-[1rem]">
                carbon-neutral
              </span>{" "}
              {""}
              delivery
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#009688] to-[#00695C] text-white text-[1.125rem] font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:from-[#00897B] hover:to-[#005B4F] mt-4"
          >
            {loading
              ? "Processing..."
              : total
                ? `Pay ₦${total.toLocaleString("en-NG")}`
                : "Loading..."}
          </button>
        </div>
      </div>
    </div>
  );
}
