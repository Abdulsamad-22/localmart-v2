import { CartItem } from "@/types/cart";
import { CheckoutVendor } from "@/types/checkout";

type SplitsValues = {
  subaccount: string;
  share: number;
  transaction_charge_type: "flat" | "percentage";
  transaction_charge: number;
};

type PaymentSplits = {
  totalAmount: number;
  splits: SplitsValues[];
  vendorTotals: Record<string, number>;
  summary: {
    totalAmount: number;
    platformFee: number;
    vendorPayouts: number;
  };
};

export default function calculatePaymentSplits(
  cartItems: CartItem[],
  vendors: CheckoutVendor[],
  platformPercentage = 10,
): PaymentSplits {
  const splits: SplitsValues[] = [];
  let totalAmount = 0;
  const vendorTotals: Record<string, number> = {};

  cartItems.forEach((item) => {
    const vendorId = String(item.product.vendor_id);
    const itemTotal = item.product.item_price * item.quantity;

    totalAmount += itemTotal;

    if (!vendorTotals[vendorId]) {
      vendorTotals[vendorId] = 0;
    }
    vendorTotals[vendorId] += itemTotal;
  });

  Object.entries(vendorTotals).forEach(([vendorId, vendorAmount]) => {
    const vendor = vendors.find((v) => String(v.id) === vendorId);

    if (
      vendor &&
      vendor.subaccount_code &&
      typeof vendor.subaccount_code === "string"
    ) {
      const platformFee = Math.round(vendorAmount * (platformPercentage / 100));
      const vendorReceives = vendorAmount - platformFee;

      splits.push({
        subaccount: vendor.subaccount_code,
        share: Math.round(vendorReceives * 100),
        transaction_charge_type: "flat",
        transaction_charge: 0,
      });
    }
  });

  return {
    totalAmount: Math.round(totalAmount * 100), // Convert to kobo
    splits,
    vendorTotals,
    summary: {
      totalAmount,
      platformFee: Object.values(vendorTotals).reduce(
        (sum, amount) => Math.round(sum + amount * (platformPercentage / 100)),
        0,
      ),
      vendorPayouts: splits.reduce((sum, split) => sum + split.share, 0) / 100,
    },
  };
}
