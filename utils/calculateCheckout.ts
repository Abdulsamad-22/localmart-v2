import { CartItem } from "@/types/cart";

export function calculateCheckout(items: CartItem[]) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.item_price * item.quantity,
    0,
  );
  const savings = items.reduce(
    (sum, item) =>
      sum + (item.product.item_price - item.product.item_price) * item.quantity,
    0,
  );
  const deliveryCost = subtotal < 50000 ? 3000 : 0; // Free delivery over Ngn 50000
  const tax = subtotal * 0.075;
  const total = subtotal + deliveryCost + tax;
  const checkoutTotal = Math.round(total * 100); // in kobo
  const splitableAmount = Math.round(subtotal * 100);

  return {
    subtotal,
    savings,
    tax,
    total,
    deliveryCost,
    splitableAmount,
    checkoutTotal,
  };
}
