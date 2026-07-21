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
  const deliveryCost = 15.99; // Free delivery over Ngn 50000
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + (subtotal < 50000 ? deliveryCost : 0) + tax;
  return { subtotal, savings, tax, total, deliveryCost };
}
