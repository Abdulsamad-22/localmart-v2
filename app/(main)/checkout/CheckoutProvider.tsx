"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";
import { usePaystackPayment } from "@/lib/paystack/usePayment";
import calculatePaymentSplits from "@/lib/paystack/calculatePaymentSplits";
import { useRouter } from "next/navigation";
import useCartStore from "@/state-store/cartStore";
import useAuthStore from "@/state-store/authStore";
import { getSupabaseClient } from "@/lib/supabase/client";
import { CheckoutVendor } from "@/types/checkout";
import { useState, useEffect, useMemo } from "react";
import DeliveryForm from "./DeliveryForm";
import { checkoutSchema, type CheckoutFormData } from "@/types/checkout";
import CheckoutSummary from "./CheckoutSummary";

const structureCheckoutData = (formData: CheckoutFormData) => {
  return {
    contact: {
      firstname: formData.firstName,
      surname: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    },
    delivery: formData.deliveryOption
      ? {
          firstname: formData.receiversFirstName,
          surname: formData.receiversLastName,
          email: formData.receiversEmail,
          phone: formData.receiversPhone,
          address: formData.receiversAddress,
        }
      : {
          firstname: formData.firstName,
          surname: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
    isDifferentDelivery: formData.deliveryOption || false,
  };
};

type PaystackTransaction = {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
};

export default function CheckoutProvider() {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [vendorInfo, setVendorInfo] = useState<CheckoutVendor[]>([]);

  const { cartItems, checkoutItem, setCheckoutItem } = useCartStore();
  const { user } = useAuthStore();
  const initializePayment = usePaystackPayment();

  const methods = useForm<CheckoutFormData>({
    resolver: yupResolver(
      checkoutSchema,
    ) as unknown as Resolver<CheckoutFormData>,
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      email: "",
      phone: "",
      deliveryOption: false,
      receiversFirstName: "",
      receiversLastName: "",
      receiversAddress: "",
      receiversEmail: "",
      receiversPhone: "",
    },
  });

  const itemsToCheckout = checkoutItem ? [checkoutItem] : cartItems;

  useEffect(() => {
    const fetchVendors = async () => {
      if (itemsToCheckout.length === 0) return;

      // extract unique vendor ids from products
      const vendorIds = [
        ...new Set(itemsToCheckout.map((item) => item.product.vendor_id)),
      ];

      const { data, error } = await supabase
        .from("vendors")
        .select("id, vendor_id, subaccount_code, business_name")
        .in("id", vendorIds);

      if (error) {
        console.error("Error fetching vendors:", error.message);
        toast.error("Failed to load vendor information");
        return;
      }

      setVendorInfo(data ?? []);
    };

    fetchVendors();
  }, [itemsToCheckout.length]);

  const handlePaymentSuccess = async (
    transaction: PaystackTransaction,
    paymentData: ReturnType<typeof calculatePaymentSplits>,
    checkoutData: CheckoutFormData,
  ) => {
    try {
      const orderItems = itemsToCheckout.map((item) => ({
        product_id: item.product.id,
        vendor_id: item.product.vendor_id,
        quantity: item.quantity,
        price: item.product.item_price,
        selected_color: item.selectedColor?.code ?? null,
        selected_size: item.selectedSize ?? null,
      }));

      const { error: orderError } = await supabase.from("orders").insert([
        {
          buyer_id: user!.id,
          reference: transaction.reference,
          status: "pending_verification",
          total: paymentData.totalAmount / 100,
          delivery_address: checkoutData.receiversAddress,
          delivery_city: checkoutData.receiversAddress,
          delivery_state: checkoutData.receiversAddress,
          items: orderItems,
          created_at: new Date().toISOString(),
        },
      ]);

      if (orderError) {
        console.error("Order creation error:", orderError);
        toast.error(
          "Payment successful but order creation failed. Please contact support with reference: " +
            transaction.reference,
        );
        return;
      }

      // clean up checkout state only after order is created
      setCheckoutItem(null);
      // clearCart();

      toast.success("Payment successful! Your order has been placed.");
      router.replace("/orders"); // redirect to orders page
    } catch (error) {
      console.error("Error handling payment success:", error);
      toast.error(
        "Payment was successful but something went wrong. Contact support with reference: " +
          transaction.reference,
      );
    }
  };

  const handlePaymentClose = () => {
    toast.info("Payment cancelled");
  };

  const paymentData = useMemo(() => {
    if (itemsToCheckout.length === 0 || vendorInfo.length === 0) return null;
    return calculatePaymentSplits(itemsToCheckout, vendorInfo, 7);
  }, [itemsToCheckout, vendorInfo]);

  const onSubmit = async (checkoutData: CheckoutFormData) => {
    try {
      setLoading(true);
      if (!paymentData) {
        toast.error("Please wait, loading vendor information...");
        return;
      }

      if (!user?.email) {
        toast.error("Please log in to continue");
        router.push(`/login?redirectTo=/checkout`);
        return;
      }

      if (itemsToCheckout.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      if (vendorInfo.length === 0) {
        toast.error("Please wait, loading vendor information...");
        return;
      }

      if (paymentData.splits.length === 0) {
        toast.error(
          "Some vendors have incomplete payment setup. Cannot proceed.",
        );
        return;
      }

      // build paystack config
      const config = {
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: user.email,
        amount: Math.round(paymentData.totalAmount),
        reference: `localmart_${Date.now()}_${user.id}`,
        metadata: {
          customer_id: user.id,
          order_items: itemsToCheckout.length,
          vendor_count: vendorInfo.length,
        },
      };

      // single vendor — use subaccount
      if (paymentData.splits.length === 1) {
        const split = paymentData.splits[0];
        if (!split.subaccount) {
          toast.error("Vendor payment setup incomplete. Cannot proceed.");
          return;
        }
        Object.assign(config, { subaccount: split.subaccount });
      }

      // multiple vendors — use split
      if (paymentData.splits.length > 1) {
        Object.assign(config, {
          split: {
            type: "flat",
            bearer_type: "all-proportional",
            subaccounts: paymentData.splits.map((split) => ({
              subaccount: split.subaccount,
              share: Math.round(split.share),
            })),
          },
        });
      }

      const result = initializePayment(
        config,
        (transaction) =>
          handlePaymentSuccess(transaction, paymentData, checkoutData),
        handlePaymentClose,
      );

      if (!result.success) {
        toast.error(result.error ?? "Payment initialization failed");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Checkout failed";
      console.error("Checkout error:", error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#009688] text-[1.75rem] text-[#fff] text-center font-semibold p-8 mt-[5rem]">
        <h2 className="">Checkout</h2>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-[60%_38%] gap-12 px-4 md:px-12 my-4 md:my-8"
        >
          <DeliveryForm />
          <CheckoutSummary />
          <button
            type="submit"
            disabled={loading || itemsToCheckout.length === 0}
            className="w-full bg-gradient-to-r from-[#009688] to-[#00695C] text-white py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:from-[#00897B] hover:to-[#005B4F]"
          >
            {loading
              ? "Processing..."
              : paymentData
                ? `Pay ₦${(paymentData.totalAmount / 100).toLocaleString("en-NG")}`
                : "Loading..."}
          </button>
        </form>
      </FormProvider>
    </>
  );
}
