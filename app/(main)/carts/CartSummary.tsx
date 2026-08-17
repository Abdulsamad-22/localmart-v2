"use client";

import { getSupabaseClient } from "@/lib/supabase/client";
import useCartStore from "@/state-store/cartStore";
import { calculateCheckout } from "@/utils/calculateCheckout";
import { CurrencyNgn, ArrowRight, Shield } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";

export default function CartSummary() {
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.cartItems);
  const { subtotal, tax, savings, total, deliveryCost } =
    calculateCheckout(cartItems);

  const handleCheckout = async () => {
    try {
      const supabase = getSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?redirectTo=${pathname}`);
        return;
      }
      router.push("/checkout");
    } catch (error) {
      console.error("Error checking session:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg border border-[#dee4e1] sticky self-start z-10 top-20">
        <div className="px-4 md:px-6 py-4 border-b border-[#dee4e1]">
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
        </div>

        <div className="px-4 md:px-6 py-4 space-y-4">
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
            <span className="text-gray-600">VAT (8%)</span>
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

        <div className="px-4 md:px-6 py-4">
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
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
        hover:from-[#00897B] hover:to-[#005B4F] text-[#fff] py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            Proceed to Checkout
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
