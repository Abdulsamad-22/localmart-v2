import { CreateOrderParams, Order } from "@/types/order";
import { getSupabaseClient } from "../supabase/client";

export async function createOrder({
  cartItems,
  vendors,
  checkoutData,
  paymentReference,
  paymentData,
  buyerId,
}: CreateOrderParams): Promise<Order> {
  const supabase = getSupabaseClient();

  // total vendor payouts across all vendors
  const totalVendorAmount = paymentData.summary.vendorPayouts;
  const totalPlatformFee = paymentData.summary.platformFee;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: buyerId,
      payment_reference: paymentReference,
      total_amount: paymentData.totalAmount / 100, // kobo to naira
      platform_fee: totalPlatformFee,
      vendor_amount: totalVendorAmount,
      status: "paid",
      is_read: false,

      // contact info — who is paying
      contact_firstname: checkoutData.firstName,
      contact_surname: checkoutData.lastName,
      contact_email: checkoutData.email,
      contact_phone: checkoutData.phone,
      contact_address: checkoutData.address,

      // delivery info
      is_different_delivery: checkoutData.deliveryOption ?? false,
      delivery_firstname: checkoutData.deliveryOption
        ? checkoutData.receiversFirstName
        : checkoutData.firstName,
      delivery_surname: checkoutData.deliveryOption
        ? checkoutData.receiversLastName
        : checkoutData.lastName,
      delivery_email: checkoutData.deliveryOption
        ? checkoutData.receiversEmail
        : checkoutData.email,
      delivery_phone: checkoutData.deliveryOption
        ? checkoutData.receiversPhone
        : checkoutData.phone,
      delivery_address: checkoutData.deliveryOption
        ? checkoutData.receiversAddress
        : checkoutData.address,

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (orderError) throw new Error(orderError.message);

  // Order items with snapshots

  const orderItems = cartItems.map((item) => {
    const vendorId = String(item.product.vendor_id);
    const vendorTotal = paymentData.vendorTotals[vendorId] ?? 0;
    const itemSubtotal = item.product.item_price * item.quantity;

    // calculate this item's share of vendor payout proportionally
    const cartVendorTotal = cartItems
      .filter((i) => String(i.product.vendor_id) === vendorId)
      .reduce((sum, i) => sum + i.product.item_price * i.quantity, 0);

    const itemVendorAmount =
      cartVendorTotal > 0 ? (itemSubtotal / cartVendorTotal) * vendorTotal : 0;

    return {
      order_id: order.id,
      vendor_id: item.product.vendor_id,
      product_id: item.product.id,

      // snapshots — never reference products table for order history
      product_name: item.product.item_name,
      product_image: item.product.image_url,

      price: item.product.item_price,
      quantity: item.quantity,
      total: itemSubtotal,

      // buyer selections
      selected_size: item.selectedSize ?? null,
      selected_color: item.selectedColor ?? null,

      // per-item status
      status: "paid",
      is_read: false,
      status_updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    // order exists but items failed — log for manual resolution
    console.error(
      `Order ${order.id} created but items insert failed:`,
      itemsError.message,
    );

    // store for support team
    await supabase.from("orphaned_images").insert([
      {
        path: `order_missing_items:${order.id}`,
        reason: itemsError.message,
      },
    ]);

    throw new Error(
      `Order created but items failed to save. Reference: ${paymentReference}`,
    );
  }

  return order;
}
